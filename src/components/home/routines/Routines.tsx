import React, { useMemo } from "react";
import Container from "../../common/Container";
import { useRoutines } from "../../../firestore/routine.api";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Routines() {
    const { snapshot } = useRoutines();

    const routines = useMemo(() => {
        return snapshot?.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        }));
    }, [ snapshot ]);

    return (
        <Container className='px-5'>
            <View>
                {
                    routines?.map((routine) => (
                        <View key={routine.id} className='bg-slate-200 p-5 rounded-lg my-3'>
                            <View className='flex flex-row items-center justify-between gap-3.5'>
                                <Text className='text-xl font-semibold'>{routine.name}</Text>
                                <View className='flex flex-row items-center gap-3'>
                                    <TouchableOpacity className='p-1 border border-black rounded-lg'>
                                        <Ionicons name="pencil" size={18} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {
                                routine.exercises.map((exercise, idx) => (
                                    <View key={idx} className='mt-3 px-3 py-2 bg-slate-100 rounded flex flex-row gap-5 items-center justify-between'>
                                        <View>
                                            <Text className='text-lg font-semibold'>{exercise.name}</Text>
                                            <Text>{exercise.amount}</Text>
                                        </View>
                                        <Text>
                                            { exercise.sets.length } sets / { exercise.sets.reduce((acc, set) => acc + set.reps, 0) } reps
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
                    ))
                }
            </View>
        </Container>
    );
}