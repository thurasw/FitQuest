import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { View, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../providers/AuthProvider';
import { editUser, useUser } from '../../../firestore/user.api';
import FQButton from '../../common/FQButton';
import FormInput from '../../common/FormInput';
import { useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EditProfileModalProps {
    show: boolean;
    onClose: () => void;
}

const editSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    workoutTime: z.date()
});
type EditProfileDto = z.infer<typeof editSchema>;

export default function EditProfileModal({ show, onClose }: EditProfileModalProps) {

    const { data: userData } = useUser();
    const { user } = useAuth();

    const { handleSubmit, control, setValue, watch, reset } = useForm<EditProfileDto>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            workoutTime: new Date()
        }
    });
    const workoutTime = watch('workoutTime');

    useEffect(() => {
        if (userData) {
            setValue('firstName', userData.firstName);
            setValue('lastName', userData.lastName);
            setValue('workoutTime', new Date(userData.workoutTime));
        }
    }, [ show, userData ]);

    const handleSave = async (data: EditProfileDto) => {
        try {
            if (!user) return;

            await editUser(user?.uid!, {
                firstName: data.firstName,
                lastName: data.lastName,
                workoutTime: data.workoutTime.valueOf()
            });
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
                    Edit Profile
                </Text>
                <TouchableOpacity className='ms-auto' onPress={onClose}>
                    <Text className='text-primary-500'>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View className='p-5 flex-grow flex flex-col flex-1'>
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

                <View className='flex flex-col mt-8'>
                    <Text className='text-black text-lg font-semibold'>
                        Notification Time
                    </Text>
                    <DateTimePicker
                        mode='time'
                        display='spinner'
                        value={workoutTime}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) setValue('workoutTime', selectedDate);
                        }}
                    />
                </View>
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