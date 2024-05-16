import { Modal, View, ScrollView, Text, ActivityIndicator, Alert } from "react-native";
import Container from "../../common/Container";
import FQButton from "../../common/FQButton";
import { useEffect, useMemo, useState } from "react";
import { acceptFriend, addFriend, getFriendDocument, removeFriend, useFriends } from "../../../firestore/friends.api";
import { useUser, useUsers } from "../../../firestore/user.api";
import firestore from '@react-native-firebase/firestore';
import { LeaderboardItem } from "./Leaderboards";
import PrimaryGradient from "../../common/PrimaryGradient";
import { useAuth } from "../../../providers/AuthProvider";
import { AvatarImage } from "../avatar/Avatar";
import { get2DAvatarModel } from "../../../api/endpoints.api";

interface LeaderboardsModalProps {
    show: boolean;
    onClose: () => void;
}
type Friend = { id: string; isPending: boolean; accepted: boolean };

export default function LeaderboardsModal({ show, onClose } : LeaderboardsModalProps) {

    const [ selectedTab, setSelectedTab ] = useState<'leaderboard' | 'friends'>('leaderboard');

    const { user } = useAuth();
    const { snapshot: friendsSnapshot, data: friendsData } = useFriends();
    const [ friends, setFriends ] = useState<Friend[]>([]);

    useEffect(() => {
        if (!friendsSnapshot || !show) return;

        const f = friendsSnapshot.docs
        .map(async (d) => ({
            id: d.id,
            ...d.data(),
            isPending: (await getFriendDocument(d.id, user!.uid).get()).data()?.accepted === false
        }));

        Promise.all(f)
        .then(setFriends)
        .catch(console.error);
    }, [ show, friendsData ]);

    return (
        <Modal
            visible={show}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={onClose}
        >
            <Container className='flex flex-col items-stretch py-5'>
                <View className='flex-1 mt-5'>
                    <View className='px-5 flex flex-row gap-3'>
                        <FQButton
                            className={`flex-1 border-2 ${selectedTab === 'leaderboard' ? 'bg-primary-900 border-transparent' : 'border-primary-900 bg-transparent'}`}
                            textProps={{ className: selectedTab === 'leaderboard' ? 'text-white' : 'text-primary-900' }}
                            label='Leaderboard'
                            onPress={() => setSelectedTab('leaderboard')}
                        />
                        <FQButton
                            className={`flex-1 border-2 ${selectedTab === 'friends' ? 'bg-primary-900 border-transparent' : 'border-primary-900 bg-transparent'}`}
                            textProps={{ className: selectedTab === 'friends' ? 'text-white' : 'text-primary-900' }}
                            label='Friends'
                            onPress={() => setSelectedTab('friends')}
                        />
                    </View>

                    <ScrollView>
                        { selectedTab === 'leaderboard' ? <LeaderboardTab friends={friends} /> : <FriendsTab friends={friends} /> }
                    </ScrollView>
                </View>
            </Container>
        </Modal>
    )
}

function LeaderboardTab({ friends }: { friends: Friend[] }) {

    const { user } = useAuth();
    const { data: myUser } = useUser();

    const { snapshot: uData } = useUsers((query) => {
        // You've accepted and they've accepted
        const filtered = friends.filter(f => f.accepted && !f.isPending).map(f => f.id);

        if (filtered.length === 0) return query.where(firestore.FieldPath.documentId(), '==', user!.uid);
        return query.where(
            firestore.Filter.or(
                firestore.Filter(firestore.FieldPath.documentId(), '==', user!.uid),
                firestore.Filter(firestore.FieldPath.documentId(), 'in', filtered)
            )
        );
    });

    const users = uData?.docs.map(u => ({ ...u.data(), id: u.id })) ?? [];

    const handleAdd = () => {
        Alert.prompt(
            'Add Friend',
            "Enter the friend's share code",
            (code) => {
                addFriend(user?.uid!, code)
                .then(() => {
                    Alert.alert('Friend request sent!');
                })
                .catch((err) => {
                    Alert.alert('Error', err.message);
                })
            },
            'plain-text',
        )
    }

    return (
        <View className='p-5 flex flex-col gap-3'>
            { users?.length === 0 && (myUser ? <LeaderboardItem index={1} background='dark' user={myUser} selected /> : <ActivityIndicator /> )}
            {
                users?.map((u, i) => (
                    <LeaderboardItem key={u.facebookId} index={i + 1} user={u} background='dark' selected={u.id === user?.uid} />
                ))
            }
            <FQButton
                className='w-100 mt-5'
                Gradient={PrimaryGradient}
                label='Add Friend'
                textProps={{ className: 'font-semibold text-white' }}
                onPress={handleAdd}
            />
        </View>
    )
}

function FriendsTab({ friends }: { friends: Friend[] }) {

    const { user } = useAuth();

    const { snapshot: userData, data: uData } = useUsers((query) => {
        // You've accepted and they've accepted
        const filtered = friends.filter(f => !f.isPending).map(f => f.id);

        if (filtered.length === 0) return null;
        return query.where(firestore.FieldPath.documentId(), 'in', filtered);
    });
    const users = userData?.docs
        .map((user) => ({
            ...user.data(),
            id: user.id,
            accepted: friends.find(f => f.id === user.id)?.accepted ?? false
        })) ?? [];


    const pendingRequests = friends.filter(f => f.isPending);

    const handleAdd = () => {
        Alert.prompt(
            'Add Friend',
            "Enter the friend's share code",
            (code) => {
                addFriend(user?.uid!, code)
                .then(() => {
                    Alert.alert('Friend request sent!');
                })
                .catch((err) => {
                    Alert.alert('Error', err.message);
                })
            },
            'plain-text',
        )
    };
    const handleRemove = (friendId: string) => {
        Alert.alert(
            'Remove Friend?',
            "Are you sure you want to remove the user as a friend?",
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        removeFriend(user!.uid, friendId);
                    }
                }
            ]
        )
    };
    const handleAccept = (friendId: string) => {
        acceptFriend(user!.uid, friendId);
    };

    return (
        <View className='p-5'>
            <Text className='text-xl font-bold text-primary-900 my-3'>Friends</Text>
            <View className='flex flex-col gap-2'>
                {
                    users.length === 0 ? (
                        <Text className='text-lg mt-3 mb-5 text-center font-semibold'>No friends added!</Text>
                    ) : users.map((user) => (
                        <View key={user.id} className='bg-slate-200 rounded-lg pe-3 flex flex-row items-center flex-nowrap'>
                            <AvatarImage
                                height={60}
                                url={get2DAvatarModel(user.rpm.avatarId!, user.rpm.assets?.updatedAt)}
                                style={{
                                    transform: [{ scale: 1.3 }],
                                    marginBottom: 5
                                }}
                            />
                            <View className='flex flex-col ms-3 flex-shrink'>
                                <Text className='text-lg font-semibold'>{ user.firstName } { user.lastName }</Text>
                                {
                                    user.accepted ? (
                                        <Text>{ user.lifetimePoints } points earned</Text>
                                    ) : (
                                        <Text className='italic'>Pending acceptance</Text>
                                    )
                                }
                            </View>
                            <View className='ms-auto flex flex-row items-center flex-shrink-0'>
                                {
                                    !user.accepted && (
                                        <FQButton
                                            label='Accept'
                                            className='me-5 px-0'
                                            textProps={{ className: 'text-primary-500' }}
                                            onPress={() => handleAccept(user.id)}
                                        />
                                    )
                                }
                                <FQButton
                                    label='Remove'
                                    className='px-0'
                                    textProps={{ className: 'text-red-500' }}
                                    onPress={() => handleRemove(user.id)}
                                />
                            </View>
                        </View>
                    ))
                }
                <FQButton
                    className='w-100 mt-3 mb-5'
                    Gradient={PrimaryGradient}
                    label='Add Friend'
                    textProps={{ className: 'font-semibold text-white' }}
                    onPress={handleAdd}
                />
            </View>
            {
                pendingRequests.length > 0 && (
                    <View className='flex flex-col gap-3'>
                        <Text className='text-xl font-bold text-primary-900 my-3'>Pending requests</Text>
                        {
                            pendingRequests.map((f) => (
                                <View key={f.id} className='bg-slate-200 px-4 py-3 rounded-lg flex flex-row flex-nowrap justify-between items-center'>
                                    <Text className='font-semibold text-ellipsis flex-shrink'>{f.id}</Text>
                                    <FQButton
                                        label='Cancel'
                                        className='px-0'
                                        textProps={{ className: 'text-red-500' }}
                                        onPress={() => handleRemove(f.id)}
                                    />
                                </View>
                            ))
                        }
                    </View>
                )
            }
        </View>
    )
}
