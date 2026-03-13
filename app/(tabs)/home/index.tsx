import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "RealFlow",
        headerLeft: () => null,
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#f0f4ff'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />

      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Adresses</Text>
        <View style={styles.adressesRow}>
          <TouchableOpacity style={styles.adresseCard}>
            <Text style={styles.adresseText}>1234 rue Doe</Text>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#1e1e2e"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.adresseCard}>
            <Text style={styles.adresseText}>5678 rue Doe</Text>
            <MaterialCommunityIcons name="bell-outline" size={16} color="#1e1e2e"/>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Travaux</Text>
        
        <TouchableOpacity style={styles.travailCard}>
          <View>
            <Text style={styles.travailDate}>Demain</Text>
            <Text style={styles.travailNom}>Réparation serrure</Text>
          </View>
          <Text style={styles.travailAdresse}>1234 rue Doe</Text>
        </TouchableOpacity>
        

      </ScrollView>

    </>
  );
};




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
      gap: 20,
    },

    adresseCard: {
      flex: 1,
      backgroundColor: '#7C83F5',
      borderRadius: 16,
      padding: 16,
      height: 100,
      justifyContent: 'space-between',
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


});