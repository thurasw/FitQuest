import { AuthProvider } from './src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRouter from './src/routes/MainRouter';
import * as SplashScreen from 'expo-splash-screen';
import "./index.css";

SplashScreen.preventAutoHideAsync();

export default function App() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<MainRouter></MainRouter>
			</AuthProvider>
		</SafeAreaProvider>
	);
}
