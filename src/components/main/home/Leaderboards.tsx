import { View, Text, Alert } from "react-native";
import { AvatarImage } from "../avatar/Avatar";
import { get2DAvatarModel } from "../../../api/endpoints.api";
import { BadgeImage } from "./HomeHeader";
import { getCurrentLevel, getLevelImage } from "../../../utils/points.utils";
import FQButton from "../../common/FQButton";
import { Ionicons } from '@expo/vector-icons';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { editUser, useUser, useUsers } from "../../../firestore/user.api";
import { useAuth } from "../../../providers/AuthProvider";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

export default function Leaderboards({ user } : { user: FitQuest.User }) {

    const auth = useAuth();
    const connectFb = async() => {
        try {
            let status = await getTrackingPermissionsAsync();
            if (status.canAskAgain) {
                status = await requestTrackingPermissionsAsync();
            }
            if (!status.granted) {
                return Alert.alert('Error', 'You must enable tracking permissions to connect to Facebook.');
            }
            const res = await LoginManager.logInWithPermissions(['public_profile', 'user_friends'], "enabled");
            if (res.isCancelled) {
                throw new Error();
            }
            const token = await AccessToken.getCurrentAccessToken();
            if (token?.userID) {
                await editUser(auth.user!.uid, { facebookId: token.userID, facebookToken: token.accessToken });
            }
        }
        catch(err) {
            Alert.alert('Error', 'An error occurred while connecting to Facebook. Please try again later.');
            console.error(err);
        }
    }

    useEffect(() => {
        getFriends();
    }, [ user.facebookToken ]);

    const getFriends = async() => {
        if (!user.facebookToken) return;

        const friendsReq = new GraphRequest('/me/friends', {
            accessToken: user.facebookToken
        }, (err, result) => {
            if (err) {
                console.error(err);
                return Alert.alert('Error', 'An error occurred while connecting to Facebook. Please try again later.');
            }

            const friends = (result?.data as any).map((f: any) => f.id);
            setFriends(friends);
        });

        new GraphRequestManager().addRequest(friendsReq).start();
    }

    const [ friends, setFriends ] = useState<string[]>([]);
    const { data: users } = useUsers((query) => {
        if (!user.facebookId) return query.where('firstName', '==', user.firstName).where('lastName', '==', user.lastName).limit(1);
        if (friends.length === 0) return query.where('facebookId', '==', user.facebookId)
        return query.where(
            firestore.Filter.or(
                firestore.Filter('facebookId', '==', user.facebookId),
                firestore.Filter('facebookId', 'in', friends)
            )
        ).orderBy('lifetimePoints', 'desc');
    });

    return (
        <View className='p-5 bg-slate-200 rounded-lg'>
            <Text className='text-xl font-bold text-slate-900'>Leaderboards</Text>
            <View className='mt-3 flex flex-col gap-2'>
                {
                    user.facebookId === null ? (
                        <>
                            <LeaderboardItem user={user} />
                            <FQButton className='bg-blue-800 mt-5 mx-5 flex flex-row items-center' onPress={connectFb}>
                                <Ionicons name="logo-facebook" size={24} color="white" />
                                <Text className='text-white ms-3'>Connect to Facebook to find friends</Text>
                            </FQButton>
                        </>
                    ) : users !== undefined && (
                        <>
                            {
                                users.map((u, i) => (
                                    <LeaderboardItem key={u.facebookId} user={u} />
                                ))
                            }
                        </>
                    )
                }
            </View>
        </View>
    )
}

interface LeaderboardItemProps {
    user: FitQuest.User;
}
function LeaderboardItem({ user } : LeaderboardItemProps) {
    return (
        <View className='bg-slate-100 rounded-lg pe-3 flex flex-row items-center'>
            <AvatarImage
                height={60}
                url={get2DAvatarModel(user.rpm.avatarId!, user.rpm.assets?.updatedAt)}
                style={{
                    transform: [{ scale: 1.3 }],
                    marginBottom: 5
                }}
            />
            <View className='flex flex-col ms-3'>
                <Text className='text-lg font-semibold'>{ user.firstName } { user.lastName }</Text>
                <Text>{ user.lifetimePoints } points earned</Text>
            </View>
            <BadgeImage
                height={40}
                source={getLevelImage(getCurrentLevel(user.lifetimePoints))}
                className='ms-auto'
            />
        </View>
    )
}