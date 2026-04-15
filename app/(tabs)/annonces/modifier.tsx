import { API } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Batiment = {
    id: number;
    adresse: string;
};

export default function ModifierAnnonce() {
    const {user} = useAuth();
    const { id, titre: titreParam, contenu: contenuParam, date_publication, date_expiration, batiment_id, adresse: adresseParam, confirmation_reception} = useLocalSearchParams<{
        id: string;
        titre: string;
        contenu: string;
        date_publication: string;
        date_expiration: string;
        batiment_id: string;
        adresse: string;
        confirmation_reception: string;
    }>();

    const [titre, setTitre] = useState(titreParam || '');
    const [description, setDescription] = useState(contenuParam || '');
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const [batimentChoisi, setBatimentChoisi] = useState<Batiment | null>(
        adresseParam && batiment_id
            ? {id: Number(batiment_id), adresse:adresseParam}
            : null
    );
    const [showBatiments, setShowBatiments] = useState(false);
    const [confirmation, setConfirmation] = useState(confirmation_reception==='true');
    const [typeDate, setTypeDate] = useState<'date' | 'periode'>(date_expiration? 'periode':'date');
    const [dateDebut, setDateDebut] = useState(date_publication?new Date(date_publication):new Date());
    const [dateFin, setDateFin] = useState(date_expiration?new Date(date_expiration):new Date());
    const [showPickerDebut, setShowPickerDebut] = useState(false);
    const [showPickerFin, setShowPickerFin] = useState(false);
    const [erreur, setErreur] = useState('');

    const peutModifier = titre.trim() && description.trim() && batimentChoisi;

    const toLocalISOString = (date: Date) =>{
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
    };

    useEffect(() => {
        fetch(`${API}/api/batiments?proprietaire_id=${user?.id}`)
            .then(res=>res.json())
            .then(data=>setBatiments(data))
            .catch(err=>console.error(err));
    }, []);

    const modifier = async () => {
    try {
        const response = await fetch(`${API}/api/annonces/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titre,
                contenu: description,
                adresse: batimentChoisi?.adresse,
                batiment_id: batimentChoisi?.id,
                date_publication: toLocalISOString(dateDebut),
                date_expiration: typeDate === 'periode' ?toLocalISOString(dateFin) : null,
                confirmation_reception: confirmation,
            })
        });
        const data = await response.json();
        if (data.error) {setErreur(data.error); return;}
        router.back();
        router.back();
    } catch (err) {
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
                title: "Modifier annonce",
                headerBackVisible:true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5'},
                headerTitleStyle: { fontWeight: 'bold', color: '#1e1e2e' },
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }} />

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                <Text style={styles.label}>Titre</Text>
                <TextInput
                    style={styles.input}
                    value={titre}
                    onChangeText={setTitre}
                    placeholderTextColor='#8A8A9A'
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor='#8A8A9A'
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Adresse concerné</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowBatiments(!showBatiments)}
                >
                    <Text style={batimentChoisi?styles.inputText : styles.inputPlaceholder}>
                        {batimentChoisi?batimentChoisi.adresse: 'Sélectionner une adresse'}
                    </Text>
                </TouchableOpacity>

                {showBatiments && (
                    <View style={styles.dropdown}>
                        {batiments.map(b => (
                            <TouchableOpacity
                                key={b.id}
                                style={styles.dropdownItem}
                                onPress={() => { setBatimentChoisi(b); setShowBatiments(false);}}
                            >
                                <Text style={styles.dropdownText}>{b.adresse}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setConfirmation(!confirmation)}
                >
                    <View style={[styles.checkbox, confirmation && styles.checkboxChecked]}>
                        {confirmation && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Confirmation de réception</Text>
                </TouchableOpacity>

                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={styles.toggleOption}
                        onPress={() => setTypeDate('date')}
                    >
                        <View style={styles.radioOuter}>
                            {typeDate === 'date' && <View style={styles.radioInner}/>}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toggleOption}
                        onPress={() => setTypeDate('periode')}
                    >
                        <View style={styles.radioOuter}>
                            {typeDate === 'periode' && <View style={styles.radioInner}/>}
                        </View>
                        <Text style={styles.toggleText}>Période</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateRow}>
                    <View style={styles.dateCol}>
                        <Text style={styles.dateLabel}>{typeDate=== 'periode'?'Début': 'Date'}</Text>
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
                        display={Platform.OS==='ios'?"spinner":'default'}
                        onChange={(event, date) => {
                            if (date) setDateDebut(date);}}
                        locale="fr-CA"
                    />
                )}
                {showPickerFin && typeDate === 'periode' && (
                    <DateTimePicker
                        value={dateFin}
                        mode='datetime'
                        display={Platform.OS==='ios'?"spinner":'default'}
                        onChange={(event, date) => {
                            if (date) setDateFin(date);}}
                        locale="fr-CA"
                        minimumDate={dateDebut}
                    />
                )}

                {erreur ? <Text style={styles.erreur}>{erreur}</Text>: null}


                <TouchableOpacity
                    style={[styles.modifierBtn, !peutModifier && styles.modifierBtnDisabled]}
                    disabled={!peutModifier}
                    onPress={modifier}
                >
                    <Text style={styles.modifierBtnText}>Modifier</Text>
                </TouchableOpacity>

            </ScrollView>
        </>
    );

}


const styles = StyleSheet.create({
    container : { 
        flex: 1,
        backgroundColor: '#1e1e2e',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 6,
        marginTop: 14,
    },
    input: {
        backgroundColor: '#2a2a3e',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        color: '#ffffff',
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
        height: 100,
        textAlignVertical: 'top',
    },
    dropdown: {
        backgroundColor: '#2a2a3e',
        borderRadius: 10,
        marginTop:4,
    },
    dropdownText: {
        fontSize: 15,
        color: '#ffffff',
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a4e',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#7C83F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#7C83F5',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e1e2e',
        marginBottom: 16,
        overflow: 'hidden',
    },
    downItemText: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    checkboxLabel: {
        fontSize: 15,
        color: '#ffffff',
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
    dateCol:{
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
    modifierBtn: {
        backgroundColor: '#F5C542',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    modifierBtnDisabled: {
        backgroundColor: '#3a3a4e',
    },
    modifierBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e1e2e',
    },
});