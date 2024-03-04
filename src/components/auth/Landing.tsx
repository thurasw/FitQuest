import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Text } from "react-native";
import { MainRoutes } from "../../routes/MainRouter";
import Container from "../common/Container";
import FQButton from "../common/FQButton";
import Animated from 'react-native-reanimated';
import styles from "./auth.styles";
import { useEffect, useState } from "react";

export default function Landing() {

    /* Hooks */
    const navigation = useNavigation() as any;
    const isFocused = useIsFocused();

    const [ titleLabel, setTitleLabel ] = useState('FitQuest.');

    // Reset title label when the user navigates back to the landing page
    useEffect(() => {
        if (isFocused) {
            setTitleLabel('FitQuest.');
        }
    }, [ isFocused ]);

    /* Functions */
    // Update the label before animation starts
    const goToLogin = () => {
        setTitleLabel('Sign in');
        navigation.navigate(MainRoutes.LOGIN);
    };

    const goToSignup = () => {
        setTitleLabel('Sign up');
        navigation.navigate(MainRoutes.SIGNUP);
    };

    return (
        <Container statusBarPadding={false}>
            {/* Landing image and title */}
            <Animated.Image
                sharedTransitionTag="landingImg"
                source={require('../../../assets/landing_bg.png')}
                style={{
                    width: '100%',
                    height: '40%'
                }}
            />
            <Animated.View
                sharedTransitionTag="landingTitlePill"
                style={[styles.titlePill, {
                    position: 'absolute',
                    top: '40%',
                    zIndex: 1
                }]}
            >
                <Text style={styles.title}>{ titleLabel }</Text>
            </Animated.View>

            <Text style={styles.tagline}>
                Level up your fitness journey today!
            </Text>

            <FQButton
                variant="primary"
                labelFontSize={20}
                label="Get Started"
                onPress={goToSignup}
                style={{
                    marginHorizontal: 20,
                    marginBottom: 25,
                    marginTop: 'auto'
                }}
            />
            <FQButton
                variant="transparent"
                onPress={goToLogin}
                style={{
                    marginHorizontal: 20,
                    marginBottom: '20%'
                }}
            >
                <Text style={{ color: 'white' }}>
                    Already a member?
                    <Text style={{ fontWeight: 'bold' }}> Sign in</Text>
                </Text>
            </FQButton>
        </Container>
    )
}
