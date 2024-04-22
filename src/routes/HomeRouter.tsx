import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/home/Home";
import Avatar from "../components/home/Avatar";
import Routines from "../components/home/routines/Routines";
import Profile from "../components/home/Profile";
import { Ionicons } from '@expo/vector-icons';
import { GradientIcon } from "../components/common/PrimaryGradient";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import CreateRoutineModal from "../components/home/routines/CreateRoutineModal";

export enum HomeRoutes {
    HOME = "Home",
    AVATAR = "Avatar",
    ROUTINES = "Routines",
    PROFILE = "Profile"
}

const Tab = createBottomTabNavigator();
export default function HomeRouter() {

    const tabBarIcon = (route: string, focused: boolean, size: number) => {
        let iconName: any;
        if (route === HomeRoutes.HOME) {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route === HomeRoutes.AVATAR) {
            iconName = focused ? 'person' : 'person-outline';
        } else if (route === HomeRoutes.ROUTINES) {
            iconName = focused ? 'barbell' : 'barbell-outline';
        } else if (route === HomeRoutes.PROFILE) {
            iconName = focused ? 'settings' : 'settings-outline';
        }
        if (focused)
            return <GradientIcon iconProps={{ name: iconName, size }} Icon={Ionicons} />
        return <Ionicons name={iconName} size={size} color='#5c5c5c' />
    };

    /** Modal states */
    const [ showCreateRoutine, setShowCreateRoutine ] = useState(false);

    return (
        <Tab.Navigator
            initialRouteName={HomeRoutes.HOME}
            screenOptions={({ route }) => ({
                /* Tab bar config */
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopColor: 'black'
                },
                tabBarIcon: ({ focused, size }) => tabBarIcon(route.name, focused, size),
                tabBarBackground: () => <View style={{ backgroundColor: 'black', flexGrow: 1 }} />
            })}
        >
            <Tab.Screen name={HomeRoutes.HOME} component={Home} />
            <Tab.Screen name={HomeRoutes.AVATAR} component={Avatar} />
            <Tab.Screen
                name={HomeRoutes.ROUTINES}
                component={Routines}
                options={{
                    headerRight: () => (
                        <>
                            <TouchableOpacity className='me-5' onPress={() => setShowCreateRoutine(true)}>
                                <Ionicons name="add" size={24} />
                            </TouchableOpacity>
                            <CreateRoutineModal show={showCreateRoutine} onClose={() => setShowCreateRoutine(false)} />
                        </>
                    )
                }}
            />
            <Tab.Screen name={HomeRoutes.PROFILE} component={Profile} />
        </Tab.Navigator>
    )
}
