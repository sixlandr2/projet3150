import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>INes INEEEEEES</Text>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text>Aller vers login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "blue", fontSize: 40, marginBottom: 20,},
});