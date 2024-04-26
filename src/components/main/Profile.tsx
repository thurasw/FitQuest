import { View, Text } from "react-native";
import FQButton from "../common/FQButton";
import { useAuth } from "../../providers/AuthProvider";
import Container from "../common/Container";

export default function Profile() {

    const auth = useAuth();

    return (
        <Container className='p-5 mt-5'>
            <View>
                <FQButton
                    className='bg-primary-900 rounded-xl px-4 py-3'
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