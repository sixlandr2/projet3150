import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Messages() {
  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "Messages",
        headerLeft: () => null,
        headerBackVisible:false,
        headerStyle: { backgroundColor: '#7C83F5'},
        headerTitleStyle: {fontWeight: 'bold', color: '#1e1e2e'},
        headerShadowVisible: false,
      }} />

      <View>
        <Text>alooo</Text>
      </View>
    </>
  );
};
