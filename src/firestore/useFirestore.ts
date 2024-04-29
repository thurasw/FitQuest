import { useEffect, useState } from "react";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const useFirestoreDocument = <T extends {}>(document: FirebaseFirestoreTypes.DocumentReference<T> | null) => {
    const [ snapshot, setSnapshot ] = useState<FirebaseFirestoreTypes.DocumentSnapshot<T>>();
    const [ data, setData ] = useState<T>();
    const [ error, setError ] = useState<Error>();

    useEffect(() => {
        if (!document) return;

        const unsub = document.onSnapshot(
            (doc) => {
                setSnapshot(doc);
                setData(doc.data())
            },
            (err) => {
                setError(err);
                console.error(err);
            }
        );
        return unsub;
    }, [ document?.path ]);

    return { snapshot, data, error };
}

export type QueryFn<T extends {}> = (ref: FirebaseFirestoreTypes.CollectionReference<T> | FirebaseFirestoreTypes.Query<T>) => typeof ref;
export const useFirestoreCollection = <T extends {}>(
    collection: FirebaseFirestoreTypes.CollectionReference<T> | FirebaseFirestoreTypes.Query<T> | null,
    query?: QueryFn<T>
) => {
    const [ currentCollection, setCurrentCollection ] = useState(
        query ? collection ? query(collection) : collection : collection
    );

    if (collection) {
        const ref = query ? query(collection) : collection;
        if (!currentCollection || !ref.isEqual(currentCollection)) {
            setCurrentCollection(ref);
        }
    }

    const [ snapshot, setSnapshot ] = useState<FirebaseFirestoreTypes.QuerySnapshot<T>>();
    const [ data, setData ] = useState<T[]>();
    const [ error, setError ] = useState<Error>();

    useEffect(() => {
        if (!currentCollection) return;

        const unsub = currentCollection.onSnapshot(
            (snapshot) => {
                setSnapshot(snapshot)
                setData(snapshot.docs.map((doc) => doc.data()))
            },
            (err) => {
                setError(err);
                console.error(err);
            }
        );
        return unsub;
    }, [ currentCollection ]);

    return { snapshot, data, error };
}
