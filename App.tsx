import { AuthProvider } from './src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRouter from './src/routes/MainRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { LogBox } from 'react-native';
import "./index.css";
import { useEffect } from 'react';

LogBox.ignoreAllLogs(true);

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function App() {

	useEffect(() => {
		Notifications.getAllScheduledNotificationsAsync()
		.then((n) => {
			console.log(n[0].trigger);
		})
	}, []);

	return (
		<SafeAreaProvider>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<MainRouter></MainRouter>
				</QueryClientProvider>
			</AuthProvider>
		</SafeAreaProvider>
	);
}
