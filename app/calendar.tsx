import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react-native';
import { useTodos, Priority } from './contexts/TodosContext';

export default function CalendarScreen() {
  const { allTodos, toggleTodo } = useTodos();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const previousMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    const startOfDay = new Date(dateToCheck.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(dateToCheck.setHours(23, 59, 59, 999)).getTime();

    return allTodos.filter(todo => {
      if (todo.dueDate) {
        return todo.dueDate >= startOfDay && todo.dueDate <= endOfDay;
      }
      return todo.createdAt >= startOfDay && todo.createdAt <= endOfDay;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const tasksForSelectedDay = getTasksForDate(selectedDay);

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

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const tasks = getTasksForDate(day);
      const hasUrgent = tasks.some(t => t.priority === 'urgent' && !t.completed);
      const isSelected = day === selectedDay;
      const isTodayDate = isToday(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isTodayDate && !isSelected && styles.todayDay,
          ]}
          onPress={() => setSelectedDay(day)}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isTodayDate && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
          {tasks.length > 0 && (
            <View style={styles.taskIndicators}>
              <View style={[styles.taskDot, hasUrgent && { backgroundColor: '#ef4444' }]} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Calendário',
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
            <CalendarIcon size={48} color="#6366f1" strokeWidth={2} />
            <Text style={styles.headerTitle}>Calendário de Tarefas</Text>
            <Text style={styles.headerSubtitle}>Visualize suas tarefas por data</Text>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
                <ChevronLeft size={24} color="#6366f1" />
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {monthNames[month]} {year}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                <ChevronRight size={24} color="#6366f1" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {dayNames.map(day => (
                <View key={day} style={styles.weekDayCell}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {renderCalendarDays()}
            </View>
          </View>

          <View style={styles.tasksSection}>
            <Text style={styles.tasksSectionTitle}>
              Tarefas de {selectedDay} de {monthNames[month]}
            </Text>
            
            {tasksForSelectedDay.length === 0 ? (
              <View style={styles.emptyTasks}>
                <Text style={styles.emptyTasksText}>Nenhuma tarefa nesta data</Text>
              </View>
            ) : (
              <View style={styles.tasksList}>
                {tasksForSelectedDay.map(task => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskItem}
                    onPress={() => toggleTodo(task.id)}
                  >
                    <View style={[styles.taskPriorityBar, { backgroundColor: getPriorityColor(task.priority) }]} />
                    {task.completed ? (
                      <CheckCircle2 size={24} color="#10b981" strokeWidth={2} />
                    ) : (
                      <Circle size={24} color="#9ca3af" strokeWidth={2} />
                    )}
                    <Text
                      style={[
                        styles.taskText,
                        task.completed && styles.taskTextCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
    marginBottom: 24,
    paddingVertical: 16,
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
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#6b7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    position: 'relative' as const,
  },
  selectedDay: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#1f2937',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
  todayDayText: {
    color: '#6366f1',
    fontWeight: '700' as const,
  },
  taskIndicators: {
    position: 'absolute' as const,
    bottom: 4,
    flexDirection: 'row',
    gap: 2,
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
  tasksSection: {
    marginBottom: 24,
  },
  tasksSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyTasks: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyTasksText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  tasksList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative' as const,
  },
  taskPriorityBar: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
});
