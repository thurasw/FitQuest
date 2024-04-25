import { Modal, Text, View } from "react-native";
import { editUser, useUser } from "../../../firestore/user.api";
import { Fragment, useMemo } from "react";
import { useRoutines } from "../../../firestore/routine.api";
import RNPickerSelect from 'react-native-picker-select';
import { useAuth } from "../../../providers/AuthProvider";
import { Ionicons } from '@expo/vector-icons';
import FQButton from "../../common/FQButton";

interface AssignRoutinesModalProps {
    show: boolean;
    onClose: () => void;
}

export default function AssignRoutinesModal({ show, onClose } : AssignRoutinesModalProps) {

    const { user } = useAuth();
    const { data: userData } = useUser();
    const { snapshot: routines } = useRoutines();

    const assignments = useMemo(() => {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (!routines || !userData) return undefined;

        return Object.entries(userData.workoutDays).map(([ dayIdx, value ]) => {
            const assignedRoutine = routines.docs.find((doc) => doc.ref.path === value?.path);

            return {
                day: weekdays[Number(dayIdx)],
                dayIdx: Number(dayIdx),
                routineId: assignedRoutine?.id,
                routine: assignedRoutine?.data()
            }
        });
    }, [ routines, userData ]);

    const handleAssignment = async(dayIdx: number, routineId: string) => {
        // Assign routine to day
        await editUser(user!.uid, {
            [`workoutDays.${dayIdx}`]: routines!.docs.find((doc) => doc.id === routineId)?.ref ?? null
        });
    }

    return (
        <Modal
            visible={show}
            onRequestClose={onClose}
            transparent={true}
            animationType='fade'
        >
            <View className='w-full h-full bg-black/75 flex items-center justify-center'>
                <View className='bg-white rounded-lg px-5 pt-8 pb-4 self-stretch mx-10 flex flex-col gap-4'>
                    {
                        assignments?.map((as, idx) => (
                            <Fragment key={as.day}>
                                { idx !== 0 && <View className='w-full h-px bg-neutral-300'></View> }
                                <View className='flex flex-row flex-nowrap items-center justify-between'>
                                    <Text className='font-semibold text-xl'>{ as.day }</Text>
                                    
                                    <RNPickerSelect
                                        style={{
                                            viewContainer: {
                                                paddingHorizontal: 15,
                                                paddingRight: 25,
                                                paddingVertical: 8,
                                                backgroundColor: '#E2E8F0',
                                                borderRadius: 8
                                            },
                                            iconContainer: {
                                                right: -18,
                                                top: 2
                                            }
                                        }}
                                        Icon={
                                            () => <Ionicons name="chevron-down" size={15} color='#94a3b8' />
                                        }
                                        placeholder={{
                                            label: 'Select routine',
                                            value: null
                                        }}
                                        items={
                                            routines!.docs.map((doc) => ({
                                                label: doc.data().name,
                                                value: doc.id,
                                                key: doc.id
                                            }))
                                        }
                                        itemKey={as.routineId}
                                        onValueChange={(routineId) => handleAssignment(as.dayIdx, routineId)}
                                    />
                                </View>
                            </Fragment>
                        ))
                    }

                    <View className='mt-5'>
                        <FQButton
                            className='bg-primary-900'
                            textProps={{
                                className: 'text-white'
                            }}
                            label='Done'
                            onPress={onClose}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
