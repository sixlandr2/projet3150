import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const {login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erreur, setErreur] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async() => {
        if (!email || !password) {
            setErreur('Veuillez entrer votre courriel et mot de passe');
            return;
        }
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.error) {
            setErreur(result.error);
            return;
        }
        router.replace('/(tabs)/home');
    };




    return (
    <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        <Text style={styles.label}>Courriel</Text>
        <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder='votre@courriel.com'
            placeholderTextColor='#8A8A9A'
        />

        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.passwordRow}>
            <TextInput
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            autoCapitalize='none'
            value={password}
            onChangeText={setPassword}
            />
            <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color={"#8A8A9A"}
                />
            </TouchableOpacity>
        </View>
        
        {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}


        

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
            <Text style={styles.btnText}>
                {loading ? 'Connexion...' : 'Se connecter'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.inscriptionText}>Pas de compte? S'inscrire</Text>
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
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
        paddingHorizontal: 12,
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
    inscriptionText: {
        color: '#6366f1',
        fontSize: 14,
        marginTop: 8,
    },
    icon: {
        marginLeft: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color:'#1e1e2e',
        marginBottom: 4,
    },
    erreur: {
        color: '#ef4444',
        fontSize: 14,
        marginBottom: 12,
    }
});