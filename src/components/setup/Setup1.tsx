import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "react-native";
import { useAuth } from "../../providers/AuthProvider";

export default function Setup1() {

    const { signOut } = useAuth();

    return (
        <SafeAreaView>
            <Text>Setup screen 1</Text>
            <Button title="Logout" onPress={signOut} />
        </SafeAreaView>
    )
}