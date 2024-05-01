import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { View, Text, Alert } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { createUser } from '../../firestore/user.api';
import Container from '../common/Container';
import Animated from 'react-native-reanimated';
import styles from './auth.styles';
import FQButton from '../common/FQButton';
import FormInput from '../common/FormInput';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryGradient from '../common/PrimaryGradient';

const signupSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).superRefine((arg, ctx) => {
    if (arg.password !== arg.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password', 0],
            message: 'Passwords do not match'
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'],
            message: 'Passwords do not match'
        });
    }
});
type SignupDto = z.infer<typeof signupSchema>;

export default function Signup() {

    /* Hooks */
    const { signUp } = useAuth();
    const navigation = useNavigation();
    const { handleSubmit, control } = useForm<SignupDto>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    /* Functions */
    const handleSignup = ({ email, password, confirmPassword, ...data }: SignupDto) => {
        signUp(email, password)
        .then((user) => {
            createUser(user.user.uid, {
                ...data,
                level: 1,
                points: 0,
                lifetimePoints: 0,
                workoutDays: {
                    0: null,
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                    5: null,
                    6: null
                },
                workoutTime: 0,
                streak: 0,
                streakStartDate: null,
                streakNextDate: null,
                rpm: {
                    id: null,
                    token: null,
                    avatarId: null,
                    assets: null,
                    gender: null,
                    templateId: null
                },
                avatars: []
            })
        })
        .catch((err) => {
            Alert.alert('Error', err.message);
        })
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
                    <Text style={styles.title}>Sign up</Text>
                </PrimaryGradient>
            </Animated.View>

            <View style={{ padding: 25, marginTop: 50, flexGrow: 1 }}>
                {/* Form inputs */}
                <FormInput
                    control={control}
                    fieldName='firstName'
                    placeholder='First Name'
                    autoComplete='given-name'
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black'
                />
                <FormInput
                    control={control}
                    fieldName='lastName'
                    placeholder='Last Name'
                    autoComplete='family-name'
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black'
                />
                
                <FormInput
                    control={control}
                    fieldName='email'
                    placeholder='Email'
                    autoComplete='email'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black'
                />
                <FormInput
                    control={control}
                    fieldName='password'
                    placeholder='Password'
                    autoComplete='new-password'
                    secureTextEntry
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black'
                />
                <FormInput
                    control={control}
                    fieldName='confirmPassword'
                    placeholder='Re-enter Password'
                    autoComplete='new-password'
                    secureTextEntry
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black'
                />
                
                {/* Submit button */}
                <FQButton
                    Gradient={PrimaryGradient}
                    label='Create an account'
                    onPress={handleSubmit(handleSignup)}
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
