import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { CheckSquare, Heart, Code, Sparkles } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sobre',
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700' as const,
          },
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <CheckSquare size={64} color="#6366f1" strokeWidth={2} />
            <Text style={styles.appName}>Todo List App</Text>
            <Text style={styles.version}>Versão 1.0.0</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Sparkles size={24} color="#6366f1" />
              <Text style={styles.cardTitle}>Sobre o App</Text>
            </View>
            <Text style={styles.cardText}>
              Um aplicativo de gerenciamento de tarefas moderno e intuitivo, 
              desenvolvido para ajudar você a organizar suas atividades diárias 
              com eficiência e estilo.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Code size={24} color="#8b5cf6" />
              <Text style={styles.cardTitle}>Recursos</Text>
            </View>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Sistema de prioridades (Urgente, Intermediária, Não urgente)</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Filtros avançados por status e prioridade</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Estatísticas detalhadas de produtividade</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Perfil de usuário personalizado</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Interface moderna e responsiva</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Armazenamento local seguro</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Heart size={24} color="#ef4444" />
              <Text style={styles.cardTitle}>Desenvolvido com</Text>
            </View>
            <View style={styles.techList}>
              <View style={styles.techItem}>
                <Text style={styles.techText}>React Native</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Expo</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>TypeScript</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techText}>Expo Router</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Todo List App
            </Text>
            <Text style={styles.footerSubtext}>
              Feito com ❤️ para produtividade
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#6b7280',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366f1',
    marginTop: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  techItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  techText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6366f1',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
