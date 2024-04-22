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
            setError
        );
        return unsub;
    }, [ document?.path ]);

    return { snapshot, data, error };
}

export const useFirestoreCollection = <T extends {}>(collection: FirebaseFirestoreTypes.CollectionReference<T> | null) => {
    const [ snapshot, setSnapshot ] = useState<FirebaseFirestoreTypes.QuerySnapshot<T>>();
    const [ data, setData ] = useState<T[]>();
    const [ error, setError ] = useState<Error>();

    useEffect(() => {
        if (!collection) return;

        const unsub = collection.onSnapshot(
            (snapshot) => {
                setSnapshot(snapshot)
                setData(snapshot.docs.map((doc) => doc.data()))
            },
            setError
        );
        return unsub;
    }, [ collection?.path ]);

    return { snapshot, data, error };
}
