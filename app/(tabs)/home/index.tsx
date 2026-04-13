import { API } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Batiment = {
  id: number;
  adresse: string;
  ville: string;
  province: string;
  code_postal: string;
};

type Travail = {
  id: number;
  titre: string;
  date_debut: string;
  date_fin: string | null;
  adresse: string;
  batiment_id: number;
};

export default function Home() {
  const {user} = useAuth();
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [travaux, setTravaux] = useState<Travail[]>([]);

  useFocusEffect(
    useCallback(()=> {
      fetch(`${API}/api/batiments?proprietaire_id=${user?.id}`)
        .then(res=>res.json())
        .then(data=>setBatiments(Array.isArray(data)?data: []))
        .catch(err=>console.error(err));
      
      fetch(`${API}/api/travaux?proprietaire_id=${user?.id}`)
        .then(res=>res.json())
        .then(data=> {
          const maintenant= new Date();
          const aVenir = Array.isArray(data)
            ? data
              .filter((t:Travail) => new Date(t.date_debut) >= maintenant)
              .sort((a: Travail, b: Travail) =>
                new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime()
              )
              .slice(0, 5)
            :[];
            setTravaux(aVenir);
        })
        .catch(err => console.error(err));
    }, [])
  );

  const formaterDateRelative = (dateStr: string) => {
    const date = new Date(dateStr);
    const maintenant = new Date();
    const demain = new Date();
    demain.setDate(maintenant.getDate() + 1);

    if (date.toDateString() === maintenant.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === demain.toDateString()) return "Demain";
    return date.toLocaleDateString('fr-CA', {day: '2-digit', month: 'short', timeZone: 'America/Toronto'});
  };

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "RealFlow",
        headerLeft: () => null,
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#7C83F5'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />

      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Adresses</Text>
        <View style={styles.adressesRow}>
          {batiments.slice(0, 4).map(batiment => (
            <TouchableOpacity
              key={batiment.id}
              style={styles.adresseCard}
              onPress={() => router.push({
                pathname: '/(tabs)/settings/batiment' as any,
                params: {
                  id: batiment.id,
                  adresse: batiment.adresse,
                  ville: batiment.ville,
                  province: batiment.province,
                  code_postal: batiment.code_postal
                }
              })}
            >
              <Text style={styles.adresseText}>{batiment.adresse}</Text>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#fff"/>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Travaux à venir</Text>
        {travaux.length === 0?(
          <Text style={styles.vide}>Aucun travail à venir</Text>
        ) : (
          travaux.map(travail => (
            <TouchableOpacity key={travail.id} style={styles.travailCard}>
              <View>
                <Text style={styles.travailDate}>{formaterDateRelative(travail.date_debut)}</Text>
                <Text style={styles.travailNom}>{travail.titre}</Text>
              </View>
            <Text style={styles.travailAdresse}>{travail.adresse}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

    </>
  );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f0f4ff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e1e2e',
        marginBottom: 12,
        marginTop: 8,
    },


    adressesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },

    adresseCard: {
      width: '45%',
      backgroundColor: '#7C83F5',
      borderRadius: 16,
      padding: 16,
      height: 100,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },

    adresseText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,

    },


    travailCard: {
      backgroundColor: '#7C83F5',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    travailDate: {
      color: 'fff',
      fontWeight: 'bold',
      marginBottom: 4,
      fontSize: 16,
    },
    travailNom: {
      color: '#fff',
      fontSize: 14,
    },
    travailAdresse: {
      color: '#fff',
      fontSize: 12,
      opacity: 0.80,
    },
    vide: {
      color: '#8A8A9A',
      fontSize: 14,
      marginBottom: 16,
    }

});