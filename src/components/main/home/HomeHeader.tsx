import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Modal, Text, TouchableOpacity, View } from "react-native";
import { getCurrentLevel, getLevelImage, getLevelProgress, getRequiredPoints } from "../../../utils/points.utils";
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeHeader({ user } : { user: FitQuest.User }) {
    const { lifetimePoints, points, firstName, lastName } = user;
    const { top } = useSafeAreaInsets();

    //Model states
    const [ showLevelInfo, setShowLevelInfo ] = useState(false);
    
    return (
        <View
            className='flex flex-row items-center justify-between bg-white px-5 pb-3'
            style={{ paddingTop: top }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                className='flex flex-row items-center gap-3'
                onPress={() => setShowLevelInfo(true)}
            >
                <BadgeImage
                    source={getLevelImage(getCurrentLevel(lifetimePoints))}
                    height={40}
                />
                <Text className='text-xl font-semibold'>
                    { firstName } { lastName }
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                className='px-3 py-2 bg-slate-100 rounded-lg flex flex-row items-center gap-2'
                onPress={() => setShowLevelInfo(true)}
            >
                <FontAwesome6 name='coins' size={20} color='rgb(250,190,8)' />
                <Text className='font-semibold'>
                    { points }
                </Text>
            </TouchableOpacity>
            <LevelInfoModal
                show={showLevelInfo}
                onClose={() => setShowLevelInfo(false)}
                user={user}
            />
        </View>
    )
}

interface LevelInfoModalProps {
    show: boolean;
    onClose: () => void;
    user: FitQuest.User;
}
function LevelInfoModal({ show, onClose, user }: LevelInfoModalProps) {

    const level = getCurrentLevel(user.lifetimePoints);
    const percent = getLevelProgress(user.lifetimePoints) * 100;
    const requiredPoints = getRequiredPoints(user.lifetimePoints);

    return (
        <Modal
            visible={show}
            onRequestClose={onClose}
            transparent={true}
            animationType='fade'
        >
            <View className='w-full h-full bg-black/75 flex items-center justify-center'>
                <TouchableOpacity className='absolute h-full w-full' onPressOut={onClose} />
                <View className='bg-white rounded-lg p-8 self-stretch mx-10 flex flex-col gap-4'>
                    {/* Badge */}
                    <View className='flex flex-row items-center justify-center px-10'>
                        <BadgeImage
                            height={85}
                            source={getLevelImage(level)}
                        />
                        {
                            level !== 10 && (
                                <View className='flex flex-row items-center ms-6'>
                                    <MaterialCommunityIcons name="chevron-double-right" size={24} color='black' />
                                    <View className='ms-6 opacity-35'>
                                        <BadgeImage source={getLevelImage(level + 1)} height={85}  />
                                    </View>
                                </View>
                            )
                        }
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
                </View>
            </View>
        </Modal>
    )
}

interface BadgeImageProps {
    source: ImageSourcePropType;
    height: number;
}
export function BadgeImage({ source, height } : BadgeImageProps) {

    const img = Image.resolveAssetSource(source);
    const width = height * img.width / img.height;

    return (
        <Image
            source={source}
            style={{ width, height }}
        />
    )
}
