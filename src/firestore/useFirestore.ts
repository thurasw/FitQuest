import { useEffect, useState } from "react";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const useFirestoreDocument = <T extends {}>(document: FirebaseFirestoreTypes.DocumentReference<T> | null) => {
    const [ data, setData ] = useState<T>();
    const [ error, setError ] = useState<Error>();

    useEffect(() => {
        if (!document) return;

        const unsub = document.onSnapshot(
            (doc) => setData(doc.data()),
            setError
        );
        return unsub;
    }, []);

    return { data, error };
}

export const useFirestoreCollection = <T extends {}>(collection: FirebaseFirestoreTypes.CollectionReference<T> | null) => {
    const [ data, setData ] = useState<T[]>();
    const [ error, setError ] = useState<Error>();

    useEffect(() => {
        if (!collection) return;

        const unsub = collection.onSnapshot(
            (snapshot) => setData(snapshot.docs.map((doc) => doc.data())),
            setError
        );
        return unsub;
    }, []);

    return { data, error };
}
