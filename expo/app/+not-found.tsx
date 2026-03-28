import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AlertCircle } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View style={styles.container}>
        <AlertCircle size={64} color="#6366f1" strokeWidth={2} />
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.description}>A página que você procura não existe.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar para o início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1f2937",
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  link: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
});
