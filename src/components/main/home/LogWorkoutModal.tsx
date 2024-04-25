import { Modal, ScrollView, Text, View } from "react-native";
import { useRoutines } from "../../../firestore/routine.api";
import { useEffect, useState } from "react";
import FQButton from "../../common/FQButton";
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firestore from '@react-native-firebase/firestore';
import { createLogEntry } from "../../../firestore/log.api";
import { useAuth } from "../../../providers/AuthProvider";
import Animated, { BounceIn, FadeInDown, ZoomOutUp, runOnJS } from "react-native-reanimated";
import { useUser } from "../../../firestore/user.api";
import { calculatePointsToAward } from "../../../utils/points.utils";

interface LogWorkoutModalProps {
    show: boolean;
    onClose: () => void;
    routineId: string;
    routine: FitQuest.Routine;
}

export default function LogWorkoutModal({ show, onClose, routineId, routine }: LogWorkoutModalProps) {
    const { snapshot: routines } = useRoutines();
    const { user } = useAuth();
    const { data: userData } = useUser();

    // Log creation states
    const [ selectedRoutine, setSelectedRoutine ] = useState<FitQuest.Routine & { id: string }>({
        id: routineId,
        ...routine
    });
    const [ selectedExercises, setSelectedExercises ] = useState<FitQuest.LogExercise[]>([]);

    useEffect(() => {
        setSelectedRoutine({
            ...routine,
            id: routineId
        });
        setSelectedExercises([]);
    }, [ routine, show ]);

    // Create Log
    const [ showPoints, setShowPoints ] = useState(false);
    const [ pointsToAward, setPointsToAward ] = useState<{ points: number; message: string; }[]>([]);

    const handleLogWorkout = async() => {
        if (!userData) return;

        const percent_completed = (selectedExercises.length / selectedRoutine.exercises.length) * 100;
        const points = calculatePointsToAward(userData, percent_completed);

        // Create log entry
        const logEntry = {
            date: firestore.Timestamp.now(),
            point_awarded: points.reduce((acc, award) => acc + award.points, 0),
            percent_completed,
            routineName: selectedRoutine.name
        };
        // Log workout
        createLogEntry(user!.uid, logEntry, selectedExercises, userData);

        // Show points awarded
        setShowPoints(true);
        setPointsToAward(points);
    };

    const closeWithDelay = () => {
        setTimeout(() => {
            onClose();
        }, 2000);
    }

    useEffect(() => {
        // Reset
        setShowPoints(false);
        setPointsToAward([]);
    }, [ show ])


    return (
        <Modal
            presentationStyle='pageSheet'
            animationType='slide'
            visible={show}
            onRequestClose={onClose}
        >
            <View className='flex flex-col flex-grow'>
                {/* HEADER */}
                <View className='flex flex-row items-center px-5 mt-5'>
                    { !showPoints && <Text className='invisible'>Cancel</Text> }
                    <View className='mx-auto'>
                        <Text className='text-center text-xl font-semibold'>
                            { selectedRoutine.name }
                        </Text>
                        {
                            !showPoints && (
                                <RNPickerSelect
                                    style={{
                                        iconContainer: {
                                            right: -18,
                                            top: 2
                                        },
                                        inputIOS: { color: '#1A9EFF', textAlign: 'center' },
                                        inputAndroid: { color: '#1A9EFF', textAlign: 'center' },
                                        inputWeb: { color: '#1A9EFF', textAlign: 'center' }
                                    }}
                                    placeholder={{}}
                                    items={
                                        routines?.docs.map((doc) => ({
                                            label: doc.data().name,
                                            value: doc.id,
                                            key: doc.id,
                                            inputLabel: 'Log another routine?'
                                        })) ?? []
                                    }
                                    itemKey={selectedRoutine.id}
                                    onValueChange={(value, idx) => {
                                        setSelectedRoutine({
                                            id: value,
                                            ...routines!.docs[idx].data()
                                        });
                                    }}
                                />
                            )
                        }
                    </View>
                    {
                        !showPoints && (
                            <FQButton
                                className='px-0 py-0'
                                textProps={{ className: 'text-primary-500' }}
                                onPress={onClose}
                                label='Cancel'
                            />
                        )
                    }
                </View>
                {/* LOG EXERCISES */}
                {
                    !showPoints && (
                        <Animated.View className='p-5 flex-1 flex-grow' exiting={ZoomOutUp.duration(500)}>
                            <Text className='text-xl font-semibold my-5'>
                                Select exercises to log
                            </Text>
                            <ScrollView className='flex flex-col flex-grow'>
                                {
                                    selectedRoutine.exercises.map((exercise, idx) => {
                                        const logExercise = selectedExercises.find((ex) => ex.name === exercise.name);
                                        return (
                                            <View key={idx} className='mb-3 flex flex-col px-5 py-3 bg-slate-200 rounded-xl'>
                                                <BouncyCheckbox
                                                    size={25}
                                                    fillColor='#1A9EFF'
                                                    iconStyle={{ borderColor: '#1A9EFF' }}
                                                    innerIconStyle={{ borderWidth: 2 }}
                                                    style={{ width: '100%' }}
                                                    text={exercise.name}
                                                    isChecked={logExercise !== undefined}
                                                    onPress={(isChecked) => {
                                                        if (isChecked) {
                                                            setSelectedExercises([ ...selectedExercises, {
                                                                name: exercise.name,
                                                                reps: exercise.sets.reduce((acc, set) => acc + set.reps, 0)
                                                            }]);
                                                        } else {
                                                            setSelectedExercises(selectedExercises.filter((ex) => ex.name !== exercise.name));
                                                        }
                                                    }}
                                                />
                                                {
                                                    logExercise !== undefined && (
                                                        <View className='flex flex-col'>
                                                            <View className='flex flex-row items-center mt-3'>
                                                                <View className='px-3 bg-slate-100 rounded-lg me-3'>
                                                                    <Text className='text-lg text-center'>
                                                                        { logExercise.reps } reps
                                                                    </Text>
                                                                </View>
                                                                <FQButton
                                                                    className='px-0 py-0 me-2'
                                                                    onPress={() => {
                                                                        // increment reps
                                                                        setSelectedExercises(p => p.map(
                                                                            e => e.name !== exercise.name ? e : ({
                                                                                ...e,
                                                                                reps: e.reps + 1
                                                                            })
                                                                        ));
                                                                    }}
                                                                >
                                                                    <Ionicons name='add-circle-outline' size={24} color='#1A9EFF' />
                                                                </FQButton>
                                                                <FQButton
                                                                    className='px-0 py-0 me-3'
                                                                    onPress={() => {
                                                                        // decrement reps
                                                                        setSelectedExercises(p => p.map(
                                                                            e => e.name !== exercise.name ? e : ({
                                                                                ...e,
                                                                                reps: e.reps === 1 ? 1 : e.reps - 1
                                                                            })
                                                                        ));
                                                                    
                                                                    }}
                                                                >
                                                                    <Ionicons name='remove-circle-outline' size={24} color='#1A9EFF' />
                                                                </FQButton>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>

                            <FQButton
                                className={`mb-10 mt-auto bg-primary-900 ${ selectedExercises.length === 0 ? 'opacity-60' : '' }`}
                                textProps={{ className: 'text-white' }}
                                disabled={selectedExercises.length === 0}
                                label='Save to diary'
                                onPress={handleLogWorkout}
                            />
                        </Animated.View>
                    )
                }
                {/* POINTS AWARDED */}
                {
                    showPoints && (
                        <Animated.View
                            entering={BounceIn.delay(1500)}
                            className='p-5 flex-grow flex flex-col justify-start items-center top-[15%] absolute w-full'
                        >
                            <View className='bg-slate-200 rounded-xl px-10 py-5'>
                                <Text className='text-primary-900 text-center text-8xl font-extrabold mt-5'>
                                    { pointsToAward.reduce((acc, award) => acc + award.points, 0)}
                                </Text>
                            </View>
                            <Text className='text-primary-900 mt-3 text-center text-xl font-semibold'>
                                points earned!
                            </Text>
                            <View className='mt-12'>
                                {
                                    pointsToAward.map((award, idx) => (
                                        <Animated.Text
                                            key={idx}
                                            className='text-start text-slate-600 text-lg mt-2'
                                            entering={
                                                FadeInDown
                                                .delay(2500 + (idx * 500))
                                                .duration(500)
                                                .withCallback(() => {
                                                    if (idx === pointsToAward.length - 1) {
                                                        runOnJS(closeWithDelay)();
                                                    }
                                                })
                                            }
                                        >
                                            +{award.points}pts  ({ award.message })
                                        </Animated.Text>
                                    ))
                                }
                            </View>
                        </Animated.View>
                    )
                }
            </View>
        </Modal>
    )
}