import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const posts = [
  {
    id: '1',
    adresse: '1234 rue Doe',
    titre: 'Serrure de la porte',
    statut: 'Ouvert',
    temps: '5 min',
  },
];

export default function Messages() {

  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState<'Ouvert' | 'Fermé'>('Ouvert');

  const postsFiltres = posts.filter(p => {
    const matchStatut = p.statut === filtre;
    const matchSearch = p.titre.toLowerCase().includes(search.toLowerCase()) || p.adresse.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerShown: true,
        title: "Messages",
        headerLeft: () => null,
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#7C83F5'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />

      <View style={styles.searchRow}>
        <TouchableOpacity
          style={styles.filtreBtn}
          onPress={() => setFiltre(filtre === 'Ouvert' ? 'Fermé' : 'Ouvert')}
        >
          <Text style={styles.filtreBtnText}>
            {filtre}
          </Text>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color={"#8A8A9A"} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor='#8A8A9A'
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={postsFiltres}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.liste}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({
              pathname: '/(tabs)/messages/chat',
              params: {
                titre: item.titre,
                adresse: item.adresse,
                statut: item.statut,
              }
            })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardAdresse}>{item.adresse}</Text>
              <View style={styles.statutBadge}>
                <View style={[
                  styles.statutDot,
                  { backgroundColor: item.statut === 'Ouvert' ? '#22c55e' : '#8A8A9A' }
                ]}/>
                <Text style={[
                  styles.statutText,
                  { color: item.statut === 'Ouvert' ? '#22c55e' : '#8A8A9A' }
                ]}>
                  {item.statut}
                </Text>
              </View>
            </View>
            <Text style={styles.cardTitre}>{item.titre}</Text>
            <Text style={styles.cardTemps}>{item.temps}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color={'#fff'}/>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filtreBtn: {
    backgroundColor: '#1e1e2e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filtreBtnActive: {
    backgroundColor: '#6366f1',
  },
  filtreBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filtreBtnTextActive: {
    color: '#fff',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e1e2e'
  },
  liste: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: '#7C83F5',
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAdresse: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  statutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statutDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statutText: {
    fontWeight: '700',
    fontSize: 14,
  },
  cardTitre: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cardTemps: {
    color: '#000000',
    fontSize: 12,
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
  },
});