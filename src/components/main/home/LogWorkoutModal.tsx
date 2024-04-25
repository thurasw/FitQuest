import { Modal, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { useRoutines } from "../../../firestore/routine.api";
import { useEffect, useState } from "react";
import FQButton from "../../common/FQButton";
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firestore from '@react-native-firebase/firestore';
import { calculatePointsToAward, createLogEntry } from "../../../firestore/log.api";
import { useAuth } from "../../../providers/AuthProvider";
import Animated, { useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { useUser } from "../../../firestore/user.api";

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
        // await createLogEntry(user!.uid, logEntry, selectedExercises);
        // Show points awarded
        setShowPoints(true);
        setPointsToAward(points);
        
        //Initial position for the points description
        pointsDescTransform.value = points.map(() => -50);

        topPosition.value = withSpring(-height, undefined, () => {
            pointsScale.value = withSpring(1, undefined, () => {
                pointsDescTransform.value = points.map((_, idx) => withDelay(idx * 500, withSpring(0)));
            });
        });
    };

    // Animation states
    const { height } = useWindowDimensions();
    const topPosition = useSharedValue(0);
    const pointsScale = useSharedValue(0);
    const pointsDescTransform = useSharedValue<number[]>([]);

    useEffect(() => {
        // Animation states
        topPosition.value = 0;
        pointsScale.value = 0;
        pointsDescTransform.value = [];
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
                <View>
                    <Text className='text-center mt-5 text-xl font-semibold'>
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
                                Icon={() => <Ionicons name="chevron-down" size={15} color='#94a3b8' />}
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
                {/* LOG EXERCISES */}
                {
                    topPosition.value !== -height && (
                        <Animated.View className='p-5 flex-1 flex-grow' style={{ top: topPosition }}>
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
                            style={{
                                transform: [{ scale: pointsScale }]
                            }}
                            className='p-5 flex-grow flex flex-col justify-start items-center top-[15%] absolute w-full'
                        >
                            <Text className='text-center text-8xl font-extrabold mt-5'>
                                2000
                            </Text>
                            <Text className='text-center text-xl font-semibold'>
                                points earned!
                            </Text>
                            <View className='mt-12'>
                                {
                                    pointsToAward.map((award, idx) => (
                                        <Animated.Text
                                            key={idx}
                                            className='text-start text-slate-600 text-lg mt-2'
                                            style={{
                                                transform: [{ translateY: pointsDescTransform.value[idx] }],
                                            }}
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