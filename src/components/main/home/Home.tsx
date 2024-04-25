import { View, Text } from "react-native";
import FQButton from "../../common/FQButton";
import { useAuth } from "../../../providers/AuthProvider";
import Container from "../../common/Container";
import { useMemo, useState } from "react";
import { useUser } from "../../../firestore/user.api";
import { useFirestoreDocument } from "../../../firestore/useFirestore";
import LogWorkoutModal from "./LogWorkoutModal";
import { useRoutine, useRoutines } from "../../../firestore/routine.api";

export default function Home() {

    const auth = useAuth();

    return (
        <Container>
            <View className='p-5'>
                <LogWorkoutCard />
            </View>
        </Container>
    )
};

function LogWorkoutCard() {

    const { data: userData } = useUser();
    // const { snpashot: routinesSnapshot, data: routines } = useRoutines();

    const scheduledWorkout = useMemo(() => {
        const day = new Date().getDay();
        return userData?.workoutDays[day] || null;
    }, [ userData ]);

    const { snapshot: routineSnapshot, data: routine } = useRoutine(scheduledWorkout?.id || '');
    const isWorkoutLogged = false;

    const [ showLog, setShowLog ] = useState(false);

    return (
        <View className='p-5 bg-slate-200 rounded-lg'>
            {
                scheduledWorkout !== null ? (
                    !isWorkoutLogged ? (
                        routine !== undefined && routineSnapshot !== undefined && (
                            <View>
                                <View className='flex flex-row'>
                                    <Text className='text-lg font-semibold'>{ routine.name }</Text>
                                    <Text className='text-lg'> scheduled today</Text>
                                </View>
                                <Text className='text-slate-500'>Start your streak now to earn bonus points!</Text>

                                <FQButton
                                    className='mt-5 bg-primary-900'
                                    textProps={{ className: 'text-white' }}
                                    label='Log Workout'
                                    onPress={() => setShowLog(true)}
                                />
                                <LogWorkoutModal
                                    show={showLog}
                                    onClose={() => setShowLog(false)}
                                    routineId={routineSnapshot.id}
                                    routine={routine}
                                />
                            </View>
                        )
                    ) : (
                        <View>
                            <Text className='text-xl font-semibold'>All done for today!</Text>
                            <Text className='text-slate-500'>You have already logged your workout for today</Text>
                        </View>
                    )
                ) : (
                    <Text className='text-slate-500'>No workout scheduled for today</Text>
                )
            }
        </View>
    )
}
