import { View, Text } from "react-native";
import FQButton from "../../common/FQButton";
import Container from "../../common/Container";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../../../firestore/user.api";
import LogWorkoutModal from "./LogWorkoutModal";
import { useRoutine, useRoutines } from "../../../firestore/routine.api";
import { useLogEntries } from "../../../firestore/log.api";
import firestore from "@react-native-firebase/firestore";
import { registerRemindersAsync } from "../../../utils/reminders.utils";
import Leaderboards from "./Leaderboards";

export default function Home() {

    const { data: user } = useUser();
    const currentReminderConfig = useRef<[number[], number, number]>();

    useEffect(() => {
        if (!user) return;

        const daysToRemind = Object.entries(user.workoutDays)
        .filter(([, v]) => v !== null)
        .map(([k]) => parseInt(k));

        const triggerTime = new Date(user.workoutTime);
        const hours = triggerTime.getHours();
        const minutes = triggerTime.getMinutes();

        if (
            currentReminderConfig.current === undefined ||
            currentReminderConfig.current[0].length !== daysToRemind.length ||
            !currentReminderConfig.current[0].every((v, i) => v === daysToRemind[i]) ||
            currentReminderConfig.current[1] !== hours ||
            currentReminderConfig.current[2] !== minutes
        ) {
            currentReminderConfig.current = [ daysToRemind, hours, minutes ];
            registerRemindersAsync(daysToRemind, hours, minutes);
        }
    }, [ user ]);

    if (!user) return <></>;

    return (
        <Container>
            <View className='p-5 flex flex-col gap-5'>
                <LogWorkoutCard user={user} />
                <Leaderboards user={user} />
            </View>
        </Container>
    )
};

function LogWorkoutCard({ user } : { user: FitQuest.User }) {

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
        return user.workoutDays[day] || null;
    }, [ user ]);

    const isWorkoutLogged = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return entries?.some((v) => v.date.toDate().toISOString().split('T')[0] === today) === true;
    }, [ entries ])

    const { snapshot: routineSnapshot, data: routine } = useRoutine(scheduledWorkout?.id || null);

    // Modal states
    const [ showLog, setShowLog ] = useState(false);

    const isStreakActive = (streakNextDate: string | null) => {
        if (!streakNextDate) return false;
        const nextDate = new Date(streakNextDate);
        const today = new Date();

        return nextDate.getDate() === today.getDate() && nextDate.getMonth() === today.getMonth() && nextDate.getFullYear() === today.getFullYear();
    }

    return (
        <View className='p-5 bg-slate-200 rounded-lg'>
            {
                !isWorkoutLogged ? (
                    scheduledWorkout !== null ? (
                        routine !== undefined && routineSnapshot !== undefined && (
                            <View>
                                <View className='flex flex-row'>
                                    <Text className='text-lg font-bold'>{ routine.name }</Text>
                                    <Text className='text-lg'> scheduled today</Text>
                                </View>
                                {
                                    !user.streak ? (
                                        <Text className='text-slate-500'>Start a new streak now and earn bonus points!</Text>
                                    ) : (
                                        isStreakActive(user.streakNextDate) ? (
                                            <Text className='text-slate-500'>Keep your {user.streak}-day streak alive! Log your workout now</Text>
                                        ) : (
                                            <Text className='text-slate-500'>You missed your streak! Keep going to start a new one</Text>
                                        )
                                    )
                                }
    
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
                            <Text className='text-xl font-bold'>No workout scheduled today</Text>
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
                        <Text className='text-xl font-bold'>All done for today!</Text>
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
