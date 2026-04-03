import { Stack, router, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API = 'http://10.0.0.136:3000';

export default function DetailAnnonce() {
    const { id, titre, contenu, date_publication, date_expiration, batiment_id } = useLocalSearchParams<{
        id: string;
        titre: string;
        contenu: string;
        date_publication: string;
        date_expiration: string;
        batiment_id: string;
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
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    const formatHeure = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString('fr-CA', {
            hour: '2-digit', minute: '2-digit'
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
                headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e', fontSize:24 },
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
                    <Text style={styles.champText}>{batiment_id || '-'}</Text>
                </View>

                <Text style={styles.label}>{date_expiration ? 'Période' : 'Date'}</Text>
                <Text style={styles.dateText}>{formatDate(date_publication)}</Text>
                <Text style={styles.dateText}>{formatHeure(date_publication)}</Text>

                {date_expiration && (
                    <>
                        <Text style={styles.dateText}>→ {formatDate(date_expiration)}</Text>
                        <Text style={styles.dateText}>{formatHeure(date_expiration)}</Text>
                    </>
                )}

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
                                /*confirmation_reception,*/
                            }
                        })}
                        >
                        <Text style={styles.modifierBtnText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.supprimerBtn} onPress={supprimer}>
                        <Text style={styles.supprimerBtnText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
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
        fontWeight: '600',
        color: '#1e1e2e',
        marginTop: 8,
    },
    champ: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 12,
    },
    champMultiline: {
        minHeight: 100,
    },
    champText: {
        fontSize: 15,
        color: '#1e1e2e',
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
        backgroundColor: '#86efac',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    modifierBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1e2e',
    },
    supprimerBtn: {
        backgroundColor: '#f16363',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    supprimerBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});