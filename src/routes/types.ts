import { NavigatorScreenParams } from "@react-navigation/native";

/**
 * Main Router
 */
export type MainParamList = {
    "LANDING": undefined;
    "LOGIN": undefined;
    "SIGNUP": undefined;
    "ONBOARDING": NavigatorScreenParams<OnboardingParamList>;
    "MAIN": NavigatorScreenParams<HomeParamList>;
};
export type MainRoutes = keyof MainParamList;


/**
 * Onboarding Router
 */
export type OnboardingParamList = {
    "STEP1": undefined;
    "STEP2": { days: number[] };
    "STEP3": { days: number[]; time: number; };
}
export type OnboardingRoutes = keyof OnboardingParamList;


/**
 * Home Tabs Router
 */
export type HomeParamList = {
    "HOME": undefined;
    "AVATAR": undefined;
    "ROUTINES": undefined;
    "PROFILE": undefined;
};
export type HomeRoutes = keyof HomeParamList;


declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainParamList {}
    }
}