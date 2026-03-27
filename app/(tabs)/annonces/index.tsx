import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const annonces = [
  { id: 1, titre: "Coupure d'eau", date: '10-02-2026', heure: '15h30-16h30' },
];

export default function Annonces() {
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
          <TouchableOpacity key={annonce.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitre}>{annonce.titre}</Text>
              <Text style={styles.cardDate}>{annonce.date}</Text>
            </View>
            <Text style={styles.cardHeure}>{annonce.heure}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/annonces/nouveau')}>
        <MaterialCommunityIcons name='plus' size={30} color={'#fff'}/>
      </TouchableOpacity>

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
