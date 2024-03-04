import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import Landing from "../components/auth/Landing";
import { useAuth } from "../providers/AuthProvider";
import HomeRouter from "./HomeRouter";
import Setup1 from "../components/setup/Setup1";
import { useUser } from "../firestore/user.api";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

export enum MainRoutes {
    //UNAUTHENTICATED ROUTES
    LANDING = "Landing",
    LOGIN = "Login",
    SIGNUP = "Signup",
    //IN BETWEEN ROUTES
    SETUP1 = "Setup1",
    SETUP2 = "Setup2",
    //AUTHENTICATED ROUTES
    HOME = "HomeRouter"
}

const Stack = createNativeStackNavigator();
export default function MainRouter() {

    const { isAuthenticated, isInitializing } = useAuth();
    const { data: user } = useUser();

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
                        user?.setup_complete ? (
                            // Setup complete, proceed to home
                            <Stack.Screen name={MainRoutes.HOME} component={HomeRouter} />
                        ) : (
                            // Only render setup routes
                            <Stack.Screen name={MainRoutes.SETUP1} component={Setup1} />
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