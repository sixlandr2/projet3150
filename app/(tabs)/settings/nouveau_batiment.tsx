import { useAuth } from "@/context/AuthContext";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

const API='http://10.0.0.136:3000';

export default function NouveauBatiment() {
    const {user} = useAuth();
    const [adresse, setAdresse] = useState('');
    const [ville, setVille] = useState('Montréal');
    const [province, setProvince] = useState('QC');
    const [codePostal, setCodePostal] = useState('');
    const [numeroTaxe, setNumeroTaxe] = useState('');
    const [erreur, setErreur] = useState('');
    const peutAjouter = adresse.trim() && codePostal.trim();

    const ajouter = async() => {
        try {
            const response = await fetch(`${API}/api/batiments`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    adresse,
                    ville,
                    province,
                    code_postal: codePostal,
                    numero_taxe_municipale: numeroTaxe,
                    proprietaire_id: user?.id,
                })
            });
            const data = await response.json();
            if (data.error) {setErreur(data.error); return;}
            router.back();
        } catch (err) {
            setErreur('Erreur de connexion au serveur');
        }
    };

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Nouvelle adresse',
                headerBackVisible: true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5' },
                headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }}/>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.label}>Adresse</Text>
                <TextInput
                    style={styles.input}
                    value={adresse}
                    onChangeText={setAdresse}
                    placeholder="1234 rue Exemple"
                    placeholderTextColor='#8A8A9A'
                />

                <Text style={styles.label}>Ville</Text>
                <TextInput
                    style={styles.input}
                    value={ville}
                    onChangeText={setVille}
                />

                <Text style={styles.label}>Province</Text>
                <TextInput
                    style={styles.input}
                    value={province}
                    onChangeText={setProvince}
                />

                <Text style={styles.label}>Code postal</Text>
                <TextInput
                    style={styles.input}
                    value={codePostal}
                    onChangeText={setCodePostal}
                    placeholder="H1W 2R4"
                    placeholderTextColor='#8A8A9A'
                    autoCapitalize="characters"
                />

                <Text style={styles.label}>Numéro de compte de taxe municipale</Text>
                <TextInput
                    style={styles.input}
                    value={numeroTaxe}
                    onChangeText={setNumeroTaxe}
                    placeholder="123456-00"
                    placeholderTextColor='#8A8A9A'
                />
                {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

                <TouchableOpacity
                    style={[styles.ajouterBtn, !peutAjouter && styles.ajouterBtnDisabled]}
                    disabled={!peutAjouter}
                    onPress={ajouter}
                >
                    <Text style={styles.ajouterBtnText}>Ajouter</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff'
    },
    content: {
        padding: 24,
        gap: 8
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e1e2e',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 12,
        fontSize: 15,
        color: '#1e1e2e',
        marginBottom: 12,
    },
    erreur: {
        color: '#ef4444',
        fontSize: 14,
    },
    ajouterBtn: {
        backgroundColor: '#86efac',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    ajouterBtnDisabled: {
        opacity: 0.5
    },
    ajouterBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1e2e',
    },
});