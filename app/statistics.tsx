import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { useTodos } from './contexts/TodosContext';

export default function StatisticsScreen() {
  const { allTodos, stats } = useTodos();

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const priorityStats = {
    urgent: allTodos.filter(t => t.priority === 'urgent').length,
    intermediate: allTodos.filter(t => t.priority === 'intermediate').length,
    notUrgent: allTodos.filter(t => t.priority === 'not-urgent').length,
  };

  const completedByPriority = {
    urgent: allTodos.filter(t => t.priority === 'urgent' && t.completed).length,
    intermediate: allTodos.filter(t => t.priority === 'intermediate' && t.completed).length,
    notUrgent: allTodos.filter(t => t.priority === 'not-urgent' && t.completed).length,
  };

  const urgentCompletionRate = priorityStats.urgent > 0 
    ? Math.round((completedByPriority.urgent / priorityStats.urgent) * 100) 
    : 0;
  const intermediateCompletionRate = priorityStats.intermediate > 0 
    ? Math.round((completedByPriority.intermediate / priorityStats.intermediate) * 100) 
    : 0;
  const notUrgentCompletionRate = priorityStats.notUrgent > 0 
    ? Math.round((completedByPriority.notUrgent / priorityStats.notUrgent) * 100) 
    : 0;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Estatísticas',
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
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <BarChart3 size={48} color="#fff" strokeWidth={2} />
            <Text style={styles.headerTitle}>Suas Estatísticas</Text>
            <Text style={styles.headerSubtitle}>Acompanhe seu progresso</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.mainCard}>
            <View style={styles.mainCardHeader}>
              <TrendingUp size={32} color="#6366f1" />
              <Text style={styles.mainCardTitle}>Taxa de Conclusão</Text>
            </View>
            <Text style={styles.mainCardValue}>{completionRate}%</Text>
            <Text style={styles.mainCardSubtitle}>
              {stats.completed} de {stats.total} tarefas concluídas
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visão Geral</Text>
            
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
                <View style={styles.statIconContainer}>
                  <CheckCircle2 size={24} color="#3b82f6" />
                </View>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total de Tarefas</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
                <View style={styles.statIconContainer}>
                  <Clock size={24} color="#f59e0b" />
                </View>
                <Text style={styles.statValue}>{stats.active}</Text>
                <Text style={styles.statLabel}>Tarefas Ativas</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#d1fae5' }]}>
                <View style={styles.statIconContainer}>
                  <CheckCircle2 size={24} color="#10b981" />
                </View>
                <Text style={styles.statValue}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Concluídas</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
                <View style={styles.statIconContainer}>
                  <AlertCircle size={24} color="#ef4444" />
                </View>
                <Text style={styles.statValue}>{priorityStats.urgent}</Text>
                <Text style={styles.statLabel}>Urgentes</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Por Prioridade</Text>
            
            <View style={styles.priorityCard}>
              <View style={styles.priorityHeader}>
                <View style={[styles.priorityDot, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.priorityTitle}>Urgente</Text>
              </View>
              <View style={styles.priorityStats}>
                <Text style={styles.priorityCount}>{priorityStats.urgent} tarefas</Text>
                <Text style={styles.priorityRate}>{urgentCompletionRate}% concluídas</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${urgentCompletionRate}%`, backgroundColor: '#ef4444' }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.priorityCard}>
              <View style={styles.priorityHeader}>
                <View style={[styles.priorityDot, { backgroundColor: '#eab308' }]} />
                <Text style={styles.priorityTitle}>Intermediária</Text>
              </View>
              <View style={styles.priorityStats}>
                <Text style={styles.priorityCount}>{priorityStats.intermediate} tarefas</Text>
                <Text style={styles.priorityRate}>{intermediateCompletionRate}% concluídas</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${intermediateCompletionRate}%`, backgroundColor: '#eab308' }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.priorityCard}>
              <View style={styles.priorityHeader}>
                <View style={[styles.priorityDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.priorityTitle}>Não Urgente</Text>
              </View>
              <View style={styles.priorityStats}>
                <Text style={styles.priorityCount}>{priorityStats.notUrgent} tarefas</Text>
                <Text style={styles.priorityRate}>{notUrgentCompletionRate}% concluídas</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${notUrgentCompletionRate}%`, backgroundColor: '#3b82f6' }
                  ]} 
                />
              </View>
            </View>
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
  header: {
    paddingBottom: 32,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    padding: 24,
    marginTop: -16,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  mainCardValue: {
    fontSize: 64,
    fontWeight: '700' as const,
    color: '#6366f1',
    marginBottom: 8,
  },
  mainCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  priorityCard: {
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
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  priorityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priorityCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  priorityRate: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6366f1',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
