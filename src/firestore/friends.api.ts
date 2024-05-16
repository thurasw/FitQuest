import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryFn, useFirestoreCollection, useFirestoreDocument } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';
import { getUserDocument } from './user.api';

/**
 * Helper functions for doc/collection references
 */
const FRIENDS_COLLECTION = 'friends';

export const getFriendsCollection = (uid: string) => {
    return getUserDocument(uid).collection(FRIENDS_COLLECTION) as FirebaseFirestoreTypes.CollectionReference<FitQuest.Friend>;
}
export const getFriendDocument = (uid: string, friendId: string) => {
    return getFriendsCollection(uid).doc(friendId);
}

/**
 * Hook for live updates
 */
export const useFriends = (query?: QueryFn<FitQuest.Friend>) => {
    const { user } = useAuth();
    let collection = user ? getFriendsCollection(user.uid) : null;
    
    return useFirestoreCollection(collection, query);
}

/**
 * CRUD operations
 */
export const addFriend = async(uid: string, friendId: string) => {
    const user = getUserDocument(friendId);
    
    // const friend = await user.get();
    // if (!friend.exists) throw new Error('User does not exist!');
    
    const batch = user.firestore.batch();

    // Add the record to user's own friends collection
    batch.set(getFriendDocument(uid, friendId), {
        accepted: true
    });
    // Add the record to the friend's friends collection
    batch.set(getFriendDocument(friendId, uid), {
        accepted: false
    });
    return batch.commit();
}
export const acceptFriend = (uid: string, friendId: string) => {
    return getFriendsCollection(uid).doc(friendId).update({
        accepted: true
    });
}
export const removeFriend =  (uid: string, friendId: string) => {
    const friendDoc = getFriendDocument(uid, friendId);
    const requestDoc = getFriendDocument(friendId, uid);

    const batch = friendDoc.firestore.batch();
    batch.delete(friendDoc);
    batch.delete(requestDoc);

    return batch.commit();
}