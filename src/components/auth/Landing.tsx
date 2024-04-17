import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Text, View, useWindowDimensions } from "react-native";
import { MainRoutes } from "../../routes/MainRouter";
import Container from "../common/Container";
import FQButton from "../common/FQButton";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import styles from "./auth.styles";
import { useEffect, useState } from "react";
import PrimaryGradient from "../common/PrimaryGradient";

export default function Landing() {

    /* Hooks */
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { width } = useWindowDimensions();

    /** Taglines */
    const taglines = [
        `Level up your\nFitness journey today!`,
        'Transform your workouts\nOne level at a time!',
        'Unlock your best self\nThrough fitness fun!'
    ];

    /** Animate taglines */
    const taglineTranslates = useSharedValue([ 0, width, -width ]);

    // Translate X values for taglines every 3s
    useEffect(() => {
        taglineTranslates.value = withRepeat(
            withSequence(
                withDelay(3000, withSpring([0, width, -width])),
                withTiming([0, width, width], { duration: 0 }),
                withDelay(3000, withSpring([-width, 0, width])),
                withDelay(3000, withSpring([-width, -width, 0])),
                withTiming([width, width, 0], { duration: 0 }),
            ), -1
        );
    }, []);

    // Styles for each tagline from the shared values
    const tagline1Style = useAnimatedStyle(() => ({
        transform: [{ translateX: taglineTranslates.value[0] }]
    }));
    const tagline2Style = useAnimatedStyle(() => ({
        transform: [{ translateX: taglineTranslates.value[1] }]
    }));
    const tagline3Style = useAnimatedStyle(() => ({
        transform: [{ translateX: taglineTranslates.value[2] }]
    }));
    

    // Reset title label when the user navigates back to the landing page
    const [ titleLabel, setTitleLabel ] = useState('FitQuest.');
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
        <Container style={{ backgroundColor: '#151515' }}>
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
                style={{
                    position: 'absolute',
                    top: '40%',
                    zIndex: 1
                }}
            >
                <PrimaryGradient style={styles.titlePill}>
                    <Text style={styles.title}>{ titleLabel }</Text>
                </PrimaryGradient>
            </Animated.View>

            {/* Tagline */}
            <View style={{ flexDirection: 'row' }}>
                {
                    taglines.map((tagline, index) => (
                        <Animated.Text
                            key={index}
                            style={[styles.tagline, index === 0 ? tagline1Style : index === 1 ? tagline2Style : tagline3Style]}
                        >
                            { tagline }
                        </Animated.Text>
                    ))
                }
            </View>

            <FQButton
                variant="primary_gradient"
                labelFontSize={20}
                label="Get Started"
                onPress={goToSignup}
                style={{
                    marginHorizontal: 20,
                    marginBottom: 15,
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
                <Text style={{ color: 'white', fontSize: 15 }}>
                    Already a member?
                    <Text style={{ fontWeight: 'bold' }}> Sign in</Text>
                </Text>
            </FQButton>
        </Container>
    )
}
