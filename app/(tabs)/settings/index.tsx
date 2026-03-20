import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function settings() {
    const handleLogout = () => {
        router.replace('/(auth)/login');
    };
  
  
return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "Réglages",
        headerLeft: () => null,
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#7C83F5'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />

       <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={styles.btnText}>Profil</Text>
        </TouchableOpacity>
 

      
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={styles.btnText}>Adresses</Text>
        </TouchableOpacity>
     

     
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={styles.btnText}>Changer mot de passe</Text>
        </TouchableOpacity>
     


      
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>


    </>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        paddingTop: 24,
        backgroundColor: '#f0f4ff',
        gap: 12,
    },
    btn: {
        width: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    logoutBtn:{
        width: '100%',
        backgroundColor: '#f16363ff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 900,
        fontSize: 16,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
