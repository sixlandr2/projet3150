import { useAuth } from "@/context/AuthContext";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function settings() {
    const {user, logout} = useAuth();
    const handleLogout = () => {
        logout();
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
        <View style={styles.profil}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.first_name?.charAt(0).toUpperCase() || '?'}</Text>
            </View>
            <Text style={styles.username}>{user?.first_name} {user?.last_name}</Text>
            {/*<Text style={styles.email}>luis@email.com</Text>*/}
        </View>

        <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Profil</Text>
        </TouchableOpacity>
 

      
        <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Adresses</Text>
        </TouchableOpacity>
     
        <View style={styles.separateur}/>
     
        <TouchableOpacity style={[styles.btn, { marginTop: 'auto'}]}>
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
        justifyContent: 'flex-start',
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
    profil: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 8,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#7C83F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e1e2e',
    },
    email: {
        fontSize: 14,
        color: '#8A8A9A',
    },
    separateur: {
        height: 48,
    },
});
