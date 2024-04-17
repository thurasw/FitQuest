import { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import { HomeRoutes } from "./HomeRouter";
import { MainRoutes } from "./MainRouter";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { OnboardingRoutes } from "./OnboardingRouter";

/**
 * Types for main router
 */
export type MainParamList = {
    [MainRoutes.LANDING]: undefined;
    [MainRoutes.LOGIN]: undefined;
    [MainRoutes.SIGNUP]: undefined;
    [MainRoutes.ONBOARDING]: NavigatorScreenParams<OnboardingParamList>;
    [MainRoutes.HOME]: NavigatorScreenParams<HomeParamList>;
};
export type MainNavigationProp = NativeStackNavigationProp<MainParamList>;

/**
 * Types for onboarding router
 */
export type OnboardingParamList = {
    [OnboardingRoutes.STEP1]: undefined;
    [OnboardingRoutes.STEP2]: { days: number[] };
}
export type OnboardingNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<OnboardingParamList>,
    MainNavigationProp
>;

/**
 * Types for home router
 */
export type HomeParamList = {
    [HomeRoutes.HOME]: undefined;
    [HomeRoutes.AVATAR]: undefined;
    [HomeRoutes.WORKOUTS]: undefined;
    [HomeRoutes.PROFILE]: undefined;
};
export type HomeNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<HomeParamList>,
    MainNavigationProp
>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainParamList {}
    }
}