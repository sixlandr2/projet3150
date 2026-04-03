import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Signup() {
    const [role, setRole] = useState<'proprietaire' | 'locataire' | null>(null);
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [accepte, setAccepte] = useState(false);
    const [erreur, setErreur] = useState('');
    const {register} = useAuth();

    const passwordValide = /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
    const peutInscrire = prenom && nom && email && passwordValide && accepte && role;

    const sInscrire = async () => {
        const result = await register(prenom, nom, email, password, role!);
        if (result.error) { setErreur(result.error); return;}
        router.replace('/(tabs)/home')
    };

    if (!role) {
        return (
            <>
                <Stack.Screen options={{
                    headerShown: true,
                    title: "App",
                    headerStyle: { backgroundColor: '#7C83F5'},
                    headerTitleStyle: {fontWeight: 'bold', fontSize: 24},
                    headerShadowVisible: false,
                }}/>
                <View style={styles.roleContainer}>
                    <Text style={styles.roleTitle}>Je suis</Text>
                    <TouchableOpacity style={styles.roleBtn} onPress={() => setRole('proprietaire')}>
                        <Text style={styles.roleBtnText}>Propriétaire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roleBtn} onPress={() => setRole('locataire')}>
                        <Text style={styles.roleBtnText}>Locataire</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    return (
        <>
         <Stack.Screen options={{
            headerShown: true,
            title: "App",
            headerBackTitle: '',
            headerBackVisible:true,
            headerTintColor: '#1e1e2e',
            headerStyle: { backgroundColor: '#7C83F5'},
            headerTitleStyle: {fontWeight: 'bold', fontSize: 24},
            headerShadowVisible: false,
            headerLeft: () => (
                <TouchableOpacity onPress={() => setRole(null)}>
                    <MaterialCommunityIcons name='arrow-left' size={24} color={"#1e1e2e"}/>
                </TouchableOpacity>
            ),
        }} />
        
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput style={styles.input} value={prenom} onChangeText={setPrenom}/>

            <Text style={styles.label}>Nom</Text>
            <TextInput style={styles.input} value={nom} onChangeText={setNom}/>

            <Text style={styles.label}>Courriel</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordRow}>
                <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={22}
                        color='#8A8A9A'
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.requisContainer}>
                <Text style={styles.requisTitre}>Requis:</Text>
                <Text style={[styles.requis, /[A-Z]/.test(password) && styles.requisOk]}>
                    - Une lettre majuscule
                </Text>
                <Text style={[styles.requis, /[a-z]/.test(password) && styles.requisOk]}>
                    - Une lettre minuscule
                </Text>
                <Text style={[styles.requis, /[0-9]/.test(password) && styles.requisOk]}>
                    - Un chiffre
                </Text>
            </View>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAccepte(!accepte)}>
                <View style={[styles.checkbox, accepte && styles.checkboxChecked]}>
                    {accepte && <MaterialCommunityIcons name="check" size={14} color='#fff'/>}
                </View>
                <Text style={styles.checkboxLabel}>
                    En cochant cette case, j'accepte les conditions d'utilisations, ainsi que la politique de confidentialité.
                </Text>
            </TouchableOpacity>

            {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

            <TouchableOpacity
                style={[styles.inscrireBtn, !peutInscrire && styles.inscrireBtnDisabled]}
                disabled={!peutInscrire}
                onPress={sInscrire}
            >
                <Text style={styles.inscrireBtnText}>S'inscrire</Text>
            </TouchableOpacity>

        </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    content: {
        padding: 24,
        gap: 8,
    },
    label: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 8,
        color: '#1e1e2e',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        fontSize: 15,
        color: '#1e1e2e',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        fontSize: 15,
        color: '#1e1e2e',
    },
    requisContainer: {
        gap: 4,
        marginBottom: 16,
    },
    requisTitre: {
        fontSize: 14,
        color: '#7C83F5',
        fontWeight: '600',
    },
    requis: {
        fontSize: 14,
        color: '#7C83F5',
    },
    requisOk: {
        color: '#22c55e',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#1e1e2e',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#1e1e2e',
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        color: '#1e1e2e',
    },
    erreur: {
        color: '#ef4444',
        fontSize: 14,
        marginBottom: 8,
    },
    inscrireBtn: {
        backgroundColor: '#7C83F5',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    inscrireBtnDisabled: {
        opacity: 0.5,
    },
    inscrireBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    roleContainer: {
        flex: 1,
        backgroundColor: '#f0f4ff',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    roleTitle: {
        fontSize: 24,
        color: '#1e1e2e',
        marginBottom: 16,
    },
    roleBtn: {
        backgroundColor: '#7C83F5',
        borderRadius: 12,
        padding: 20,
        width: 200,
        alignItems: 'center',
    },
    roleBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});