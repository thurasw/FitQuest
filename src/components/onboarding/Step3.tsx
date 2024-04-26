import { ActivityIndicator, Alert, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import Container from "../common/Container";
import { useEffect, useState } from "react";
import FQButton from "../common/FQButton";
import { OnboardingParamList } from "../../routes/types";
import { editUser, useUser } from "../../firestore/user.api";
import { useAuth } from "../../providers/AuthProvider";
import { createRoutine } from "../../firestore/routine.api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAvatarTemplates } from "../../api/endpoints.api";
import { createRpmAvatar, createRpmUser } from "../../api/mutations.api";

export default function Step3({ route }: NativeStackScreenProps<OnboardingParamList, 'STEP3'>) {

    const auth = useAuth();
    const { data: userData } = useUser();
    
    const [ isLoading, setIsLoading ] = useState(false);

    const [ selectedGender, setSelectedGender ] = useState<'male' | 'female'>('male');
    const [ selectedTemplate, setSelectedTemplate ] = useState<string>();
    
    useEffect(() => {
        if (userData?.rpm.token) return;

        // Create rpm acconut if it doesn't exist
        async function createRpm() {
            const res = await createRpmUser();
            await editUser(auth.user!.uid, {
                'rpm.id': res.data.id,
                'rpm.token': res.data.token
            })
        }
        createRpm();

    }, [ userData ]);

    const { data: templates } = useAvatarTemplates(userData?.rpm.token || '', {
        enabled: userData && userData.rpm.token !== null
    });

    const goNext = async() => {
        if (!auth.user || !userData?.rpm.token) return;

        try {
            // Create user avatar
            setIsLoading(true);
            const res = await createRpmAvatar(userData!.rpm.token, selectedTemplate!);

            // Create default routine
            const result = await createRoutine(auth.user.uid, {
                name: 'Default Routine',
                isDefault: true,
                exercises: [{
                    name: 'Cardio',
                    amount: '15min',
                    sets: [{ reps: 1 }]
                }, {
                    name: 'Pushups',
                    amount: '',
                    sets: [{ reps: 10 }, { reps: 10 }, { reps: 10 }, { reps: 10 }, { reps: 10 }]
                }]
            });

            const days = route.params.days;
            const workoutDays : FitQuest.User['workoutDays'] = {
                0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
            };
            for (const day of days) {
                workoutDays[day] = result;
            }

            // Edit user object
            setIsLoading(false);
            await editUser(auth.user.uid, {
                workoutDays,
                workoutTime: route.params.time,
                'rpm.avatarId': res.data.id,
                'rpm.assets': res.data.assets,
                'rpm.gender': res.data.gender
            });
        }
        catch (error) {
            console.error(error);
            setIsLoading(false);
            Alert.alert('An error occurred');
        }
    };

    return (
        <Container statusBarPadding className='flex flex-col items-stretch'>
            <Text className='my-5 text-3xl font-bold'>
                Choose your first avatar!
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
                label='Next'
                className='bg-primary-900 mt-10'
                textProps={{
                    className: 'text-white text-xl font-semibold'
                }}
                onPress={goNext}
                disabled={!selectedTemplate || isLoading}
            />
        </Container>
    )
}

interface TemplateImageProps {
    imageUrl: string;
    onPress: () => void;
    isSelected: boolean;
}
function TemplateImage({ imageUrl, onPress, isSelected }: TemplateImageProps) {

    const [autoHeight, setAutoHeight] = useState(0);

    Image.getSize(imageUrl, (width, height) => {
        setAutoHeight(100 / width * height);
    });

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} className={`self-stretch p-3 rounded-xl ${isSelected ? 'bg-primary-900' : 'bg-slate-300'}`}>
            <Image
                className='my-auto'
                source={{ uri: imageUrl, cache: 'force-cache' }}
                style={{
                    width: 100,
                    height: autoHeight
                }}
            />
        </TouchableOpacity>
    )
}
