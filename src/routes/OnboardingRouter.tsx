import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1 from "../components/onboarding/Step1";
import Step2 from "../components/onboarding/Step2";
import { OnboardingParamList } from "./types";

const Stack = createNativeStackNavigator<OnboardingParamList>();
export default function OnboardingRouter() {
    return (
        <Stack.Navigator initialRouteName="STEP1" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="STEP1" component={Step1} />
            <Stack.Screen name="STEP2" component={Step2} />
        </Stack.Navigator>
    )
}