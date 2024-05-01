import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { View, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../providers/AuthProvider';
import FQButton from '../../common/FQButton';
import FormInput from '../../common/FormInput';
import { useEffect } from 'react';

interface EditPasswordModalProps {
    show: boolean;
    onClose: () => void;
}

const editSchema = z.object({
    currentPassword: z.string().min(8),
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
type EditPasswordDto = z.infer<typeof editSchema>;

export default function EditPasswordModal({ show, onClose }: EditPasswordModalProps) {

    useEffect(() => {
        reset();
    }, [ show ])

    const { user, signIn } = useAuth();
    const { handleSubmit, control, setError, reset } = useForm<EditPasswordDto>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            currentPassword: '',
            password: '',
            confirmPassword: ''
        }
    });

    const handleSave = async (data: EditPasswordDto) => {
        try {
            if (!user) return;
            if (data.password !== data.confirmPassword) {
                return Alert.alert('Passwords do not match');
            }

            try {
                await signIn(user.email!, data.currentPassword);
            }
            catch(err) {
                setError('currentPassword', {
                    message: 'Incorrect password'
                }, {
                    shouldFocus: true,
                });
                return Alert.alert('Incorrect password');
            }

            await user.updatePassword(data.password);
            Alert.alert('Changes saved successfully!');
            onClose();
        }
        catch(e: any) {
            Alert.alert('An error occurred', e.message);
            console.error(e);
        }
    }

    return (
        <Modal
            visible={show}
            onRequestClose={onClose}
            presentationStyle='pageSheet'
            animationType='slide'
        >
            {/* Header */}
            <View className='flex flex-row items-center p-5 bg-neutral-100'>
                <Text className='invisible'>Cancel</Text>
                <Text className='font-semibold text-xl text-center ms-auto'>
                    Edit Password
                </Text>
                <TouchableOpacity className='ms-auto' onPress={onClose}>
                    <Text className='text-primary-500'>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View className='p-5 flex-grow flex flex-col flex-1'>
                {/* Form inputs */}
                <FormInput
                    control={control}
                    fieldName='currentPassword'
                    placeholder='Old Password'
                    autoComplete='new-password'
                    secureTextEntry
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black mt-5'
                />
                <FormInput
                    control={control}
                    fieldName='password'
                    placeholder='New Password'
                    autoComplete='new-password'
                    secureTextEntry
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black mt-8'
                />
                <FormInput
                    control={control}
                    fieldName='confirmPassword'
                    placeholder='Re-enter Password (Optional)'
                    autoComplete='new-password'
                    secureTextEntry
                    enterKeyHint='next'
                    className='bg-neutral-800 text-black'
                />

                <FQButton
                    className='bg-primary-900 mt-auto mb-10'
                    textProps={{ className: 'text-white' }}
                    label='Save Changes'
                    onPress={handleSubmit(handleSave)}
                />
            </View>
        </Modal>
    )
}