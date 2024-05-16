import { useEffect, useState } from "react";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useFirestore } from "../providers/FirestoreProvider";

export const useFirestoreDocument = <T extends {}>(document: FirebaseFirestoreTypes.DocumentReference<T> | null) => {
    const { subscribeToDocument } = useFirestore();

    const [ snapshot, setSnapshot ] = useState<FirebaseFirestoreTypes.DocumentSnapshot<T>>();
    const [ data, setData ] = useState<T>();
    const [ error, setError ] = useState<Error>();

    useEffect(() => {
        if (!document) return;

        const unsub = subscribeToDocument(document, (err, snapshot) => {
            if (err) {
                console.error(err);
                return setError(err);
            }
            setSnapshot(snapshot);
            setData(snapshot?.data());
        });
        return unsub;
    }, [ document?.path ]);

    return { snapshot, data, error };
}

export type QueryFn<T extends {}> = (ref: FirebaseFirestoreTypes.CollectionReference<T> | FirebaseFirestoreTypes.Query<T>) => typeof ref | null;
export const useFirestoreCollection = <T extends {}>(
    collection: FirebaseFirestoreTypes.CollectionReference<T> | FirebaseFirestoreTypes.Query<T> | null,
    query?: QueryFn<T>
) => {
    const [ currentCollection, setCurrentCollection ] = useState(
        collection ? (query?.(collection) || collection) : collection
    );

    if (currentCollection && (!collection || (query && !query(collection)))) {
        setCurrentCollection(null);
    }
    else if (collection) {
        const ref = query ? query(collection) : collection;
        if (ref && (!currentCollection || !ref.isEqual(currentCollection))) {
            setCurrentCollection(ref);
        }
    }

    const [ snapshot, setSnapshot ] = useState<FirebaseFirestoreTypes.QuerySnapshot<T>>();
    const [ data, setData ] = useState<T[]>();
    const [ error, setError ] = useState<Error>();

    const { subscribeToCollection } = useFirestore();

    useEffect(() => {
        if (!currentCollection) {
            setSnapshot(undefined);
            setData(undefined);
            setError(undefined);
            return;
        };

        const unsub = subscribeToCollection(currentCollection, (err, snapshot) => {
            if (err) {
                console.error(err);
                setSnapshot(snapshot);
                setData(undefined);
                return setError(err);
            }
            setSnapshot(snapshot);
            setData(snapshot?.docs.map((doc) => doc.data()));
        });
        return unsub;
    }, [ currentCollection ]);

    return { snapshot, data, error };
}
