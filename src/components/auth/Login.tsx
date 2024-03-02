import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import Container from '../common/Container';

export default function Login() {
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
        <Container>
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
        </Container>
    );
};

const styles = StyleSheet.create({
    
});
