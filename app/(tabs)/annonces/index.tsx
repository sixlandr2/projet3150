import { API } from '@/constants/api';
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Annonce = {
  id: number;
  titre: string;
  adresse: string;
  contenu: string;
  date_publication: string;
  date_expiration: string | null;
  batiment_id: number | null;
  created_by: number | null;
  confirmation_reception: boolean;
  created_at: string;
}

export default function Annonces() {
  const {user} = useAuth();
  const estProprietaire = user?.role === 'proprietaire';
  const [annonces, setAnnonces] = useState<Annonce[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetch(`${API}/api/annonces`)
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(err => console.error(err));
    }, [])
  );

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "Annonces",
        headerLeft: () => null,
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#7C83F5'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />

      <ScrollView style={styles.container}>
        {annonces.map(annonce => (
          <TouchableOpacity 
            key={annonce.id} 
            style={styles.card}
            onPress={() => router.push({
              pathname: '/(tabs)/annonces/detail' as any,
              params: {
                id: annonce.id,
                titre: annonce.titre,
                adresse: annonce.adresse,
                contenu: annonce.contenu,
                date_publication: annonce.date_publication,
                date_expiration: annonce.date_expiration,
                batiment_id: annonce.batiment_id,
              }
            })}
            >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitre}>{annonce.titre}</Text>
              <Text style={styles.cardDate}>{new Date(annonce.date_publication).toLocaleDateString('fr-CA')}</Text>
            </View>
            <Text style={styles.cardHeure}>{annonce.contenu}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {estProprietaire && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/annonces/nouveau')}>
        <MaterialCommunityIcons name='plus' size={30} color={'#fff'}/>
      </TouchableOpacity>
      )}
      

    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 20,
  },
  card: {
    backgroundColor: '#7C83F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cardHeure: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e1e2e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
