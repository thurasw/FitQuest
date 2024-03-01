import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Perform login logic here
        if (username === 'admin' && password === 'password') {
            Alert.alert('Login successful');
        } else {
            Alert.alert('Invalid credentials');
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default Login;