import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryFn, useFirestoreCollection } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';
import { getUserDocument } from './user.api';

/**
 * Helper functions for doc/collection references
 */
const ASSETS_COLLECTION = 'unlockedAssets';
export const getUnlockedAssetsCollection = (uid: string) => {
    return getUserDocument(uid).collection(ASSETS_COLLECTION) as FirebaseFirestoreTypes.CollectionReference<FitQuest.UnlockedAsset>;
}

/**
 * Hook for live updates
 */
export const useUnlockedAssets = (query?: QueryFn<FitQuest.UnlockedAsset>) => {
    const { user } = useAuth();
    let collection = user ? getUnlockedAssetsCollection(user.uid) : null;
    
    return useFirestoreCollection(collection, query);
}

/**
 * CRUD operations
 */
export const createUnlockedAsset = async(uid: string, data: FitQuest.UnlockedAsset, deductPoints = true) => {
    const user = getUserDocument(uid);
    const batch = user.firestore.batch();

    if (deductPoints) {
        const points = (await user.get()).data()?.points;
        if (points !== undefined && points < 100) {
            throw new Error('Insufficient points');
        }

        batch.update(user, {
            points: firestore.FieldValue.increment(-100)
        });
    }

    // Create unlocked asset
    const ref = getUnlockedAssetsCollection(uid).doc();
    batch.set(ref, data);

    await batch.commit();
}
