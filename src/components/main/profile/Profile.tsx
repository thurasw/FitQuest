import { View, Text } from "react-native";
import FQButton from "../../common/FQButton";
import { useAuth } from "../../../providers/AuthProvider";
import Container from "../../common/Container";
import { useUser } from "../../../firestore/user.api";
import { AvatarImage } from "../avatar/Avatar";
import { get2DAvatarModel } from "../../../api/endpoints.api";
import { getCurrentLevel, getLevelImage, getLevelProgress, getRequiredPoints } from "../../../utils/points.utils";
import { BadgeImage } from "../home/HomeHeader";
import EditProfileModal from "./EditProfileModal";
import { useState } from "react";

export default function Profile() {

    const auth = useAuth();
    const { data: user } = useUser();
    const [ editProfile, setEditProfile ] = useState(false);

    if (!user) return <></>;

    const level = getCurrentLevel(user.lifetimePoints);
    const percent = getLevelProgress(user.lifetimePoints) * 100;
    const requiredPoints = getRequiredPoints(user.lifetimePoints);

    return (
        <Container className='px-5'>
            <View className='flex-1'>
                <View className='flex flex-row justify-between items-center'>
                    <AvatarImage
                        url={get2DAvatarModel(user.rpm.avatarId!, user.rpm.assets?.updatedAt)}
                        height={200}
                    />
                    <View className='ps-0 p-5'>
                        <BadgeImage
                            source={getLevelImage(level)}
                            height={100}
                        />
                    </View>
                </View>
                {/* Progress bar */}
                <View className='my-3'>
                    <Text className='text-center font-extrabold text-3xl text-primary-900 mb-5'>
                        Level { level }
                    </Text>
                    <View className='bg-slate-300 rounded-full h-3'>
                        <View
                            className='bg-primary-900 rounded-full h-full'
                            style={{ width: `${percent}%` }}
                        />
                    </View>
                    {
                        level !== 10 && (
                            <Text className='ms-auto text-slate-400 mt-2'>
                                { user.lifetimePoints } / { requiredPoints + user.lifetimePoints }
                            </Text>
                        )
                    }
                </View>
                <View className='flex flex-col gap-2'>
                    <View className='flex flex-row'>
                        <Text className='font-semibold'>Total Earned Points: </Text>
                        <Text>{ user.lifetimePoints }</Text>
                    </View>
                    <View className='flex flex-row'>
                        <Text className='font-semibold'>Current Points: </Text>
                        <Text>{ user.points }</Text>
                    </View>
                    <View className='flex flex-row'>
                        <Text className='font-semibold'>Spent Points: </Text>
                        <Text>{ user.lifetimePoints - user.points }</Text>
                    </View>
                </View>
                <View className='mb-10 mt-auto'>
                    <FQButton
                        className='border-2 border-primary-900 rounded-xl px-4 py-3 mb-3'
                        textProps={{
                            className: 'text-primary-900'
                        }}
                        label='Edit Profile'
                        onPress={() => setEditProfile(true)}
                    />
                    <EditProfileModal
                        show={editProfile}
                        onClose={() => setEditProfile(false)}
                    />
                    <FQButton
                        className='bg-primary-900 rounded-xl px-4 py-3 border-2 border-primary-900'
                        textProps={{
                            className: 'text-white'
                        }}
                        label='Log out'
                        onPress={() => auth.signOut()}
                    />
                </View>
            </View>
        </Container>
    )
};