import { Alert, StyleSheet, Text } from "react-native";
import Container from "../common/Container";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import FQButton from "../common/FQButton";
import { OnboardingParamList } from "../../routes/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeRoutes } from "../../routes/HomeRouter";
import { MainRoutes } from "../../routes/MainRouter";
import { editUser } from "../../firestore/user.api";
import { useAuth } from "../../providers/AuthProvider";

export default function Step2() {
    const [ selectedTime, setSelectedTime ] = useState<Date>();

    const navigation = useNavigation();
    const route = useRoute<RouteProp<OnboardingParamList>>();
    const auth = useAuth();

    const goNext = async() => {
        if (!auth.user || !route.params?.days) return;
        if (!selectedTime) {
            return Alert.alert('Please select a time');
        }

        try {
            const days = route.params?.days || [];
            await editUser(auth.user.uid, {
                workoutDays: days,
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
                variant='primary'
                style={{
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