import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings as SettingsIcon, Trash2, LogOut, User, Info, BarChart3 } from 'lucide-react-native';
import { useAuth } from './contexts/AuthContext';
import { useTodos } from './contexts/TodosContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { clearCompleted, stats } = useTodos();

  const handleClearCompleted = () => {
    if (stats.completed === 0) {
      Alert.alert('Nenhuma tarefa', 'Não há tarefas concluídas para limpar.');
      return;
    }

    Alert.alert(
      'Limpar Tarefas Concluídas',
      `Tem certeza que deseja excluir ${stats.completed} ${stats.completed === 1 ? 'tarefa concluída' : 'tarefas concluídas'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            clearCompleted();
            Alert.alert('Sucesso', 'Tarefas concluídas foram removidas.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Configurações',
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
            <SettingsIcon size={48} color="#6366f1" strokeWidth={2} />
            <Text style={styles.headerTitle}>Configurações</Text>
            <Text style={styles.headerSubtitle}>Gerencie suas preferências</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#dbeafe' }]}>
                  <User size={20} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Perfil</Text>
                  <Text style={styles.menuItemSubtitle}>Ver informações da conta</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/statistics')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#f3e8ff' }]}>
                  <BarChart3 size={20} color="#8b5cf6" />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Estatísticas</Text>
                  <Text style={styles.menuItemSubtitle}>Veja seu progresso</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarefas</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleClearCompleted}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
                  <Trash2 size={20} color="#ef4444" />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Limpar Concluídas</Text>
                  <Text style={styles.menuItemSubtitle}>
                    {stats.completed} {stats.completed === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/about')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                  <Info size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Sobre o App</Text>
                  <Text style={styles.menuItemSubtitle}>Versão e informações</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>Logado como</Text>
            <Text style={styles.userInfoEmail}>{user?.email}</Text>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6b7280',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  userInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  userInfoEmail: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
});
