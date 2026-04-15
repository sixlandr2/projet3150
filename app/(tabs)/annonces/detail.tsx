import { API } from '@/constants/api';
import { useAuth } from "@/context/AuthContext";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function DetailAnnonce() {
    const {user} = useAuth();
    const estProprietaire = user?.role==='proprietaire';
    const { id, titre, contenu, date_publication, date_expiration, batiment_id, adresse } = useLocalSearchParams<{
        id: string;
        titre: string;
        contenu: string;
        date_publication: string;
        date_expiration: string;
        batiment_id: string;
        adresse: string;
    }>();

    const supprimer = () => {
        Alert.alert(
            'Supprimer',
            'Voulez-vous vraiment supprimer cette annonce ?',
            [
                {text: 'Annuler', style: 'cancel'},
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        await fetch(`${API}/api/annonces/${id}`, { method: 'DELETE' });
                        router.back();
                    }
                }
            ]
        );
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('fr-CA', {
            year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Toronto'
        });
    };

    const formatHeure = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString('fr-CA', {
            hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto'
        });
    };

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Annonces',
                headerBackVisible: true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5' },
                headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }}/>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.label}>Titre</Text>
                <View style={styles.champ}>
                    <Text style={styles.champText}>{titre}</Text>
                </View>

                <Text style={styles.label}>Description</Text>
                <View style={[styles.champ, styles.champMultiline]}>
                    <Text style={styles.champText}>{contenu}</Text>
                </View>

                <Text style={styles.label}>Adresse concerné</Text>
                <View style={styles.champ}>
                    <Text style={styles.champText}>{adresse || '-'}</Text>
                </View>

                <Text style={styles.label}>{date_expiration ? 'Période' : 'Date'}</Text>
                <View style={styles.dateRow}>
                    <View style={styles.dateCol}>
                        <Text style={styles.dateLabel}>{date_expiration?'Début':'Date'}</Text>
                        <Text style={styles.dateValue}>{formatDate(date_publication)}</Text>
                        <Text style={styles.dateValue}>{formatHeure(date_publication)}</Text>
                    </View>
                     {date_expiration && (
                        <View style={styles.dateCol}>
                            <Text style={styles.dateLabel}>Fin</Text>
                            <Text style={styles.dateValue}>→ {formatDate(date_expiration)}</Text>
                            <Text style={styles.dateValue}>{formatHeure(date_expiration)}</Text>
                        </View>
                    )}
                </View>

                {estProprietaire &&(
                    <View style={styles.btns}>
                        <TouchableOpacity 
                            style={styles.modifierBtn}
                            onPress={() => router.push({
                                pathname: '/(tabs)/annonces/modifier' as any,
                                params: {
                                    id,
                                    titre,
                                    contenu,
                                    date_publication,
                                    date_expiration,
                                    batiment_id,
                                    adresse,
                                }
                            })}
                        >
                            <Text style={styles.modifierBtnText}>Modifier</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={styles.supprimerBtn} onPress={supprimer}>
                            <Text style={styles.supprimerBtnText}>Supprimer</Text>
                        </TouchableOpacity>
                    
                    </View>
                )}
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
    dateRow: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 8,
    },
    dateCol: {
        flex: 1,
    },
    dateLabel: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    dateValue: {
        color: '#7C83F5',
        fontSize: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
        marginTop: 14,
        marginBottom: 6,
    },
    champ: {
        backgroundColor: '#2a2a3e',
        borderRadius: 10,
        padding: 14,
    },
    champMultiline: {
        minHeight: 100,
    },
    champText: {
        fontSize: 15,
        color: '#ffffff',
    },
    dateText: {
        fontSize: 16,
        color: '#1e1e2e',
    },
    btns: {
        gap: 12,
        marginTop: 24,
    },
    modifierBtn: {
        backgroundColor: '#F5C542',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    modifierBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e1e2e',
    },
    supprimerBtn: {
        backgroundColor: '#ff6b6b',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    supprimerBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});