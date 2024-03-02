import { useNavigation } from "@react-navigation/native";
import { Button, Image, StyleSheet, View, Text } from "react-native";
import { MainRoutes } from "../../routes/MainRouter";
import Container from "../common/Container";
import stylesheet from "../../stylesheet";
import FQButton from "../common/Button";

export default function Landing() {

    const navigation = useNavigation() as any;

    return (
        <Container statusBarPadding={false}>
            <Image
                source={require('../../../assets/landing_bg.png')}
                style={styles.background}
            />
            <View style={styles.titlePill}>
                <Text style={styles.title}>FitQuest.</Text>
            </View>

            <Text style={styles.tagline}>
                Level up your fitness journey today!
            </Text>

            <FQButton
                variant="white"
                labelFontSize={20}
                label="Login"
                onPress={() => navigation.navigate(MainRoutes.LOGIN)}
                style={[ styles.button, styles.loginBtn ]}
            />
            <FQButton
                variant="primary"
                labelFontSize={20}
                label="Signup"
                onPress={() => navigation.navigate(MainRoutes.SIGNUP)}
                style={[styles.button, styles.signupBtn]}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    background: {
        height: '50%',
        width: '100%'
    },
    titlePill: {
        marginTop: -50,
        marginLeft: 20,
        paddingLeft: 30,
        paddingRight: 60,
        paddingVertical: 10,
        backgroundColor: stylesheet.colors.primary,
        borderRadius: 50,
        alignSelf: 'flex-start'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    tagline: {
        fontSize: 30,
        marginHorizontal: 35,
        marginTop: 50,
        color: 'white'
    },
    button: {
        marginHorizontal: 20
    },
    loginBtn: {
        marginBottom: 10,
        marginTop: 'auto'
    },
    signupBtn: {
        marginBottom: '20%'
    }
});
