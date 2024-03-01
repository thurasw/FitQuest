import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../components/home/Home";
import Avatar from "../components/home/Avatar";
import Workouts from "../components/home/Workouts";
import Profile from "../components/home/Profile";

export enum HomeRoutes {
    HOME = "Home",
    AVATAR = "Avatar",
    WORKOUTS = "Workouts",
    PROFILE = "Profile"
}

const Tab = createBottomTabNavigator();
export default function HomeRouter() {
    return (
        <Tab.Navigator initialRouteName={HomeRoutes.HOME}>
            <Tab.Screen name={HomeRoutes.HOME} component={Home} />
            <Tab.Screen name={HomeRoutes.AVATAR} component={Avatar} />
            <Tab.Screen name={HomeRoutes.WORKOUTS} component={Workouts} />
            <Tab.Screen name={HomeRoutes.PROFILE} component={Profile} />
        </Tab.Navigator>
    )
}