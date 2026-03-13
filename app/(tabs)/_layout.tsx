import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return(
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2D5BE3',
            tabBarInactiveTintColor:'#8A8A9A',
            tabBarStyle:{
                backgroundColor: "#fff",
                borderTopColor: "E8E6E0",
                paddingBottom:8,
                height: 60,
            },
        }}>
            <Tabs.Screen
            name='home'
            options={{
                title: 'Acceuil',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name='home' size={24} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='annonces'
            options={{
                title: 'Annonces',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name='bell' size={24} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='calendrier'
            options={{
                title: 'Calendrier',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name='calendar' size={24} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='messages'
            options={{
                title: 'Messages',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name='message' size={24} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name='settings'
            options={{
                title: 'Réglages',
                tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name='cog' size={24} color={color} />
                ),
            }}
            />



        </Tabs>
    );
}