import { View, Text } from "react-native";
import FQButton from "../common/FQButton";
import { useAuth } from "../../providers/AuthProvider";
import Container from "../common/Container";

export default function Home() {

    const auth = useAuth();

    return (
        <Container>
            <View style={{ marginTop: 20 }}>
                <FQButton
                    className='bg-primary-900'
                    textProps={{
                        className: 'text-white'
                    }}
                    label='Log out'
                    onPress={() => auth.signOut()}
                />
            </View>
        </Container>
    )
};