import { NavigatorScreenParams } from "@react-navigation/native";
import { HomeRoutes } from "./HomeRouter";
import { MainRoutes } from "./MainRouter";

export type MainParamList = {
    [MainRoutes.LANDING]: undefined;
    [MainRoutes.LOGIN]: undefined;
    [MainRoutes.SIGNUP]: undefined;
    [MainRoutes.SETUP1]: undefined;
    [MainRoutes.SETUP2]: undefined;
    [MainRoutes.HOME]: NavigatorScreenParams<HomeParamList>;
};

export type HomeParamList = {
    [HomeRoutes.HOME]: undefined;
    [HomeRoutes.AVATAR]: undefined;
    [HomeRoutes.WORKOUTS]: undefined;
    [HomeRoutes.PROFILE]: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainParamList {}
    }
}