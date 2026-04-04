import { useAuth } from "@/context/AuthContext";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API='http://10.0.0.136:3000';

type Batiment = {
    id: number;
    adresse: string;
    ville: string;
    province: string;
    code_postal: string;
    numero_taxe_municipal: string;
    proprietaire_id: number;
};

export default function Adresses() {
    const {user} = useAuth();
    const [batiments, setBatiments] = useState<Batiment[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetch( `${API}/api/batiments?proprietaire_id=${user?.id}`)
                .then(res=>res.json())
                .then(data=>setBatiments(data))
                .catch(err=>console.error(err));
        }, [])
    );

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Adresses',
                headerBackVisible: true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5' },
                headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e', fontSize:24 },
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }}/>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {batiments.map((batiment, index) =>(
                    <View key={batiment.id}>
                        <Text style={styles.adresseLabel}>Adresse {index+1}</Text>
                        <TouchableOpacity
                            style={styles.adresseCard}
                            onPress={() => router.push({
                                pathname: '/(tabs)/settings/batiment' as any,
                                params: {id: batiment.id, adresse: batiment.adresse, ville: batiment.ville, province: batiment.province, code_postal: batiment.code_postal}
                            })}
                        >
                            <Text style={styles.adresseText}>
                                {batiment.adresse}, {batiment.ville}, {batiment.province}, {batiment.code_postal}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.ajouterBtn}
                    onPress={() => router.push('/settings/nouveau_batiment' as any)}
                >
                    <Text style={styles.ajouterBtnText}>Ajouter une adresse</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    content: {
        padding: 24,
        gap: 12,
    },
    adresseLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e2e',
        marginBottom: 4,
    },
    adresseCard: {
        backgroundColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    adresseText: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    ajouterBtn: {
        backgroundColor: '#86efac',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    ajouterBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e1e2e',
    },
});