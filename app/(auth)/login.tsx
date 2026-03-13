import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async() => {
        Alert.alert('Test', 'Bouton fonctionne');
    };




    return (
    <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
            style={styles.input}
            placeholder="Courriel"
            placeholderTextColor='#aaa'
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />


        <View style={styles.passwordContainer}>
            <TextInput
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            placeholder="Mot de passe"
            placeholderTextColor='#aaa'
            value={password}
            onChangeText={setPassword}
        />
        <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={"#aaa"}
            onPress={toggleShowPassword}
        />
        </View>
        
        


        

        <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/home")}>
            <Text style={styles.btnText}>
                {loading ? 'Chargement...' : 'Se connecter'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.link}>Pas de compte? S'inscrire</Text>
        </TouchableOpacity>


    </View>
);
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f0f4ff',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width:'100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold', 
        marginBottom: 32,
        color: '#1e1e2e',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    passwordInput: {
        flex: 1,
        padding: 14,
        fontSize: 16,
    },
    btn: {
        width: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#6366f1',
        fontSize: 14,
        marginTop: 8,
    },
    icon: {
        marginLeft: 10,
    }
});