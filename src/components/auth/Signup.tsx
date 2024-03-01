import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { View, TextInput, Button } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { createUser } from '../../firestore/user.api';

const signupSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    dateOfBirth: z.string().min(1)
}).refine((data) => {
    return data.password === data.confirmPassword;
}, {
    message: 'Passwords do not match',
    path: ['password', 'confirmPassword']
});
type SignupDto = z.infer<typeof signupSchema>;

export default function Signup() {

    const { signUp } = useAuth();
    const { handleSubmit, control } = useForm<SignupDto>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            dateOfBirth: ''
        }
    });

    const handleSignup = (data: SignupDto) => {
        signUp(data.email, data.password)
        .then((user) => {
            createUser(user.user.uid, {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                level: 1,
                points: 0,
                streak_start: null,
                setup_complete: false,
                workout_days: []
            })
        });
    };

    return (
        <View>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="First Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="firstName"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Last Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="lastName"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="email"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        secureTextEntry
                        placeholder="Password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="password"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        secureTextEntry
                        placeholder="Confirm Password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="confirmPassword"
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder="Date of Birth"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name="dateOfBirth"
            />
            <Button title="Sign Up" onPress={handleSubmit(handleSignup)} />
        </View>
    );
};
