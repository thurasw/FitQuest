import React from 'react';
import { Alert, View, Text } from 'react-native';
import Container from '../common/Container';
import z from 'zod';
import { useAuth } from '../../providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../common/FormInput';
import FQButton from '../common/FQButton';
import Animated from 'react-native-reanimated';
import styles from './auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PrimaryGradient from '../common/PrimaryGradient';

// Form validation schema
const loginSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(8),
});
type LoginDto = z.infer<typeof loginSchema>;
 
export default function Login() {

    /* Hooks */
    const navigation = useNavigation();
    const { signIn } = useAuth();
    const { handleSubmit, control } = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    /* Functions */
    const login = (values: LoginDto) => {
        signIn(values.email, values.password)
        .catch((err) => {
            Alert.alert('Error', err.message);
        });
    };

    return (
        <Container style={{ backgroundColor: '#151515' }}>
            <FQButton
                style={{
                    position: 'absolute',
                    top: '7%',
                    zIndex: 1
                }}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={24} color="white" />
            </FQButton>

            {/* Landing image and title */}
            <Animated.Image
                sharedTransitionTag="landingImg"
                source={require('../../../assets/landing_bg.png')}
                style={{
                    width: '100%',
                    height: '20%'
                }}
            />
            <Animated.View
                sharedTransitionTag="landingTitlePill"
                style={{
                    position: 'absolute',
                    top: '20%',
                    zIndex: 1
                }}
            >
                <PrimaryGradient style={styles.titlePill}>
                    <Text style={styles.title}>Sign in</Text>
                </PrimaryGradient>
            </Animated.View>

            <View style={{ padding: 25, marginTop: 50, flexGrow: 1 }}>
                <FormInput
                    control={control}
                    fieldName='email'
                    placeholder='Email'
                    autoComplete='email'
                    keyboardType='email-address'
                    enterKeyHint='next'
                    autoCapitalize='none'
                    className='bg-neutral-800 text-black'
                />
                <FormInput
                    control={control}
                    fieldName='password'
                    placeholder='Password'
                    secureTextEntry
                    autoComplete='current-password'
                    blurOnSubmit={true}
                    enterKeyHint='send'
                    className='bg-neutral-800 text-black'
                />
                <FQButton
                    label='Sign in'
                    Gradient={PrimaryGradient}
                    onPress={handleSubmit(login)}
                    style={{
                        marginBottom: '20%',
                        marginTop: 'auto'
                    }}
                    textProps={{
                        className: 'text-white text-xl font-semibold'
                    }}
                />
            </View>
        </Container>
    );
};
