import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/home/Home";
import Avatar from "../components/home/Avatar";
import Workouts from "../components/home/workouts/Workouts";
import Profile from "../components/home/Profile";
import { Ionicons } from '@expo/vector-icons';
import { GradientIcon, GradientText } from "../components/common/PrimaryGradient";
import { View } from "react-native";

export enum HomeRoutes {
    HOME = "Home",
    AVATAR = "Avatar",
    WORKOUTS = "Workouts",
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
        } else if (route === HomeRoutes.WORKOUTS) {
            iconName = focused ? 'barbell' : 'barbell-outline';
        } else if (route === HomeRoutes.PROFILE) {
            iconName = focused ? 'settings' : 'settings-outline';
        }
        if (focused)
            return <GradientIcon iconProps={{ name: iconName, size }} Icon={Ionicons} />
        return <Ionicons name={iconName} size={size} color='#5c5c5c' />
    };

    return (
        <Tab.Navigator
            initialRouteName={HomeRoutes.HOME}
            screenOptions={({ route }) => ({
                /* Header config */
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
            <Tab.Screen name={HomeRoutes.WORKOUTS} component={Workouts} />
            <Tab.Screen name={HomeRoutes.PROFILE} component={Profile} />
        </Tab.Navigator>
    )
}
