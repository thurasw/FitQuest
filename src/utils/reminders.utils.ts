import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

export const registerRemindersAsync = async (
    daysToRemind: number[],
    hours: number,
    minutes: number
) => {
    if (daysToRemind.length === 0) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
    }

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: false
        });
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    await Notifications.cancelAllScheduledNotificationsAsync();

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Schedule for 2 weeks
    for (let i = 0; i < 14; i++) {
        if (daysToRemind.includes(date.getDay())) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to workout!",
                    body: "Don't forget to log your workout today! 💪🏋️‍♂️",
                    sound: true
                },
                trigger: {
                    date: date
                }
            });
        }
        date.setDate(date.getDate() + 1);
    }
}