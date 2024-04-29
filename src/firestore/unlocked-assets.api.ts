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
export const createUnlockedAsset = async(uid: string, data: FitQuest.UnlockedAsset) => {
    const user = getUserDocument(uid);
    const points = (await user.get()).data()?.points;

    if (points && points < 100) {
        throw new Error('Insufficient points');
    }

    const batch = user.firestore.batch();

    // Create unlocked asset
    const ref = getUnlockedAssetsCollection(uid).doc();
    batch.set(ref, data);
    
    batch.update(user, {
        points: firestore.FieldValue.increment(-100)
    });

    await batch.commit();
}
