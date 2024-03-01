import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainRoutes } from "../../routes/MainRouter";

export default function Landing() {

    const navigation = useNavigation() as any;

    return (
        <SafeAreaView>
            <Button title="Login" onPress={() => navigation.navigate(MainRoutes.LOGIN)} />
            <Button title="Signup" onPress={() => navigation.navigate(MainRoutes.SIGNUP)} />
        </SafeAreaView>
    )
}