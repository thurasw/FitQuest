import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1 from "../components/onboarding/Step1";
import Step2 from "../components/onboarding/Step2";

export enum OnboardingRoutes {
    STEP1 = "STEP1",
    STEP2 = "STEP2"
}

const Stack = createNativeStackNavigator();
export default function OnboardingRouter() {
    return (
        <Stack.Navigator initialRouteName={OnboardingRoutes.STEP1} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={OnboardingRoutes.STEP1} component={Step1} />
            <Stack.Screen name={OnboardingRoutes.STEP2} component={Step2} />
        </Stack.Navigator>
    )
}