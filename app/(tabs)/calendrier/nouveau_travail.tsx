import { API } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Batiment = {
    id: number;
    adresse: string;
};

export default function NouveauTravail() {
    const {user} = useAuth();
    const params = useLocalSearchParams();
    const modeEdition = !!params.id;
    const [titre, setTitre] = useState(params.titre as string || '');
    const [entrepreneur, setEntrepreneur] = useState(params.entrepreneur as string || '');
    const [description, setDescription] = useState(params.description as string || '');
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const [batimentChoisi, setBatimentChoisi] = useState<Batiment | null>(
        params.adresse && params.batiment_id
            ? {id: Number(params.batiment_id), adresse: params.adresse as string}
            : null
    );
    const [showBatiments, setShowBatiments] = useState(false);
    const [typeDate, setTypeDate] = useState<'date' | 'periode'>(params.date_fin?'periode':'date');
    const toLocalISOString = (date: Date) =>{
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
    };
    const [dateDebut, setDateDebut] = useState(
        params.date_debut?new Date(params.date_debut as string):new Date()
    );
    const [dateFin, setDateFin] = useState(
        params.date_fin?new Date(params.date_fin as string):new Date()
    );
    const [showPickerDebut, setShowPickerDebut] = useState(false);
    const [showPickerFin, setShowPickerFin] = useState(false);
    const [erreur, setErreur] = useState('');

    const peutPublier = titre.trim() && batimentChoisi;

    useEffect(() => {
        fetch(`${API}/api/batiments?proprietaire_id=${user?.id}`)
            .then(res=>res.json())
            .then(data=>setBatiments(data))
            .catch(err=>console.error(err));
    }, []);

    const publier = async() =>{
        try {
            const url = modeEdition
                ? `${API}/api/travaux/${params.id}`
                : `${API}/api/travaux`;
            const method = modeEdition ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    titre,
                    entrepreneur: entrepreneur || null,
                    description: description || null,
                    batiment_id: batimentChoisi?.id,
                    date_debut: toLocalISOString(dateDebut),
                    date_fin: typeDate === 'periode'? toLocalISOString(dateFin):null,
                    created_by: user?.id,
                }),
            });
            const data = await response.json();
            if (data.error) {setErreur(data.error); return;}
            router.back();
        } catch(err){
            setErreur('Erreur de connexion au serveur');
        }
    };

    const formaterDate=(date:Date) =>
        date.toLocaleDateString('fr-CA', {
            day: '2-digit', month: '2-digit', year: 'numeric', timeZone:'America/Toronto'
        });

    const formaterHeure=(date:Date) =>
        date.toLocaleTimeString('fr-CA', {
            hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto'
        });

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: modeEdition? 'Modifier travail': 'Nouvelle travail',
                headerBackVisible: true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: modeEdition? '#7C83F5':'#7C83F5' },
                headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }}/>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.label}>Titre</Text>
                <TextInput
                    style={styles.input}
                    value={titre}
                    onChangeText={setTitre}
                    placeholder="Ex: Réparation robinet"
                    placeholderTextColor='#8A8A9A'
                />

                <Text style={styles.label}>Entrepreneur en charge <Text style={styles.optionnel}>(optionnel)</Text></Text>
                <TextInput
                    style={styles.input}
                    value={entrepreneur}
                    onChangeText={setEntrepreneur}
                    placeholder="Ex: Contruction ABC"
                    placeholderTextColor='#8A8A9A'
                />

                <Text style={styles.label}>Description<Text style={styles.optionnel}>(optionnel)</Text></Text>
                <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Ex: Décrivez les travaux..."
                    placeholderTextColor='#8A8A9A'
                    multiline
                    numberOfLines={3}
                />
                <Text style={styles.label}>Adresse concernée</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={()=>setShowBatiments(!showBatiments)}
                >
                    <Text style={batimentChoisi ? styles.inputText:styles.inputPlaceholder}>
                        {batimentChoisi ? batimentChoisi.adresse:'Sélectionner une adresse'}
                    </Text>
                </TouchableOpacity>

                {showBatiments && (
                    <View style={styles.dropdown}>
                        {batiments.map(b => (
                            <TouchableOpacity
                                key={b.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setBatimentChoisi(b);
                                    setShowBatiments(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{b.adresse}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={styles.toggleOption}
                        onPress={()=>setTypeDate('date')}
                    >
                        <View style={styles.radioOuter}>
                            {typeDate === 'date' && <View style={styles.radioInner}/>}
                        </View>
                        <Text style={styles.toggleText}>Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.toggleOption}
                        onPress={()=> setTypeDate('periode')}
                    >
                        <View style={styles.radioOuter}>
                            {typeDate === 'periode' && <View style={styles.radioInner}/>}
                        </View>
                        <Text style={styles.toggleText}>Période</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateRow}>
                    <View style={styles.dateCol}>
                        <Text style={styles.dateLabel}>{typeDate==='periode'?'Début':'Date'}</Text>
                        <TouchableOpacity onPress={() => setShowPickerDebut(!showPickerDebut)}>
                            <Text style={styles.dateValue}>{formaterDate(dateDebut)}</Text>
                            <Text style={styles.dateValue}>{formaterHeure(dateDebut)}</Text>
                        </TouchableOpacity>
                    </View>

                    {typeDate === 'periode' && (
                        <View style={styles.dateCol}>
                            <Text style={styles.dateLabel}>Fin</Text>
                            <TouchableOpacity onPress={() => setShowPickerFin(!showPickerFin)}>
                                <Text style={styles.dateValue}>{formaterDate(dateFin)}</Text>
                                <Text style={styles.dateValue}>{formaterHeure(dateFin)}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {showPickerDebut && (
                        <DateTimePicker
                            value={dateDebut}
                            mode='datetime'
                            display={"spinner"}
                            onChange={(event, date) => {
                                if (date) setDateDebut(date);}}
                            locale="fr-CA"
                        />
                )}
                {showPickerFin && typeDate === 'periode' && (
                    
                        <DateTimePicker
                            value={dateFin}
                            mode='datetime'
                            display={"spinner"}
                            onChange={(event, date) => {
                                if (date) setDateFin(date);}}
                            locale="fr-CA"
                            minimumDate={dateDebut}
                        />
                )}

                {erreur?<Text style={styles.erreur}>{erreur}</Text>: null}

                <TouchableOpacity
                    style={[styles.publierBtn, !peutPublier && styles.publierBtnDisabled, modeEdition && styles.modifierBtn]}
                    disabled={!peutPublier}
                    onPress={publier}
                >
                    <Text style={styles.publierBtnText}>{modeEdition?'Modifier': 'Publier'}</Text>
                </TouchableOpacity>
                {modeEdition && (
                    <TouchableOpacity
                        style={styles.supprimerBtn}
                        onPress={()=> {
                            Alert.alert(
                                'Supprimer ce travail',
                                'Êtes-vous sûr ? Cette action est irréversible.',
                                [
                                    {text: 'Annuler', style:'cancel'},
                                    {
                                        text:'Supprimer',
                                        style:'destructive',
                                        onPress:async()=> {
                                            await fetch(`${API}/api/travaux/${params.id}`, {method: 'DELETE'});
                                            router.back();
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <Text style={styles.supprimerBtnText}>Supprimer ce travail</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#1e1e2e',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    label:{
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 14,
    },
    optionnel: {
        color: '#8A8A9A',
        fontWeight: 'normal',
        fontSize: 13,
    },
    input:{
        backgroundColor: '#2a2a3e',
        borderRadius: 10,
        padding: 14,
        color: '#ffffff',
        fontSize: 15,
    },
    inputText: {
        color: '#ffffff',
        fontSize: 15,
    },
    inputPlaceholder: {
        color: '#8A8A9A',
        fontSize: 15,
    },
    inputMultiline: {
        height: 90,
        textAlignVertical: 'top',
    },
    dropdown: {
        backgroundColor: '#2a2a3e',
        borderRadius: 10,
        marginTop: 4,
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a4e',
    },
    dropdownText: {
        color: '#ffffff',
        fontSize: 15,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 18,
        marginBottom: 12,
    },
    toggleOption:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#7C83F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#7C83F5',
    },
    toggleText: {
        color: '#ffffff',
        fontSize: 15,
    },
    dateRow:{
        flexDirection:'row',
        gap: 24,
        marginBottom: 12,
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
    erreur: {
        color: '#ff6b6b',
        marginTop: 10,
    },
    publierBtn: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    modifierBtn: {
        backgroundColor: '#F5C542',
    },
    publierBtnDisabled: {
        backgroundColor: '#3a3a4e',
    },
    publierBtnText: {
        color: '#ffffff',
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
        fontSize: 15,
    },
});