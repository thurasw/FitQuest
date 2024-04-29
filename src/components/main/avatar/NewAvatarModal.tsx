import { ActivityIndicator, Alert, Modal, ScrollView, Text, View } from "react-native";
import FQButton from "../../common/FQButton";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { editUser, useUser } from "../../../firestore/user.api";
import { useAvatarTemplates } from "../../../api/endpoints.api";
import { TemplateImage } from "../../onboarding/Step3";
import { createRpmAvatar } from "../../../api/mutations.api";
import firestore from "@react-native-firebase/firestore";
import { createUnlockedAsset } from "../../../firestore/unlocked-assets.api";

interface NewAvatarModalProps {
    show: boolean;
    onClose: () => void;
}
export default function NewAvatarModal({ show, onClose } : NewAvatarModalProps) {

    const auth = useAuth();
    const { data: userData } = useUser();

    const [ selectedGender, setSelectedGender ] = useState<'male' | 'female'>('male');
    const { data: templates } = useAvatarTemplates(userData?.rpm.token || '', {
        enabled: userData && userData.rpm.token !== null
    });
    
    const [ selectedTemplate, setSelectedTemplate ] = useState<string>();
    const [ isLoading, setIsLoading ] = useState(false);

    const handleCreate = async() => {
        if (!auth.user || !userData?.rpm.token) return;

        try {
            // Create user avatar
            setIsLoading(true);
            const res = await createRpmAvatar(userData!.rpm.token, selectedTemplate!);

            for (let type in res.data.assets) {
                // Unlock chosen assets
                const id = res.data.assets[type] as string;
                if (id) {
                    createUnlockedAsset(auth.user.uid, { id, type });
                }
            }

            // Edit user object
            setIsLoading(false);
            await editUser(auth.user.uid, {
                avatars: firestore.FieldValue.arrayUnion({
                    avatarId: res.data.id,
                    assets: res.data.assets,
                    gender: res.data.gender,
                    templateId: selectedTemplate
                })
            });
        }
        catch (error) {
            console.error(error);
            setIsLoading(false);
            Alert.alert('An error occurred');
        }
    };

    return (
        <Modal
            visible={show}
            onRequestClose={onClose}
            animationType='slide'
            presentationStyle='pageSheet'
        >
            <View className='flex flex-col p-5 pb-10 flex-1'>
                <Text className='my-5 text-3xl font-bold'>
                    Choose your avatar template!
                </Text>

                <View className='flex-1'>
                    <View className='px-5 flex flex-row gap-3'>
                        <FQButton
                            className={`flex-1 border-2 ${selectedGender === 'male' ? 'bg-primary-900 border-transparent' : 'border-primary-900 bg-transparent'}`}
                            textProps={{ className: selectedGender === 'male' ? 'text-white' : 'text-primary-900' }}
                            label='Masculine'
                            onPress={() => setSelectedGender('male')}
                        />
                        <FQButton
                            className={`flex-1 border-2 ${selectedGender === 'female' ? 'bg-primary-900 border-transparent' : 'border-primary-900 bg-transparent'}`}
                            textProps={{ className: selectedGender === 'female' ? 'text-white' : 'text-primary-900' }}
                            label='Feminine'
                            onPress={() => setSelectedGender('female')}
                        />
                    </View>

                    <ScrollView>
                        {
                            templates === undefined ? (
                                <ActivityIndicator />
                            ) : (
                                <View className='py-5 flex flex-row flex-wrap gap-5 items-center justify-evenly'>
                                    {
                                        templates.data
                                        .filter(d => d.usageType === 'randomize' && d.gender === selectedGender)
                                        .map(t => (
                                            <TemplateImage
                                                key={t.id}
                                                imageUrl={t.imageUrl}
                                                isSelected={selectedTemplate === t.id}
                                                onPress={() => setSelectedTemplate(t.id)}
                                            />
                                        ))
                                    }
                                </View>
                            )
                        }
                    </ScrollView>
                </View>

                <FQButton
                    label='Create'
                    className='bg-primary-900 mt-10'
                    textProps={{
                        className: 'text-white text-xl font-semibold'
                    }}
                    disabled={!selectedTemplate || isLoading}
                    onPress={handleCreate}
                />
            </View>
        </Modal>
    )
}