import { AuthProvider } from './src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRouter from './src/routes/MainRouter';
import * as SplashScreen from 'expo-splash-screen';
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
