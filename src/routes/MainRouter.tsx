import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import Landing from "../components/auth/Landing";
import { useAuth } from "../providers/AuthProvider";
import HomeRouter from "./HomeRouter";
import { useUser } from "../firestore/user.api";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import OnboardingRouter from "./OnboardingRouter";
import { MainParamList } from "./types";

const Stack = createNativeStackNavigator<MainParamList>();
export default function MainRouter() {

    const { isAuthenticated, isInitializing } = useAuth();
    const { data: user } = useUser();

    const setupComplete = user !== undefined && user.workoutTime !== 0;

    const appIsReady = !isInitializing && (!isAuthenticated || user !== undefined);
    useEffect(() => {
        if (appIsReady) {
            SplashScreen.hideAsync();
        }
    }, [ appIsReady ]);

    if (!appIsReady) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LANDING" screenOptions={{ headerShown: false }}>
                {
                    isAuthenticated ? (
                        setupComplete ? (
                            // Setup complete, proceed to home
                            <Stack.Screen name="MAIN" component={HomeRouter} />
                        ) : (
                            // Setup incomplete, proceed to onboarding
                            <Stack.Screen name="ONBOARDING" component={OnboardingRouter} />
                        )
                    ) : (
                        // Unauthenticated routes
                        <>
                            <Stack.Screen name="LANDING" component={Landing} />
                            <Stack.Screen name="LOGIN" component={Login} />
                            <Stack.Screen name="SIGNUP" component={Signup} />
                        </>
                    )
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}