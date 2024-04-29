import { View, Text } from "react-native";
import FQButton from "../../common/FQButton";
import { useAuth } from "../../../providers/AuthProvider";
import Container from "../../common/Container";
import { useMemo, useState } from "react";
import { useUser } from "../../../firestore/user.api";
import LogWorkoutModal from "./LogWorkoutModal";
import { useRoutine, useRoutines } from "../../../firestore/routine.api";
import { useLogEntries } from "../../../firestore/log.api";
import firestore from "@react-native-firebase/firestore";

export default function Home() {

    const auth = useAuth();

    return (
        <Container>
            <View className='p-5 flex flex-col gap-5'>
                <LogWorkoutCard />
            </View>
        </Container>
    )
};

function LogWorkoutCard() {

    const { data: userData } = useUser();
    const { snapshot: routinesSnapshot } = useRoutines();
    const { data: entries } = useLogEntries((query) => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        return query
        .where('date', '>=', firestore.Timestamp.fromDate(startOfToday))
        .where('date', '<=', firestore.Timestamp.fromDate(endOfToday));
    });

    const scheduledWorkout = useMemo(() => {
        const day = new Date().getDay();
        return userData?.workoutDays[day] || null;
    }, [ userData ]);

    const isWorkoutLogged = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return entries?.some((v) => v.date.toDate().toISOString().split('T')[0] === today) === true;
    }, [ entries ])

    const { snapshot: routineSnapshot, data: routine } = useRoutine(scheduledWorkout?.id || null);

    // Modal states
    const [ showLog, setShowLog ] = useState(false);

    return (
        <View className='p-5 bg-slate-200 rounded-lg'>
            {
                !isWorkoutLogged ? (
                    scheduledWorkout !== null ? (
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
                            </View>
                        )
                    ) : (
                        <View>
                            <Text className='text-xl font-semibold'>No workout scheduled today</Text>
                            <Text className='text-slate-500'>Feeling extra motivated? Log your workout anyways</Text>

                            <FQButton
                                className='mt-5 bg-primary-900'
                                textProps={{ className: 'text-white' }}
                                label='Log anyways'
                                onPress={() => setShowLog(true)}
                            />
                        </View>
                    )
                ) : (
                    <View>
                        <Text className='text-xl font-semibold'>All done for today!</Text>
                        <Text className='text-slate-500'>We've already saved your workout entry</Text>
                    </View>
                )
            }
            {
                routinesSnapshot !== undefined && !routinesSnapshot.empty && (
                    <LogWorkoutModal
                        show={showLog}
                        onClose={() => setShowLog(false)}
                        routineId={routineSnapshot?.id || routinesSnapshot.docs[0].id}
                        routine={routine || routinesSnapshot.docs[0].data()}
                    />
                )
            }
        </View>
    )
}
