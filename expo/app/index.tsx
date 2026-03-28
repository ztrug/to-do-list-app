import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Filter,
  ListTodo,
  UserCircle,
  Settings,
  BarChart3,
  Calendar,
} from 'lucide-react-native';
import { useAuth } from './contexts/AuthContext';
import { useTodos, FilterType, Priority, PriorityFilter } from './contexts/TodosContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { todos, addTodo, toggleTodo, deleteTodo, filter, setFilter, priorityFilter, setPriorityFilter, stats } = useTodos();
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('intermediate');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState<boolean>(false);

  const handleAddTodo = useCallback(() => {
    if (inputValue.trim()) {
      let dueDate: number | undefined = undefined;

      if (selectedDate && selectedTime) {
        const combinedDate = new Date(selectedDate);
        combinedDate.setHours(selectedTime.getHours());
        combinedDate.setMinutes(selectedTime.getMinutes());
        dueDate = combinedDate.getTime();
      }

      addTodo(inputValue.trim(), selectedPriority, dueDate);
      setInputValue('');
      setSelectedPriority('intermediate');
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  }, [inputValue, selectedPriority, selectedDate, selectedTime, addTodo]);

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const clearDateTime = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'intermediate':
        return '#eab308';
      case 'not-urgent':
        return '#3b82f6';
    }
  };

  const renderTodoItem = ({ item }: { item: { id: string; title: string; completed: boolean; priority: Priority } }) => {
    return (
      <TouchableOpacity
        style={styles.todoItem}
        onPress={() => router.push(`/task-details?id=${item.id}`)}
        testID={`todo-item-${item.id}`}
      >
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
        <TouchableOpacity
          style={styles.todoContent}
          onPress={(e) => {
            e.stopPropagation();
            toggleTodo(item.id);
          }}
        >
          {item.completed ? (
            <CheckCircle2 size={24} color="#10b981" strokeWidth={2} />
          ) : (
            <Circle size={24} color="#9ca3af" strokeWidth={2} />
          )}
          <Text
            style={[
              styles.todoText,
              item.completed && styles.todoTextCompleted,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            deleteTodo(item.id);
          }}
          style={styles.deleteButton}
          testID={`delete-todo-${item.id}`}
        >
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
      testID={`filter-${type}`}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PriorityButton = ({ priority, label, color }: { priority: Priority; label: string; color: string }) => (
    <TouchableOpacity
      style={[styles.priorityButton, selectedPriority === priority && { backgroundColor: color }]}
      onPress={() => setSelectedPriority(priority)}
      testID={`priority-${priority}`}
    >
      <Text
        style={[
          styles.priorityButtonText,
          selectedPriority === priority && styles.priorityButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PriorityFilterButton = ({ type, label, color }: { type: PriorityFilter; label: string; color?: string }) => (
    <TouchableOpacity
      style={[
        styles.priorityFilterButton,
        priorityFilter === type && styles.priorityFilterButtonActive,
        priorityFilter === type && color && { backgroundColor: color },
      ]}
      onPress={() => setPriorityFilter(type)}
      testID={`priority-filter-${type}`}
    >
      <Text
        style={[
          styles.priorityFilterButtonText,
          priorityFilter === type && styles.priorityFilterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Olá, {user?.name}!</Text>
                <Text style={styles.subtitle}>
                  {stats.active} {stats.active === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={() => router.push('/calendar')}
                  style={styles.iconButton}
                  testID="calendar-button"
                >
                  <Calendar size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/statistics')}
                  style={styles.iconButton}
                  testID="statistics-button"
                >
                  <BarChart3 size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/profile')}
                  style={styles.iconButton}
                  testID="profile-button"
                >
                  <UserCircle size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/settings')}
                  style={styles.iconButton}
                  testID="settings-button"
                >
                  <Settings size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Adicionar nova tarefa..."
                placeholderTextColor="#9ca3af"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleAddTodo}
                returnKeyType="done"
                testID="todo-input"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTodo}
                testID="add-todo-button"
              >
                <Plus size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.prioritySelector}>
              <Text style={styles.prioritySelectorLabel}>Prioridade:</Text>
              <View style={styles.priorityButtons}>
                <PriorityButton priority="urgent" label="Urgente" color="#ef4444" />
                <PriorityButton priority="intermediate" label="Intermediária" color="#eab308" />
                <PriorityButton priority="not-urgent" label="Não urgente" color="#3b82f6" />
              </View>
            </View>

            <View style={styles.dateTimeSection}>
              <Text style={styles.dateTimeLabel}>Data e Hora (opcional):</Text>
              <View style={styles.dateTimeButtons}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      setShowDateTimeModal(true);
                    } else {
                      setShowDatePicker(true);
                    }
                  }}
                  testID="select-date-button"
                >
                  <Text style={styles.dateTimeButtonText}>
                    {selectedDate ? formatDate(selectedDate) : 'Selecionar Data'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      setShowDateTimeModal(true);
                    } else {
                      setShowTimePicker(true);
                    }
                  }}
                  testID="select-time-button"
                >
                  <Text style={styles.dateTimeButtonText}>
                    {selectedTime ? formatTime(selectedTime) : 'Selecionar Hora'}
                  </Text>
                </TouchableOpacity>
                {(selectedDate || selectedTime) && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearDateTime}
                    testID="clear-datetime-button"
                  >
                    <Text style={styles.clearButtonText}>Limpar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Filter size={18} color="#6b7280" style={styles.filterIcon} />
            <FilterButton type="all" label="Todas" />
            <FilterButton type="active" label="Ativas" />
            <FilterButton type="completed" label="Concluídas" />
          </View>

          <View style={styles.priorityFilterSection}>
            <Text style={styles.priorityFilterLabel}>Filtrar por prioridade:</Text>
            <View style={styles.priorityFilterButtons}>
              <PriorityFilterButton type="all" label="Todas" />
              <PriorityFilterButton type="urgent" label="Urgente" color="#ef4444" />
              <PriorityFilterButton type="intermediate" label="Intermediária" color="#eab308" />
              <PriorityFilterButton type="not-urgent" label="Não urgente" color="#3b82f6" />
            </View>
          </View>

          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.active}</Text>
              <Text style={styles.statLabel}>Ativas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
          </View>

          {todos.length === 0 ? (
            <View style={styles.emptyState}>
              <ListTodo size={64} color="#d1d5db" strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>Nenhuma tarefa</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all'
                  ? 'Adicione sua primeira tarefa acima'
                  : filter === 'active'
                  ? 'Nenhuma tarefa ativa'
                  : 'Nenhuma tarefa concluída'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={todos}
              renderItem={renderTodoItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {Platform.OS === 'android' && showTimePicker && (
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        {Platform.OS === 'ios' && (
          <Modal
            visible={showDateTimeModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDateTimeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecionar Data e Hora</Text>
                  <TouchableOpacity
                    onPress={() => setShowDateTimeModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  style={styles.datePicker}
                />
                <DateTimePicker
                  value={selectedTime || new Date()}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputSection: {
    marginTop: -32,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#1f2937',
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  listContent: {
    paddingBottom: 24,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  deleteButton: {
    padding: 8,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  prioritySelector: {
    marginTop: 12,
  },
  prioritySelectorLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  priorityFilterSection: {
    marginBottom: 16,
  },
  priorityFilterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
    marginBottom: 8,
  },
  priorityFilterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  priorityFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  priorityFilterButtonActive: {
    backgroundColor: '#6366f1',
  },
  priorityFilterButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  priorityFilterButtonTextActive: {
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  dateTimeSection: {
    marginTop: 12,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6b7280',
    marginBottom: 8,
  },
  dateTimeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#6366f1',
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  modalCloseButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  datePicker: {
    height: 200,
    backgroundColor: '#fff',
  },
});
