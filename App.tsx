import { AuthProvider } from './src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRouter from './src/routes/MainRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import "./index.css";

LogBox.ignoreAllLogs(true);

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function App() {
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
