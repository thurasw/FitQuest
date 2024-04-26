import { Alert, StyleSheet, Text } from "react-native";
import Container from "../common/Container";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import FQButton from "../common/FQButton";
import { OnboardingParamList } from "../../routes/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

export default function Step2({ route }: NativeStackScreenProps<OnboardingParamList, 'STEP2'>) {
    const [ selectedTime, setSelectedTime ] = useState<Date>();
    const navigation = useNavigation();

    const goNext = async() => {
        if (!selectedTime) {
            return Alert.alert('Please select a time');
        }

        navigation.navigate("ONBOARDING", {
            screen: "STEP3",
            params: {
                days: route.params.days,
                time: selectedTime.valueOf()
            }
        });
    };

    return (
        <Container statusBarPadding className='flex flex-col flex-1'>
            <Text className='mt-5 mb-10 text-3xl font-bold'>When should we send your workout reminders?</Text>

            <DateTimePicker
                mode='time'
                display='spinner'
                value={selectedTime || new Date()}
                onChange={(event, selectedDate) => {
                    setSelectedTime(selectedDate);
                }}
            />

            <FQButton
                label='Next'
                className='bg-primary-900 mt-auto mb-10'
                textProps={{
                    className: 'text-white text-xl font-semibold'
                }}
                disabled={!selectedTime}
                onPress={goNext}
            />
        </Container>
    )
}
