import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1 from "../components/onboarding/Step1";
import Step2 from "../components/onboarding/Step2";
import { OnboardingParamList } from "./types";
import Step3 from "../components/onboarding/Step3";

const Stack = createNativeStackNavigator<OnboardingParamList>();
export default function OnboardingRouter() {
    return (
        <Stack.Navigator initialRouteName="STEP1" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="STEP1" component={Step1} />
            <Stack.Screen name="STEP2" component={Step2} />
            <Stack.Screen name="STEP3" component={Step3} />
        </Stack.Navigator>
    )
}