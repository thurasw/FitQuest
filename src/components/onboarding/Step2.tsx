import { Alert, StyleSheet, Text } from "react-native";
import Container from "../common/Container";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import FQButton from "../common/FQButton";
import { OnboardingParamList } from "../../routes/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { editUser } from "../../firestore/user.api";
import { useAuth } from "../../providers/AuthProvider";
import { createRoutine } from "../../firestore/routine.api";

export default function Step2() {
    const [ selectedTime, setSelectedTime ] = useState<Date>();

    const route = useRoute<RouteProp<OnboardingParamList>>();
    const auth = useAuth();

    const goNext = async() => {
        if (!auth.user || !route.params?.days) return;
        if (!selectedTime) {
            return Alert.alert('Please select a time');
        }

        try {
            // Create default routine
            const result = await createRoutine(auth.user.uid, {
                name: 'Default Routine',
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

            const days = route.params?.days || [];
            const workoutDays : FitQuest.User['workoutDays'] = {
                0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null
            };
            for (const day of days) {
                workoutDays[day] = result;
            }

            await editUser(auth.user.uid, {
                workoutDays,
                workoutTime: selectedTime.valueOf()
            });
        }
        catch (error) {
            console.error(error);
            return Alert.alert('An error occurred');
        }
    };

    return (
        <Container statusBarPadding style={styles.ctn}>
            <Text>What time would you like to receive your workout reminders?</Text>

            <DateTimePicker
                mode='time'
                display='spinner'
                style={{
                    marginTop: 50,
                }}
                value={selectedTime || new Date()}
                onChange={(event, selectedDate) => {
                    setSelectedTime(selectedDate);
                }}
            />

            <FQButton
                label='Next'
                className='bg-primary-900'
                textProps={{
                    className: 'text-white text-xl font-semibold'
                }}
                onPress={goNext}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    ctn: {
        flexDirection: 'column',
        alignItems: 'stretch'
    }
});