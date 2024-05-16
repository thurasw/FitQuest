import { View, Text, Alert } from "react-native";
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
import { Ionicons } from '@expo/vector-icons';
import EditPasswordModal from "./EditPasswordModal";
import AssignRoutinesModal from "../routines/AssignRoutinesModal";
import * as Clipboard from 'expo-clipboard';

export default function Profile() {

    const auth = useAuth();
    const { data: user } = useUser();
    const [ editProfile, setEditProfile ] = useState(false);
    const [ editPw, setEditPw ] = useState(false);
    const [ assignModal, setAssignModal ] = useState(false);

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
                    <View className='bg-slate-300 rounded-xl' style={{ height: 8 }}>
                        <View
                            className='bg-primary-900 rounded-xl h-full'
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
                    <View className='flex flex-row items-center mt-3'>
                        <Text className='font-semibold'>Friend code: </Text>
                        <Text>{ auth.user?.uid ?? '-' }</Text>

                        <FQButton
                            className='rounded-xl px-0 py-0 ms-3'
                            onPress={() => {
                                Clipboard.setStringAsync(auth.user?.uid ?? '')
                                Alert.alert('Copied to clipboard');
                            }}
                        >
                            <Ionicons name="clipboard-outline" size={18} color="black" />
                        </FQButton>
                    </View>
                </View>
                <View className='mb-10 mt-auto'>
                    <FQButton
                        className='bg-slate-300 rounded-xl px-4 py-3 mb-3 flex flex-row items-center gap-3'
                        onPress={() => setAssignModal(true)}
                    >
                        <Ionicons name="calendar" size={20} color="black" />
                        <Text>Workout Schedule</Text>
                    </FQButton>
                    <AssignRoutinesModal show={assignModal} onClose={() => setAssignModal(false)} />
                    <FQButton
                        className='bg-slate-300 rounded-xl px-4 py-3 mb-3 flex flex-row items-center gap-3'
                        onPress={() => setEditProfile(true)}
                    >
                        <Ionicons name="pencil" size={20} color="black" />
                        <Text>Edit Profile</Text>
                    </FQButton>
                    <EditProfileModal
                        show={editProfile}
                        onClose={() => setEditProfile(false)}
                    />
                    <FQButton
                        className='bg-slate-300 rounded-xl px-4 py-3 mb-3 flex flex-row items-center gap-3'
                        onPress={() => setEditPw(true)}
                    >
                        <Ionicons name="key" size={20} color="black" />
                        <Text>Update Password</Text>
                    </FQButton>
                    <EditPasswordModal show={editPw} onClose={() => setEditPw(false)} />
                    <FQButton
                        className='bg-slate-300 rounded-xl px-4 py-3 flex flex-row items-center gap-3'
                        onPress={() => auth.signOut()}
                    >
                        <Ionicons name="log-out" size={20} color="black" />
                        <Text>Sign Out</Text>
                    </FQButton>
                </View>
            </View>
        </Container>
    )
};