import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Circle, Trash2, Calendar, Flag } from 'lucide-react-native';
import { useTodos, Priority } from './contexts/TodosContext';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allTodos, toggleTodo, deleteTodo } = useTodos();

  const todo = allTodos.find(t => t.id === id);

  const [title, setTitle] = useState<string>(todo?.title || '');
  const [priority, setPriority] = useState<Priority>(todo?.priority || 'intermediate');

  if (!todo) {
    return (
      <>
        <Stack.Screen options={{ title: 'Tarefa não encontrada' }} />
        <View style={styles.container}>
          <Text style={styles.errorText}>Tarefa não encontrada</Text>
        </View>
      </>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Excluir Tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteTodo(id);
            router.back();
          },
        },
      ]
    );
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return '#ef4444';
      case 'intermediate':
        return '#eab308';
      case 'not-urgent':
        return '#3b82f6';
    }
  };

  const getPriorityLabel = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'Urgente';
      case 'intermediate':
        return 'Intermediária';
      case 'not-urgent':
        return 'Não urgente';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Detalhes da Tarefa',
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
          <View style={styles.statusCard}>
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => toggleTodo(id)}
            >
              {todo.completed ? (
                <CheckCircle2 size={48} color="#10b981" strokeWidth={2} />
              ) : (
                <Circle size={48} color="#9ca3af" strokeWidth={2} />
              )}
            </TouchableOpacity>
            <Text style={styles.statusText}>
              {todo.completed ? 'Tarefa Concluída' : 'Tarefa Pendente'}
            </Text>
            <Text style={styles.statusSubtext}>
              Toque no ícone para {todo.completed ? 'reabrir' : 'concluir'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Título da tarefa"
                placeholderTextColor="#9ca3af"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Flag size={20} color="#6b7280" />
              <Text style={styles.sectionTitle}>Prioridade</Text>
            </View>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 'urgent' && { backgroundColor: '#ef4444' },
                ]}
                onPress={() => setPriority('urgent')}
                disabled
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === 'urgent' && styles.priorityButtonTextActive,
                  ]}
                >
                  Urgente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 'intermediate' && { backgroundColor: '#eab308' },
                ]}
                onPress={() => setPriority('intermediate')}
                disabled
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === 'intermediate' && styles.priorityButtonTextActive,
                  ]}
                >
                  Intermediária
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === 'not-urgent' && { backgroundColor: '#3b82f6' },
                ]}
                onPress={() => setPriority('not-urgent')}
                disabled
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === 'not-urgent' && styles.priorityButtonTextActive,
                  ]}
                >
                  Não urgente
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#6b7280" />
              <Text style={styles.sectionTitle}>Informações</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Criada em:</Text>
                <Text style={styles.infoValue}>{formatDate(todo.createdAt)}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Prioridade:</Text>
                <View style={styles.priorityBadge}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(todo.priority) }]} />
                  <Text style={[styles.infoValue, { color: getPriorityColor(todo.priority) }]}>
                    {getPriorityLabel(todo.priority)}
                  </Text>
                </View>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[styles.infoValue, { color: todo.completed ? '#10b981' : '#f59e0b' }]}>
                  {todo.completed ? 'Concluída' : 'Pendente'}
                </Text>
              </View>
              {todo.dueDate && (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Data/Hora:</Text>
                    <Text style={styles.infoValue}>{formatDate(todo.dueDate)}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Excluir Tarefa</Text>
          </TouchableOpacity>
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
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statusButton: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 32,
  },
});
