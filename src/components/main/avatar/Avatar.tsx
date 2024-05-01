import { ActivityIndicator, Alert, Image, Platform, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Container from "../../common/Container";
import FQButton from "../../common/FQButton";
import AvatarEditorModal from "./AvatarEditorModal";
import { useEffect, useRef, useState } from "react";
import { editUser, useUser } from "../../../firestore/user.api";
import { getCurrentLevel } from "../../../utils/points.utils";
import { get2DAvatarModel } from "../../../api/endpoints.api";
import { useAuth } from "../../../providers/AuthProvider";
import NewAvatarModal from "./NewAvatarModal";

export default function Avatar() {
    const { user } = useAuth();
    const { data: userData } = useUser();
    const { width } = useWindowDimensions();

    const [ selectedLevel, setSelectedLevel ] = useState(1);
    const [ showEditor, setShowEditor ] = useState(false);    

    if (!userData) return <></>;
    
    const currentLevel = getCurrentLevel(userData.lifetimePoints);
    const cardWidth = width * 0.8;
    const cardSpacing = width * 0.1 - 10; /* 10 is the margin set on the card component */

    const selectedAvatar = userData.avatars[selectedLevel - 1];

    const handleSetActive = () => {
        Alert.alert('Set avatar', 'This avatar will be displayed on your profile and leaderboards!', [
            {
                style: 'cancel',
                text: 'Cancel'
            },
            {
                text: 'Save',
                onPress: async() => {
                    // Update user's active avatar
                    if (!selectedAvatar) return;
                    await editUser(user!.uid, {
                        'rpm.avatarId': selectedAvatar.avatarId,
                        'rpm.templateId': selectedAvatar.templateId,
                        'rpm.gender': selectedAvatar.gender,
                        'rpm.assets': selectedAvatar.assets
                    });
                }
            }
        ]);
    }
    
    return (
        <Container className='py-5'>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={0.9}
                    disableIntervalMomentum
                    snapToInterval={cardWidth+10}
                    snapToAlignment='center'
                    contentInset={{
                        top: 0,
                        left: cardSpacing,
                        bottom: 0,
                        right: cardSpacing
                    }}
                    contentOffset={{
                        x: -cardSpacing,
                        y: 0
                    }}
                    contentContainerStyle={{
                        // `contentInset` alternative for android
                        paddingHorizontal: Platform.OS === 'android' ? cardSpacing : 0
                    }}
                    scrollEventThrottle={0}
                    onScroll={(ev) => {
                        const offsetX = ev.nativeEvent.contentOffset.x;
                        const newLevel = Math.round(offsetX / (cardWidth + 10));
                        setSelectedLevel(newLevel + 1);
                    }}
                >
                    {
                        Array(currentLevel + 1)
                        .fill(null)
                        .map((_, idx) => {
                            const level = idx + 1;
                            return (
                                <AvatarCard
                                    key={idx}
                                    width={cardWidth}
                                    user={userData}
                                    level={level}
                                    loadImage={level >= selectedLevel - 1 && level <= selectedLevel + 1}
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>

            {
                selectedAvatar !== undefined && (
                    <View className='px-5 mt-2'>
                        {
                            userData.rpm.avatarId !== selectedAvatar.avatarId ? (
                                <FQButton
                                    label='Set as active'
                                    className='bg-primary-700 mt-3'
                                    style={{ borderRadius: 50 }}
                                    textProps={{ className: 'text-white' }}
                                    onPress={handleSetActive}
                                />
                            ) : (
                                <Text className='font-semibold text-lg text-center mb-3'>
                                    Active Avatar
                                </Text> 
                            )
                        }
                        <FQButton
                            className='bg-primary-900 mt-3'
                            textProps={{ className: 'text-white' }}
                            label='Edit Avatar'
                            style={{ borderRadius: 50 }}
                            onPress={() => setShowEditor(true)}
                        />
                        <AvatarEditorModal
                            show={showEditor}
                            onClose={() => setShowEditor(false)}
                            avatarToEdit={selectedAvatar}
                        />
                    </View>
                )
            }
        </Container>
    )
};

interface AvatarCardProps {
    width: number;
    user: FitQuest.User;
    level: number;
    loadImage: boolean;
}
function AvatarCard({ width, user, level, loadImage }: AvatarCardProps) {
    const { avatars, lifetimePoints } = user;

    const avatar = avatars[level - 1];
    const hasUnlocked = getCurrentLevel(lifetimePoints) >= level;
    const hasSet = avatar !== undefined;

    const [ showCreate, setShowCreate ] = useState(false);

    return (
        <View
            style={{ width, margin: 5 }}
            className={`rounded-xl flex flex-col items-center justify-center
            ${ hasUnlocked ? 'bg-slate-300' : 'bg-slate-200' }
            border-4 border-dashed
            ${ (hasUnlocked && hasSet) ? 'border-transparent' : 'border-slate-500' }`}
        >
            {
                !hasUnlocked ? (
                    <View style={{ height: 450 }} className='flex flex-col items-center justify-center'>
                        <Text className='text-2xl text-bold text-slate-500'>
                            Unlocks at level {level}
                        </Text>
                    </View>
                ) :
                hasSet ? (
                    <View>
                        {
                            loadImage ? (
                                <AvatarImage key={avatar.avatarId} height={450} url={get2DAvatarModel(avatar.avatarId, avatar.assets.updatedAt)} />
                            ) : (
                                <View style={{ height: 450 }} className='flex flex-col items-center justify-center'>
                                    <ActivityIndicator />
                                </View>
                            )
                        }
                    </View>
                ) : (
                    <View style={{ height: 450 }} className='flex flex-col items-center px-10 justify-center'>
                        <Text className='text-2xl text-slate-500'>
                            Setup your level {level} avatar!
                        </Text>

                        <FQButton
                            className='bg-primary-900 mt-5 px-8'
                            label='Create Avatar'
                            style={{ borderRadius: 50 }}
                            textProps={{ className: 'text-white' }}
                            onPress={() => setShowCreate(true)}
                        />
                        <NewAvatarModal show={showCreate} onClose={() => setShowCreate(false)} />
                    </View>
                )
            }
        </View>
    )
}

export function AvatarImage({ url, height } : { url: string; height: number; }) {
    const [ width, setWidth ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);

    Image.getSize(url, (w, h) => {
        setWidth(w * height / h);
    });

    if (isLoading) {
        return (
            <View style={{ height }} className='flex flex-col items-center justify-center'>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <Image
            onLoad={() => setIsLoading(false)}
            source={{ uri: url, width, height, cache: 'force-cache' }}
        />
    )
}
