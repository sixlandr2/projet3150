import { API } from '@/constants/api';
import { useAuth } from "@/context/AuthContext";
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Logement = {
    id: number;
    numero_unite: string | null;
    etage: number | null;
    locataire_id: number | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
};

export default function DetailBatiment() {
    const {id, adresse, ville, province, code_postal} = useLocalSearchParams();
    const {user} = useAuth();
    const [logements, setLogements] = useState<Logement[]>([]);
    const [erreur, setErreur] = useState('');

    useFocusEffect(
        useCallback(() => {
            fetch(`${API}/api/batiments/${id}/logements`)
                .then(res => res.json())
                .then(data => setLogements(data))
                .catch(err => console.error(err));
        }, [id])
    );

    const supprimerBatiment = () => {
        Alert.alert(
            'Supprimer cette adresse',
            'Êtes-vous sûr ?',
            [
                {text: 'Annuler', style: 'cancel'},
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API}/api/batiments/${id}`, {
                                method: 'DELETE'
                            });
                            const data = await response.json();
                            if (data.error) {setErreur(data.error); return;}
                            router.back();
                        } catch (err) {
                            setErreur('Erreur de connexion')
                        }
                    }
                }
            ]
        );
    };

    const supprimerLogement = (logementId: number) => {
        Alert.alert(
            'Supprimer ce logement',
            'Êtes-vous sûr ?',
            [
                {text: 'Annuler', style: 'cancel'},
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API}/api/batiments/logements/${logementId}`, {
                                method: 'DELETE'
                            });
                            const data = await response.json();
                            if (data.error) {setErreur(data.error); return;}
                            setLogements(prev=> prev.filter(logements => logements.id !== logementId));
                        } catch (err) {
                            setErreur('Erreur de connexion')
                        }
                    }
                }
            ]
        );
    };

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: adresse as string,
                headerBackVisible: true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5' },
                headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }}/>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.sousAdresse}>{ville}, {province}, {code_postal}</Text>
                <Text style={styles.sectionTitre}>Logements</Text>
                {logements.length === 0 ? (
                    <Text style={styles.vide}>Aucun logement ajouté</Text>
                ) : (
                    logements.map(logement => (
                        <View key={logement.id} style={styles.logementCard}>
                            <View style={styles.logementInfo}>
                                <Text style={styles.logementUnite}>
                                    {logement.numero_unite ? `Unité ${logement.numero_unite}` : "Sans numéro d'unité"}
                                </Text>
                                <Text style={styles.logementLocataire}>
                                    {logement.locataire_id
                                        ? `${logement.first_name} ${logement.last_name}`
                                        : 'Vacant'
                                    }
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => supprimerLogement(logement.id)}
                                style={styles.supprimerLogementBtn}
                            >
                                <Text style={styles.supprimerLogementBtnText}>x</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

                <TouchableOpacity
                    style={styles.supprimerBtn}
                    onPress={supprimerBatiment}
                >
                    <Text style={styles.supprimerBtnText}>Supprimer cette adresse</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e2e',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sousAdresse: {
        color: '#8A8A9A',
        fontSize: 14,
        marginBottom: 24,
    },
    sectionTitre: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    vide: {
        color: '#8A8A9A',
        fontSize: 14,
        marginBottom: 16,
    },
    logementCard: {
        backgroundColor: '#2a2a3a',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logementInfo: {
        flex: 1,
    },
    logementUnite: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logementLocataire: {
        color: '#8A8A9A',
        fontSize: 13,
        marginTop: 4,
    },
    supprimerLogementBtn: {
        padding: 6,
    },
    supprimerLogementBtnText: {
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: 'bold',
    },
    erreur: {
        color: '#ff6b6b',
        marginBottom: 12,
    },
    ajouterBtn: {
        backgroundColor: '#7C83F5',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    ajouterBtnText: {
        color: '#1e1e2e',
        fontWeight: 'bold',
        fontSize: 16,
    },
    supprimerBtn: {
        backgroundColor: '#ff6b6b',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    supprimerBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})