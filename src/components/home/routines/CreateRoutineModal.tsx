import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import z from "zod";
import FormInput from "../../common/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FQButton from "../../common/FQButton";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from "react";
import { createRoutine } from "../../../firestore/routine.api";
import { useAuth } from "../../../providers/AuthProvider";

interface CreateRoutineModalProps {
    show: boolean;
    onClose: () => void;
}

const routineSchema = z.object({
    name: z.string().min(1),
    exercises: z.array(
        z.object({
            name: z.string().min(1),
            sets: z.array(z.object({
                reps: z.coerce.number().min(1)
            })),
            amount: z.string()
        })
    )
});
type RoutineDto = z.infer<typeof routineSchema>;

export default function CreateRoutineModal({ show, onClose }: CreateRoutineModalProps) {

    const scrollViewRef = useRef<ScrollView>(null);
    const { user } = useAuth();

    const { handleSubmit, control, setValue, watch, reset } = useForm<RoutineDto>({
        resolver: zodResolver(routineSchema),
        defaultValues: {
            name: '',
            exercises: [{
                name: '',
                amount: '',
                sets: [{
                    reps: 0
                }]
            }]
        }
    });
    const exercises = watch('exercises');
    useEffect(() => {
        // reset on close
        if (!show) {
            reset();
        }
    }, [ show ])

    /** Add/remove array items */
    const addExercise = () => {
        setValue('exercises', [
            ...exercises,
            {
                name: '',
                sets: [{
                    reps: 0
                }],
                amount: ''
            }
        ], {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false
        });

        // Wait for UI to update and scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100)
    }
    const removeExercise = (exerciseIdx: number) => {
        setValue('exercises', exercises.filter((_, i) => i !== exerciseIdx), {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false
        });
    };
    
    const addSet = (exerciseIdx: number) => {
        setValue(`exercises.${exerciseIdx}.sets`, [
            ...exercises[exerciseIdx].sets,
            {
                reps: 0
            }
        ], {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false
        });
    };
    const removeSet = (exerciseIdx: number, setIdx: number) => {
        setValue(`exercises.${exerciseIdx}.sets`, exercises[exerciseIdx].sets.filter((_, i) => i !== setIdx), {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false
        });
    }

    /** Form submission */
    const createWorkout = async(data: RoutineDto) => {
        try {
            await createRoutine(user?.uid!, data);
            onClose();
        }
        catch(err) {
            console.error(err);
            Alert.alert('Error', 'Failed to create routine');
        }
    };

    return (
        <Modal
            visible={show}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={onClose}
        >
            {/* Header */}
            <View className='flex flex-row items-center p-5 bg-neutral-100'>
                <Text className='invisible'>Cancel</Text>
                <Text className='font-semibold text-xl text-center ms-auto'>
                    New Routine
                </Text>
                <TouchableOpacity className='ms-auto' onPress={onClose}>
                    <Text className='text-primary-500'>Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* Body */}
            <View className='p-5 flex-grow flex flex-col flex-1'>
                <FormInput
                    placeholder='Routine name'
                    control={control}
                    fieldName='name'
                />

                {/* Exercises */}
                <Text className='text-lg font-semibold my-3'>
                    Exercises
                </Text>
                <ScrollView ref={scrollViewRef}>
                    {
                        exercises.map((exercise, idx) => (
                            <View key={idx} className='mb-5 p-5 rounded-lg bg-slate-200'>
                                <View className='flex flex-row w-full mb-2'>
                                    <FormInput
                                        containerProps={{
                                            className: 'mb-3 pe-3 w-9/12'
                                        }}
                                        placeholder='Exercise Name'
                                        control={control}
                                        fieldName={`exercises.${idx}.name`}
                                        enterKeyHint='next'
                                    />
                                    <FormInput
                                        containerProps={{
                                            className: 'mb-3 w-3/12 flex-shrink-0'
                                        }}
                                        placeholder='Amount'
                                        control={control}
                                        fieldName={`exercises.${idx}.amount`}
                                        enterKeyHint='next'
                                    />
                                </View>
                                {
                                    exercise.sets.map((set, setIdx) => (
                                        <View key={setIdx} className='flex flex-row items-center mb-2'>
                                            <FormInput
                                                containerProps={{ className: 'flex-grow' }}
                                                key={setIdx}
                                                placeholder='Reps'
                                                control={control}
                                                fieldName={`exercises.${idx}.sets.${setIdx}.reps`}
                                                inputMode='numeric'
                                            />
                                            {
                                                setIdx !== 0 && (
                                                    <TouchableOpacity
                                                        className='ms-3'
                                                        onPress={() => removeSet(idx, setIdx)}
                                                    >
                                                        <Ionicons name="remove-circle-outline" size={24} />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                    ))
                                }

                                <View className='flex flex-row gap-3 mt-3'>
                                    <FQButton
                                        label='Add Set'
                                        className='flex-grow py-1 border-primary-700'
                                        textProps={{
                                            className: 'text-primary-700'
                                        }}
                                        onPress={() => addSet(idx)}
                                    />
                                    {
                                        idx !== 0 && (
                                            <FQButton
                                                label='Remove Exercise'
                                                className='flex-grow py-1 border-red-500'
                                                textProps={{
                                                    className: 'text-red-500'
                                                }}
                                                onPress={() => removeExercise(idx)}
                                            />
                                        )
                                    }
                                </View>
                            </View>
                        ))
                    }
                    <FQButton
                        label='Add Exercise'
                        className='bg-primary-700 py-1'
                        textProps={{
                            className: 'text-white'
                        }}
                        onPress={addExercise}
                    />
                </ScrollView>


                {/* Submit button */}
                <View className='flex-shrink-0 py-5'>
                    <FQButton
                        label='Create Routine'
                        className='mt-auto bg-primary-900'
                        textProps={{
                            className: 'text-white font-semibold text-lg'
                        }}
                        onPress={handleSubmit(createWorkout)}
                    />
                </View>
            </View>

        </Modal>
    )
}
