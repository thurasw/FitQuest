import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FQButton from "../../common/FQButton";
import { getAvatarPreviewUrl, useAvatarAssets } from "../../../api/endpoints.api";
import { useEffect, useMemo, useRef, useState } from "react";
import { editUser, useUser } from "../../../firestore/user.api";
import { AssetType } from "../../../api/variables.api";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import IconEyebrow from '../../../../assets/vectors/eyebrow.svg';
import IconBeard from '../../../../assets/vectors/beard.svg';
import IconHair from '../../../../assets/vectors/hair.svg';
import { SvgProps } from "react-native-svg";
import AvatarModel3D from "./AvatarModel3D";
import { duplicateAvatar, saveRpmAvatarChanges, updateRpmAvatar } from "../../../api/mutations.api";
import { createUnlockedAsset, useUnlockedAssets } from "../../../firestore/unlocked-assets.api";
import { useAuth } from "../../../providers/AuthProvider";

interface AvatarEditorModalProps {
    show: boolean;
    onClose: () => void;
}
export default function AvatarEditorModal({ show, onClose } : AvatarEditorModalProps) {
    return (
        <Modal
            visible={show}
            onRequestClose={onClose}
            animationType='slide'
            presentationStyle='pageSheet'
        >
            <View className='flex flex-col mt-auto mb-10 flex-1'>
                <AvatarEditor onCancel={onClose} />
            </View>
        </Modal>
    )
}

function AvatarEditor({ onCancel } : { onCancel: () => void }) {
    const { user } = useAuth();
    const { data: userData } = useUser();
    const [ selectedType, setSelectedType ] = useState<AssetType>('eye');

    const assetTypes : Record<AssetType, React.FC<SvgProps> | [typeof MaterialCommunityIcons, any]> = {
        eye: [MaterialCommunityIcons, 'eye-settings'],
        eyebrows: IconEyebrow,
        beard: IconBeard,
        hair: IconHair,
        glasses: [MaterialCommunityIcons, 'glasses'],
        // facemask: [MaterialCommunityIcons,'face-mask'],
        headwear: [MaterialCommunityIcons, 'head'],
        // top: [MaterialCommunityIcons, 'tshirt-crew'],
        shirt: [MaterialCommunityIcons, 'tshirt-crew']
    } as const;

    const AssetTypeMapping = {
        eye: 'eyeColor',
        eyebrows: 'eyebrowStyle',
        beard: 'beardStyle',
        hair: 'hairStyle'
    } as Record<AssetType, string>;

    // Fetch assets data
    const { data } = useAvatarAssets(selectedType, userData?.rpm?.gender!, undefined, {
        enabled: !!userData?.rpm.gender
    });
    const { data: unlockedAssets } = useUnlockedAssets((query) => {
        return query.where('type', '==', selectedType);
    });

    // Set the current displayed avatar to the user's saved avatar
    const setAvatarToUser = async() => {
        if (!userData) return;
        const newAvatar = await duplicateAvatar(userData.rpm.token!, userData.rpm.templateId!, userData.rpm.assets!);
        setAvatarId(newAvatar.id);
        setCurrentConfig(newAvatar.assets);
        setLockedPreview(undefined);
    };
    // Set the avatar to the user's saved avatar on first render
    useEffect(() => {
        if (!userData || isInit.current) return;
        setAvatarToUser()
        .then(() => {
            isInit.current = true;
        });
    }, [ userData ]);

    const isInit = useRef(false);
    const [ avatarId, setAvatarId ] = useState<string>();
    const [ currentConfig, setCurrentConfig ] = useState<Record<string, string | number>>({}); // Current config is the current equipped assets in the preview
    const [ lockedPreview, setLockedPreview ] = useState<[ string, string | number ]>(); // Only allow one preview at a time (locked asset)
    const [ reloadCounter, setReloadCounter ] = useState(0);

    const avatarModelUrl = avatarId ? getAvatarPreviewUrl(avatarId) + `#${reloadCounter}` : undefined;
    
    const handleAssetEquip = async(assetType: AssetType, assetId: string) => {
        if (!avatarId) return;
        try {
            const type = AssetTypeMapping[assetType] || assetType;
            const newConfig = await updateRpmAvatar(userData?.rpm.token!, avatarId, {
                ...currentConfig,
                [type]: assetId
            });
            setCurrentConfig(newConfig.assets);
            setLockedPreview(undefined);
            setReloadCounter(r => r+1);
        }
        catch(err) {
            console.error(err);
            Alert.alert('Error', 'Failed to equip asset');
        }
    };
    const handlePreview = async(assetType: AssetType, assetId: string) => {
        if (!avatarId) return;
        try {
            const type = AssetTypeMapping[assetType] || assetType;
            await updateRpmAvatar(userData?.rpm.token!, avatarId, {
                ...currentConfig,
                [type]: assetId
            });
            setLockedPreview([assetType, assetId]);
            setReloadCounter(r => r+1);
        }
        catch(err) {
            console.error(err);
            Alert.alert('Error', 'Failed to equip asset');
        }
    }
    const handleRemovePreview = async() => {
        if (!avatarId) return;
        try {
            const newConfig = await updateRpmAvatar(userData?.rpm.token!, avatarId, currentConfig);
            setCurrentConfig(newConfig.assets);
            setLockedPreview(undefined);
            setReloadCounter(r => r+1);
        }
        catch(err) {
            console.error(err);
            Alert.alert('Error', 'Failed to remove asset');
        }
    };
    const revert = async() => {
        if (!avatarId) return;
        try {
            const newConfig = await updateRpmAvatar(userData?.rpm.token!, avatarId, userData?.rpm.assets!);
            setCurrentConfig(newConfig.assets);
            setLockedPreview(undefined);
            setReloadCounter(r => r+1);
        }
        catch(err) {
            console.error(err);
            Alert.alert('Unexpected error', 'Failed to revert changes');
        }
    }

    const handleSave = async() => {
        try {
            await updateRpmAvatar(userData?.rpm.token!, userData?.rpm.avatarId!, currentConfig);
            const res = await saveRpmAvatarChanges(userData?.rpm.token!, userData?.rpm.avatarId!);
            await editUser(user!.uid, {
                'rpm.assets': res.assets
            });

            Alert.alert('Success', 'Changes saved');
            onCancel();
        }
        catch(err) {
            console.error(err);
            Alert.alert('Error', 'Failed to save changes');
        }
    };

    const assets = useMemo(() => {
        const arr = data?.pages
        .flatMap(p => p.data)
        .map(d => ({
            ...d,
            isUnlocked: unlockedAssets?.some(u => u.id === d.id) === true
        }))
        .filter(p =>
            !p.name.includes('test') &&
            !p.name.includes('anime') &&
            !p.name.includes('omlet')
        ) ?? [];

        return arr.sort((a, b) => {
            if (a.isUnlocked) {
                if (b.isUnlocked) {
                    return 0;
                }
                return -1;
            }
            return 1;
        });
    }, [ data, unlockedAssets ]);

    const isChanged = useMemo(() => {
        return Object.keys(currentConfig).some(k => currentConfig[k] !== userData?.rpm.assets?.[k]);
    }, [ userData, currentConfig ])

    return (
        <>
            {/* Avatar Model Preview */}
            <View style={{ height: 300 }} className='py-10 bg-slate-500'>
                {
                    avatarModelUrl === undefined ? (
                        <ActivityIndicator />
                    ) : (
                        <AvatarModel3D
                            url={avatarModelUrl}
                        />
                    )
                }
            </View>
            {/* Asset Selector */}
            <View className='flex-1'>
                <Text className='text-slate-400 my-2 text-center'>
                    Tip: Hold down to preview locked items
                </Text>
                <ScrollView>
                    <View className='flex flex-row flex-wrap px-5 pb-5 items-center justify-around flex-grow-1 gap-2'>
                        {
                            assets
                            .map(asset => (
                                <AssetItem
                                    key={asset.id}
                                    assetUrl={asset.iconUrl}
                                    assetId={asset.id}
                                    assetType={asset.type}
                                    handleEquip={handleAssetEquip}
                                    handlePreview={handlePreview}
                                    isUnlocked={asset.isUnlocked}
                                    isSelected={currentConfig[AssetTypeMapping[asset.type] || asset.type] === asset.id}
                                    isPreview={lockedPreview?.[0] === asset.type && lockedPreview?.[1] === asset.id}
                                />
                            ))
                        }
                    </View>
                </ScrollView>
            </View>
            {/* Asset Type Selector */}
            <View className='px-5 pt-3 mt-auto'>
                <ScrollView horizontal>
                    {Object.entries(assetTypes).map((type) => {
                        const typeName = type[0] as AssetType;
                        const Icon = Array.isArray(type[1]) ? type[1][0] : type[1];

                        return (
                            <FQButton
                                key={typeName}
                                className={`py-2 me-1 ${selectedType === typeName ? 'bg-primary-900' : 'bg-slate-200'}`}
                                onPress={() => setSelectedType(typeName)}
                            >
                                {Array.isArray(type[1]) ? (
                                    <Icon name={type[1][1]} size={24} color={selectedType === typeName ? 'white' : 'black'} />
                                ) : (
                                    <Icon width={24} height={24} fill={selectedType === typeName ? 'white' : 'black'} />
                                )}
                            </FQButton>
                        );
                    })}
                </ScrollView>
            </View>
            { /* Buttons */}
            <View className='px-5 my-3 flex flex-row flex-nowrap items-center justify-between gap-3'>
                {
                    isChanged ? (
                        <FQButton
                            className='border-2 border-red-500 rounded-3xl bg-red-500 w-1/2'
                            textProps={{ className: 'text-white' }}
                            label='Revert'
                            onPress={revert}
                        />
                    ) : (
                        <FQButton
                            className='border-red-500 border-2 rounded-3xl bg-transparent w-1/2'
                            textProps={{ className: 'text-red-500' }}
                            label='Cancel'
                            onPress={onCancel}
                        />
                    )
                }
                {
                    lockedPreview === undefined ? (
                        <FQButton
                            className='border-2 border-primary-900 rounded-3xl bg-primary-900 w-1/2'
                            textProps={{ className: 'text-white' }}
                            disabled={!isChanged}
                            label='Save'
                            onPress={handleSave}
                        />
                    ) : (
                        <FQButton
                            className='border-2 border-primary-900 rounded-3xl bg-transparent w-1/2'
                            textProps={{ className: 'text-primary-900' }}
                            label='Remove Preview'
                            onPress={handleRemovePreview}
                        />
                    )
                }
            </View>
        </>
    );
} 

interface UnlockAssetItemProps {
    assetUrl: string;
    assetType: AssetType;
    assetId: string;
    handlePreview: (assetType: AssetType, assetId: string) => Promise<void>;
    handleEquip: (assetType: AssetType, assetId: string) => Promise<void>;
    isUnlocked: boolean;
    isSelected: boolean;
    isPreview: boolean;
}
function AssetItem({ assetUrl, assetId, assetType, isUnlocked, handlePreview, handleEquip, isSelected, isPreview }: UnlockAssetItemProps) {

    const { user } = useAuth();

    const handleUnlock = () => {
        Alert.alert('Unlock item?', 'This will cost you 100 points', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Unlock',
                onPress: () => {
                    createUnlockedAsset(user!.uid, {
                        type: assetType,
                        id: assetId
                    })
                    .catch((err) => {
                        Alert.alert('Could not unlock item', err.message);
                    });
                }
            }
        ])
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: 100, height: 100 }}
            onPress={() => {
                if (isUnlocked) {
                    handleEquip(assetType, assetId);
                }
                else {
                    handleUnlock();
                }
            }}
            onLongPress={!isUnlocked ? () => handlePreview(assetType, assetId) : undefined}
        >
            <View className={`mb-2 rounded-xl w-full h-full ${ isSelected ? 'bg-slate-700' : 'bg-slate-300' }`}>
                <Image source={{ uri: assetUrl }} width={100} height={100} />
            </View>

            {
                !isUnlocked && (
                    <View className='w-full h-full flex flex-row flex-nowrap items-center justify-center gap-2 z-10 absolute bg-black/40 rounded-xl top-0 left-0'                >
                        <FontAwesome6 name='coins' color='gold' size={16} />
                        <Text className='text-white'>100</Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}
