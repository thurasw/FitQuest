import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Fragment, useState } from "react";
import Container from "../common/Container";
import { useNavigation } from "@react-navigation/native";
import { OnboardingRoutes } from "../../routes/OnboardingRouter";
import { MainRoutes } from "../../routes/MainRouter";
import FQButton from "../common/FQButton";

export default function Step1() {

    const options = [
        {
            label: '3 days (Monday, Wednesday, Friday)',
            value: [1, 3, 5],
        },
        {
            label: '6 days (Monday - Saturday)',
            value: [1, 2, 3, 4, 5, 6],
        },
        {
            label: 'Everyday',
            value: [0, 1, 2, 3, 4, 5, 6],
        },
        {
            label: 'Custom',
            value: [],
        }
    ];
    const customOptions = [
        {
            label: 'M',
            value: 1
        },
        {
            label: 'T',
            value: 2
        },
        {
            label: 'W',
            value: 3
        },
        {
            label: 'T',
            value: 4
        },
        {
            label: 'F',
            value: 5
        },
        {
            label: 'S',
            value: 6
        },
        {
            label: 'S',
            value: 0
        }
    ];

    const [ activeOption, setActiveOption ] = useState(options[0]);
    const navigation = useNavigation();

    const goNext = () => {
        if (activeOption.value.length === 0) {
            return Alert.alert('Please select at least one day');
        }
        navigation.navigate(MainRoutes.ONBOARDING, {
            screen: OnboardingRoutes.STEP2,
            params: {
                days: activeOption.value
            }
        });
    };

    return (
        <Container statusBarPadding>
            <Text>How many times a week do you work out?</Text>

            <View style={{ gap: 10, marginTop: 50 }}>
                {
                    options.map(option => (
                        <Fragment key={option.label}>
                            <FQButton
                                className={activeOption.label === option.label ? 'bg-primary-900' : 'border-primary-900'}
                                textProps={{
                                    className: activeOption.label === option.label ? 'text-white' : 'text-primary-900'
                                }}
                                label={option.label}
                                onPress={() => setActiveOption(option)}
                            />
                            {
                                activeOption.label === option.label && option.label === 'Custom' && (
                                    <View style={styles.customCtn}>
                                        {
                                            customOptions.map((day, index) => (
                                                <FQButton
                                                    key={index}
                                                    className={activeOption.value.includes(day.value) ? 'bg-primary-900' : 'border-primary-900'}
                                                    textProps={{
                                                        className: activeOption.value.includes(day.value) ? 'text-white' : 'text-primary-900'
                                                    }}
                                                    style={{ paddingHorizontal: 10, paddingVertical: 10 }}
                                                    label={day.label}
                                                    onPress={() => {
                                                        setActiveOption(p => {
                                                            if (p.value.includes(day.value)) {
                                                                return {
                                                                    ...p,
                                                                    value: p.value.filter(v => v !== day.value)
                                                                }
                                                            }
                                                            return {
                                                                ...p,
                                                                value: [ ...p.value, day.value ]
                                                            }
                                                        });
                                                    }}
                                                />
                                            ))
                                        }
                                    </View>
                                )
                            }
                        </Fragment>
                    ))
                }
            </View>

            <FQButton
                className='bg-primary-900'
                textProps={{
                    className: 'text-white text-xl font-semibold'
                }}
                style={[styles.nextButton]}
                label='Next'
                onPress={goNext}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    customCtn: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
    },
    nextButton: {
        marginTop: 'auto',
        marginBottom: '10%'
    }
});