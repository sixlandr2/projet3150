import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API = 'http://10.0.0.136:3000';

const adresses = [
    '1234, rue Doe',
    '5678 rue Smith',
    '9999 av. Laval',
];

export default function ModifierAnnonce() {
    const { id, titre: titreParam, contenu: contenuParam, date_publication, date_expiration, confirmation_reception} = useLocalSearchParams<{
        id: string;
        titre: string;
        contenu: string;
        date_publication: string;
        date_expiration: string;
        confirmation_reception: string;
    }>();

    const [titre, setTitre] = useState(titreParam || '');
    const [description, setDescription] = useState(contenuParam || '');
    const [adresse, setAdresse] = useState('');
    const [showAdresses, setShowAdresses] = useState(false);
    const [confirmation, setConfirmation] = useState(confirmation_reception === 'true');
    const [typeDate, setTypeDate] = useState<'date' | 'periode'>(date_expiration ? 'periode' : 'date');
    const [date, setDate] = useState(date_publication ? new Date(date_publication): new Date());
    const [heure, setHeure] = useState(date_publication ? new Date(date_publication): new Date());
    const [heureDebut, setHeureDebut] = useState(date_publication ? new Date(date_publication): new Date());
    const [heureFin, setHeureFin] = useState(date_expiration ? new Date(date_expiration): new Date());
    const [dateDebut, setDateDebut] = useState(date_publication ? new Date(date_publication): new Date());
    const [dateFin, setDateFin] = useState(date_expiration ? new Date(date_expiration): new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showHeurePicker, setShowHeurePicker] = useState(false);
    const [showHeureDebutPicker, setShowHeureDebutPicker] = useState(false);
    const [showHeureFinPicker, setShowHeureFinPicker] = useState(false);
    const [showDebutPicker, setShowDebutPicker] = useState(false);
    const [showFinPicker, setShowFinPicker] = useState(false);

    const peutModifier = titre.trim() && description.trim();

    {/*const API = 'http://10.0.0.213:3000';*/}

    const modifier = async () => {
    try {
        const response = await fetch(`${API}/api/annonces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titre,
            contenu: description,
            date_publication: typeDate === 'date' ? date.toISOString() : dateDebut.toISOString(),
            date_expiration: typeDate === 'periode' ? dateFin.toISOString() : null,
            confirmation_reception: confirmation,
        })
        });
        const data = await response.json();
        console.log('Annonce modifiée:', data);
        router.back();
        router.back();
    } catch (err) {
        console.error(err);
    }
    };

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: "Modifier",
                headerBackVisible:true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5'},
                headerTitleStyle: { fontWeight: 'bold', color: '#1e1e2e', fontSize: 24 },
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
            }} />

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                <Text style={styles.label}>Titre</Text>
                <TextInput
                    style={styles.input}
                    value={titre}
                    onChangeText={setTitre}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Adresse concerné</Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowAdresses(!showAdresses)}
                >
                    <Text style={[styles.dropdownText, !adresse && { color: '#8A8A9A' }]}>{adresse || 'Sélectionner une adresse'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={'#1e1e2e'}/>
                </TouchableOpacity>

                {showAdresses && (
                    <View style={styles.dropdownList}>
                        {adresses.map((a) => (
                            <TouchableOpacity
                                key={a}
                                style={styles.dropdownItem}
                                onPress={() => { setAdresse(a); setShowAdresses(false);}}
                            >
                                <Text style={styles.dropdownItemText}>{a}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setConfirmation(!confirmation)}
                >
                    <View style={[styles.checkbox, confirmation && styles.checkboxChecked]}>
                        {confirmation && <MaterialCommunityIcons name="check" size={14} color='#fff' />}
                    </View>
                    <Text style={styles.checkboxLabel}>Confirmation de réception</Text>
                </TouchableOpacity>

                <View style={styles.radioRow}>
                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setTypeDate('date')}
                    >
                        <View style={[styles.radio, typeDate === 'date' && styles.radioSelected]}/>
                        <Text style={styles.radioLabel}>Date</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => setTypeDate('periode')}
                    >
                        <View style={[styles.radio, typeDate === 'periode' && styles.radioSelected]}/>
                        <Text style={styles.radioLabel}>Période</Text>
                    </TouchableOpacity>
                </View>

                {typeDate === 'date' && (
                    <View style={styles.dateContainer}>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateBtnText}>{date.toLocaleDateString('fr-CA')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowHeurePicker(true)}>
                            <Text style={styles.dateBtnText}>{heure.toLocaleTimeString('fr-CA', {hour: '2-digit', minute: '2-digit'})}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode='date'
                                display='default'
                                locale='fr-CA'
                                onChange={(_, d) => {setShowDatePicker(false); if (d) setDate(d); }}
                            />
                        )}
                        {showHeurePicker && (
                            <DateTimePicker
                                value={heure}
                                mode='time'
                                display='default'
                                locale='fr-CA'
                                onChange={(_, h) => {setShowHeurePicker(false); if (h) setHeure(h); }}
                            />
                        )}
                    </View>
                )}

                {typeDate === 'periode' && (
                    <View style={styles.dateContainer}>
                        <Text style={styles.periodeLabel}>Début</Text>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDebutPicker(true)}>
                            <Text style={styles.dateBtnText}>{dateDebut.toLocaleDateString('fr-CA')}</Text>
                        </TouchableOpacity>
                        {showDebutPicker && (
                            <DateTimePicker
                                value={dateDebut}
                                mode='date'
                                display='default'
                                locale='fr-CA'
                                onChange={(_, d) => {setShowDebutPicker(false); if (d) setDateDebut(d); }}
                            />
                        )}
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowHeureDebutPicker(true)}>
                            <Text style={styles.dateBtnText}>{heureDebut.toLocaleTimeString('fr-CA', {hour: '2-digit', minute: '2-digit'})}</Text>
                        </TouchableOpacity>
                        {showHeureDebutPicker && (
                            <DateTimePicker
                                value={heureDebut}
                                mode='time'
                                display='default'
                                locale='fr-CA'
                                onChange={(_, h) => {setShowHeureDebutPicker(false); if (h) setHeureDebut(h); }}
                            />
                        )}


                        <Text style={styles.periodeLabel}>Fin</Text>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowFinPicker(true)}>
                            <Text style={styles.dateBtnText}>{dateFin.toLocaleDateString('fr-CA')}</Text>
                        </TouchableOpacity>
                        {showFinPicker && (
                            <DateTimePicker
                                value={dateFin}
                                mode='date'
                                display='default'
                                locale='fr-CA'
                                onChange={(_, d) => {setShowFinPicker(false); if (d) setDateFin(d); }}
                            />
                        )}
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowHeureFinPicker(true)}>
                            <Text style={styles.dateBtnText}>{heureFin.toLocaleTimeString('fr-CA', {hour: '2-digit', minute: '2-digit'})}</Text>
                        </TouchableOpacity>
                        {showHeureFinPicker && (
                            <DateTimePicker
                                value={heureFin}
                                mode='time'
                                display='default'
                                locale='fr-CA'
                                onChange={(_, h) => {setShowHeureFinPicker(false); if (h) setHeureFin(h); }}
                            />
                        )}
                    </View>
                )}

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
        backgroundColor: '#f0f4ff',
    },
    dateContainer: {
        gap: 8,
        marginBottom: 24,
    },
    dateBtn: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e1e2e',
        padding: 12,
    },
    dateBtnText: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    periodeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A8A9A',
    },
    content: {
        padding: 24,
        gap: 8,
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
        borderColor: '#1e1e2e',
        padding: 12,
        fontSize: 15,
        color: '#1e1e2e',
        marginBottom: 16,
    },
    inputMultiline: {
        height: 100,
        textAlignVertical: 'top',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e1e2e',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    dropdownText: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e1e2e',
        marginBottom: 16,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f4ff',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        marginTop: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#1e1e2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#1e1e2e',
    },
    checkboxLabel: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioLabel: {
        fontSize: 15,
        color: '#1e1e2e',
    },
    radioRow: {
        flexDirection: 'row',
        gap: 32,
        marginBottom: 32,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#1e1e2e',
    },
    radioSelected: {
        backgroundColor: '#1e1e2e',
    },
    modifierBtn: {
        backgroundColor: '#86efac',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    modifierBtnDisabled: {
        opacity: 0.5,
    },
    modifierBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1e2e',
    },
});