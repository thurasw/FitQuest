import { View, Text, Alert, Pressable, ActivityIndicator } from "react-native";
import { AvatarImage } from "../avatar/Avatar";
import { get2DAvatarModel } from "../../../api/endpoints.api";
import { BadgeImage } from "./HomeHeader";
import { getCurrentLevel, getLevelImage } from "../../../utils/points.utils";
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { editUser, useUsers } from "../../../firestore/user.api";
import { useAuth } from "../../../providers/AuthProvider";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import LeaderboardsModal from "./LeaderboardsModal";
import { getFriendDocument, useFriends } from "../../../firestore/friends.api";

type Friend = { id: string; isPending: boolean; accepted: boolean };

export default function Leaderboards({ user } : { user: FitQuest.User }) {

    //modal
    const [ showModal, setShowModal ] = useState(false);

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

    const getFriends = async() => {
        if (!user.facebookToken) return;

        const friendsReq = new GraphRequest('/me/friends', {
            accessToken: user.facebookToken
        }, (err, result) => {
            if (err) {
                console.error(err);
            }

            const friends = (result?.data as any).map((f: any) => f.id);
            setFriends(friends);
        });

        new GraphRequestManager().addRequest(friendsReq).start();
    }

    const { snapshot: friendsSnapshot, data: friendsData } = useFriends();
    const [ friends, setFriends ] = useState<Friend[]>([]);

    useEffect(() => {
        if (!friendsSnapshot) return;

        const f = friendsSnapshot.docs
        .map(async (d) => ({
            id: d.id,
            ...d.data(),
            isPending: (await getFriendDocument(d.id, auth.user!.uid).get()).data()?.accepted === false
        }));

        Promise.all(f)
        .then(setFriends)
        .catch(console.error);
    }, [ friendsData ]);

    const { snapshot: uData } = useUsers((query) => {
        // You've accepted and they've accepted
        const filtered = friends.filter(f => f.accepted && !f.isPending).map(f => f.id);

        if (filtered.length === 0) return query.where(firestore.FieldPath.documentId(), '==', auth.user!.uid);
        return query.where(
            firestore.Filter.or(
                firestore.Filter(firestore.FieldPath.documentId(), '==', auth.user!.uid),
                firestore.Filter(firestore.FieldPath.documentId(), 'in', filtered)
            )
        );
    });
    const users = uData?.docs.map(u => ({ ...u.data(), id: u.id })) ?? [];

    return (
        <>
            <Pressable onPress={() => setShowModal(true)}>
                <View className='p-5 bg-slate-200 rounded-lg'>
                    <Text className='text-xl font-bold text-slate-900'>Leaderboards</Text>
                    <View className='mt-3 flex flex-col gap-2'>
                    { users.length === 0 && (user ? <LeaderboardItem index={1} background='light' user={user} selected /> : <ActivityIndicator /> )}
                    {
                        users?.map((u, i) => (
                            <LeaderboardItem key={u.facebookId} index={i + 1} user={u} background='light' selected={u.id === auth.user?.uid} />
                        ))
                    }
                    </View>
                </View>
            </Pressable>
            <LeaderboardsModal show={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}

interface LeaderboardItemProps {
    user: FitQuest.User;
    background: 'light' | 'dark';
    index: number;
    selected: boolean;
}
export function LeaderboardItem({ user, background, index, selected } : LeaderboardItemProps) {
    return (
        <View className={`${ selected ? 'bg-primary-200' : background === 'light' ? 'bg-slate-100' : 'bg-slate-200' } rounded-lg px-3 flex flex-row flex-nowrap items-center`}>
            <Text className='text-3xl font-bold text-slate-400'> {index}. </Text>
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