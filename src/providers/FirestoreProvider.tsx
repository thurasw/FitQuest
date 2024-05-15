import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface IFirestoreContext {
    /* Returns an unsubscribe function */
    subscribeToDocument: <T extends {}>(
        document: FirebaseFirestoreTypes.DocumentReference<T>,
        callback: (error: Error | null, snapshot?: FirebaseFirestoreTypes.DocumentSnapshot<T>) => void
    ) => () => void;

    /* Returns an unsubscribe function */
    subscribeToCollection: <T extends {}>(
        collection: FirebaseFirestoreTypes.Query<T>,
        callback: (error: Error | null, snapshot?: FirebaseFirestoreTypes.QuerySnapshot<T>) => void
    ) => () => void;
}

/* Create the context & consumer hook */
const FirestoreContext = createContext<IFirestoreContext | undefined>(undefined);
export function useFirestore() {
    const context = useContext(FirestoreContext);
    if (context === undefined) {
        throw new Error('useFirestore must be used within a FirestoreProvider');
    }
    return context;
}

/* Context Provider */
type DocumentSub = {
    document: FirebaseFirestoreTypes.DocumentReference<any>;
    callbacks: ((error: Error | null, snapshot?: FirebaseFirestoreTypes.DocumentSnapshot<any>) => void)[];
    lastError: Error | null;
    lastSnapshot: FirebaseFirestoreTypes.DocumentSnapshot<any> | null;
    unsubscribe: () => void;
};
type CollectionSub = {
    collection: FirebaseFirestoreTypes.Query<any>;
    callbacks: ((error: Error | null, snapshot?: FirebaseFirestoreTypes.QuerySnapshot<any>) => void)[];
    lastError: Error | null;
    lastSnapshot: FirebaseFirestoreTypes.QuerySnapshot<any> | null;
    unsubscribe: () => void;
};

export default function FirestoreProvider({ children } : { children: React.ReactNode }) {
    const documentSubs = useRef<DocumentSub[]>([]);
    const collectionSubs = useRef<CollectionSub[]>([]);

    const subscribeToDocument: IFirestoreContext['subscribeToDocument'] = (document, callback) => {
        const unsub = (sub: DocumentSub) => {
            // Remove the callback from the list
            sub.callbacks = sub.callbacks.filter(f => f !== callback);

            // No more subscriptions, unsubscribe from the snapshot entirely
            if (sub.callbacks.length === 0) {
                sub.unsubscribe();
                documentSubs.current = documentSubs.current.filter(d => !d.document.isEqual(sub.document));
            }
        }

        for (const documentSub of documentSubs.current) {
            // Existing subscription found, add callback to the list
            if (documentSub.document.isEqual(document)) {
                documentSub.callbacks.push(callback);

                // Only call the callback, if the snapshot is already available
                // If this condition is not met, means the snapshot is being fetched atm.
                // When it's available, the callback will be called since it's already in the callbacks array
                if (documentSub.lastError !== null || documentSub.lastSnapshot !== null) {
                    callback(documentSub.lastError, documentSub.lastSnapshot || undefined);
                }
                return () => unsub(documentSub);
            }
        }

        // Start new subscription; it's being fetched for the first time
        const newSub: DocumentSub = {
            document,
            callbacks: [ callback ],
            lastError: null,
            lastSnapshot: null,
            unsubscribe: document.onSnapshot((snap) => {
                newSub.lastSnapshot = snap;
                newSub.lastError = null;
                newSub.callbacks.forEach(cb => cb(null, snap));
            }, (err) => {
                newSub.lastError = err;
                newSub.lastSnapshot = null;
                newSub.callbacks.forEach(cb => cb(err));
            })
        };
        documentSubs.current.push(newSub);
        return () => unsub(newSub);
    };

    const subscribeToCollection: IFirestoreContext['subscribeToCollection'] = (collection, callback) => {
        const unsub = (sub: CollectionSub) => {
            // Remove the callback from the list
            sub.callbacks = sub.callbacks.filter(f => f !== callback);

            // If there are no more subscriptions, unsubscribe from the snapshot entirely
            if (sub.callbacks.length === 0) {
                sub.unsubscribe();
                collectionSubs.current = collectionSubs.current.filter(c => !c.collection.isEqual(sub.collection));
            }
        }

        for (const collectionSub of collectionSubs.current) {
            if (collectionSub.collection.isEqual(collection)) {
                collectionSub.callbacks.push(callback);

                // Only call the callback, if the snapshot is already available
                // If this condition is not met, means the snapshot is being fetched atm.
                // When it's available, the callback will be called since it's already in the callbacks array
                if (collectionSub.lastError !== null || collectionSub.lastSnapshot !== null) {
                    callback(collectionSub.lastError, collectionSub.lastSnapshot || undefined);
                }
                return () => unsub(collectionSub);
            }
        }

        const newSub: CollectionSub = {
            collection,
            callbacks: [ callback ],
            lastError: null,
            lastSnapshot: null,
            unsubscribe: collection.onSnapshot((snap) => {
                newSub.lastSnapshot = snap;
                newSub.lastError = null;
                newSub.callbacks.forEach(cb => cb(null, snap));
            }, (err) => {
                newSub.lastError = err;
                newSub.lastSnapshot = null;
                newSub.callbacks.forEach(cb => cb(err));
            })
        };
        collectionSubs.current.push(newSub);
        return () => unsub(newSub);
    };

    return (
        <FirestoreContext.Provider value={{ subscribeToDocument, subscribeToCollection }}>
            {children}
        </FirestoreContext.Provider>
    );
}