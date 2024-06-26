import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/main/home/Home";
import Avatar from "../components/main/avatar/Avatar";
import Routines from "../components/main/routines/Routines";
import Profile from "../components/main/profile/Profile";
import { Ionicons } from '@expo/vector-icons';
import { GradientIcon } from "../components/common/PrimaryGradient";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import RoutineModal from "../components/main/routines/RoutineModal";
import AssignRoutinesModal from "../components/main/routines/AssignRoutinesModal";
import { HomeParamList, HomeRoutes } from "./types";
import { useUser } from "../firestore/user.api";
import HomeHeader from "../components/main/home/HomeHeader";

const Tab = createBottomTabNavigator<HomeParamList>();
const tabBarIcon = (route: HomeRoutes, focused: boolean, size: number) => {
    let iconName: any;
    if (route === "HOME") {
        iconName = focused ? 'home' : 'home-outline';
    } else if (route === "AVATAR") {
        iconName = focused ? 'person' : 'person-outline';
    } else if (route === "ROUTINES") {
        iconName = focused ? 'barbell' : 'barbell-outline';
    } else if (route === "PROFILE") {
        iconName = focused ? 'settings' : 'settings-outline';
    }
    if (focused)
        return <GradientIcon iconProps={{ name: iconName, size }} Icon={Ionicons} />
    return <Ionicons name={iconName} size={size} color='#5c5c5c' />
};

export default function HomeRouter() {
    /** Modal states */
    const [ showCreateRoutine, setShowCreateRoutine ] = useState(false);
    const [ showAssignRoutine, setShowAssignRoutine ] = useState(false);

    const { data: userData } = useUser();

    return (
        <Tab.Navigator
            initialRouteName="HOME"
            screenOptions={({ route }) => ({
                /* Tab bar config */
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopColor: 'black'
                },
                tabBarIcon: ({ focused, size }) => tabBarIcon(route.name, focused, size),
                tabBarBackground: () => <View style={{ backgroundColor: 'black', flexGrow: 1 }} />,
                header: () => userData ? <HomeHeader user={userData} /> : <></>
            })}
        >
            <Tab.Screen name="HOME" component={Home} />
            <Tab.Screen name="AVATAR" component={Avatar} />
            <Tab.Screen
                name="ROUTINES"
                component={Routines}
                options={{
                    header: undefined,
                    headerRight: () => (
                        <>
                            <TouchableOpacity className='me-5' onPress={() => setShowCreateRoutine(true)}>
                                <Ionicons name="add" size={24} />
                            </TouchableOpacity>
                            <RoutineModal show={showCreateRoutine} onClose={() => setShowCreateRoutine(false)} />
                        </>
                    ),
                    headerLeft: () => (
                        <>
                            <TouchableOpacity className='ms-5' onPress={() => setShowAssignRoutine(true)}>
                                <Ionicons name="calendar" size={24} />
                            </TouchableOpacity>
                            <AssignRoutinesModal show={showAssignRoutine} onClose={() => setShowAssignRoutine(false)} />
                        </>
                    )
                }}
            />
            <Tab.Screen name="PROFILE" component={Profile} />
        </Tab.Navigator>
    )
}
