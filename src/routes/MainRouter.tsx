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

export enum MainRoutes {
    //UNAUTHENTICATED ROUTES
    LANDING = "Landing",
    LOGIN = "Login",
    SIGNUP = "Signup",
    //AUTHENTICATED ROUTES
    ONBOARDING = "Onboarding",
    HOME = "HomeRouter"
}

const Stack = createNativeStackNavigator();
export default function MainRouter() {

    const { isAuthenticated, isInitializing } = useAuth();
    const { data: user } = useUser();

    const setupComplete = user !== undefined && user.workoutTime !== 0 && user.workoutDays.length > 0;

    useEffect(() => {
        if (!isInitializing && (!isAuthenticated || user !== undefined)) {
            SplashScreen.hideAsync();
        }
    }, [ isInitializing, isAuthenticated, user ]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={MainRoutes.LANDING} screenOptions={{ headerShown: false }}>
                {
                    isAuthenticated ? (
                        setupComplete ? (
                            // Setup complete, proceed to home
                            <Stack.Screen name={MainRoutes.HOME} component={HomeRouter} />
                        ) : (
                            // Setup incomplete, proceed to onboarding
                            <Stack.Screen name={MainRoutes.ONBOARDING} component={OnboardingRouter} />
                        )
                    ) : (
                        // Unauthenticated routes
                        <>
                            <Stack.Screen name={MainRoutes.LANDING} component={Landing} />
                            <Stack.Screen name={MainRoutes.LOGIN} component={Login} />
                            <Stack.Screen name={MainRoutes.SIGNUP} component={Signup} />
                        </>
                    )
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}