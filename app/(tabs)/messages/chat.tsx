import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = {
    id: string;
    texte: string;
    expediteur: 'locataire' | 'proprietaire';
    heure: string;
};

const messageInitaux: Message[] = [];

const ouvrirMedia = () => {
    Alert.alert(
        'Ajouter une photo',
        '',
        [
            {
                text: 'Prendre une photo',
                onPress: async () => {
                    const { status } = await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Permission refusée', 'Activer la caméra dans les réglages.');
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: 'images',
                        quality: 0.8,
                    });
                    if (!result.canceled) {
                        console.log(result.assets[0].uri);
                    }
                }
            },
            {
                text: 'Choisir de la librairie',
                onPress: async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Permission refusée', 'Activer la librairie dans les réglages.');
                        return;
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: 'images',
                        quality: 0.8,
                    });
                    if (!result.canceled) {
                        console.log(result.assets[0].uri);
                    }
                }
            },
            { text: 'Annuler', style: 'cancel'}
        ]
    );
};

export default function Chat() {
    const insets = useSafeAreaInsets();
    const { titre, adresse, statut } = useLocalSearchParams<{
        titre: string;
        adresse: string;
        statut: string;
    }>();

    const [messages, setMessages] = useState<Message[]>(messageInitaux);
    const [texte, setTexte] = useState('');
    const [statutPost, setStatutPost] = useState(statut || 'Ouvert');

    const envoyerMessage = () => {
        if (!texte.trim()) return;
        const nouveau: Message = {
            id: Date.now().toString(),
            texte: texte.trim(),
            expediteur: 'proprietaire',
            heure: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit'}),
        };
        setMessages(prev => [...prev, nouveau]);
        setTexte('');
    };

    const toggleStatut = () => {
        setStatutPost(s => s === 'Ouvert' ? 'Fermé' : 'Ouvert');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={insets.top + 44}
        >
            <Stack.Screen options={{
                headerShown: true,
                headerBackVisible: true,
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#7C83F5' },
                headerShadowVisible: false,
                headerTintColor: '#1e1e2e',
                headerTitle: () => (
                    <View>
                        <Text style={styles.headerTitre}>{titre}</Text>
                        <Text style={styles.headerAdresse}>{adresse}</Text>
                    </View>
                ),
                headerRight: () => (
                    <View style={{ marginRight: 8}}>
                        <TouchableOpacity onPress={() =>
                            Alert.alert(
                                'Options du post',
                                '',
                                [
                                    {text: statutPost === 'Ouvert' ? 'Fermer le post' : 'Réouvrir le post', onPress: toggleStatut },
                                    {text: 'Supprimer le post', style: 'destructive', onPress: () => console.log('supprimer')},
                                    {text: 'Annuler', style:'cancel'},
                                ]
                            )
                        }>
                            <MaterialCommunityIcons name="dots-vertical" size={22} color={'#1e1e2e'}/>
                        </TouchableOpacity>
                    </View>
                ),
            }}/>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.liste}
                renderItem={({ item }) => (
                    <View style={[
                        styles.bulleWrapper,
                        item.expediteur === 'proprietaire' ? styles.bulleWrapperDroite : styles.bulleWrapperGauche
                    ]}>
                        <View style={[
                            styles.bulle,
                            item.expediteur === 'proprietaire' ? styles.bulleProprio : styles.bulleLocataire
                        ]}>
                            <Text style={[
                                styles.bulleTexte,
                                item.expediteur === 'proprietaire' ? {color: '#fff'} : { color: '#1e1e2e' }
                            ]}>
                                {item.texte}
                            </Text>
                        </View>
                        <Text style={styles.heure}>{item.heure}</Text>
                    </View>
                )}
            />

            <View style={styles.inputRow}>
                <TouchableOpacity onPress={ouvrirMedia}>
                    <MaterialCommunityIcons name='paperclip' size={22} color='#8A8A9A'/>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Tapez votre message ici"
                    placeholderTextColor={'#8A8A9A'}
                    value={texte}
                    onChangeText={setTexte}
                    multiline
                />
                <TouchableOpacity style={styles.sendBtn} onPress={envoyerMessage}>
                    <MaterialCommunityIcons name='send' size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}




const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    headerTitle: {
        alignItems: 'center',
    },
    headerTitre: {
        fontWeight: '700',
        fontSize: 15,
        color: '#1e1e2e',
    },
    headerAdresse: {
        fontSize: 12,
        color: '#1e1e2e',
    },
    statutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 8,
    },
    statutDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statutText: {
        fontWeight: '700',
        fontSize: 13,
    },
    liste: {
        padding: 16,
        gap: 8,
        paddingBottom: 16,
    },
    bulleWrapper: {
        maxWidth: '75%',
        gap: 2,
    },
    bulleWrapperDroite: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    bulleWrapperGauche: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bulle: {
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    bulleProprio: {
        backgroundColor: '#7C83F5',
        borderBottomRightRadius: 4,
    },
    bulleLocataire: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    bulleTexte: {
        fontSize: 16,
    },
    heure: {
        fontSize: 11,
        color: '#8A8A9A',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8E6E0',
    },
    attachBtn: {
        padding: 4,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f4ff',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        fontSize: 16,
        color: '#1e1e2e',
        maxHeight: 100,
    },
    sendBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#7C83F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});