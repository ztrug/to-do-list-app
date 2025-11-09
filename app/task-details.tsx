import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Circle, Trash2, Calendar, Flag, Share2, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { useTodos, Priority } from './contexts/TodosContext';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { trpc } from '@/lib/trpc';

type Attachment = {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
};

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allTodos, toggleTodo, deleteTodo } = useTodos();

  const todo = allTodos.find(t => t.id === id);

  const [title, setTitle] = useState<string>(todo?.title || '');
  const [priority, setPriority] = useState<Priority>(todo?.priority || 'intermediate');
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const { data: attachmentsData, isLoading: loadingAttachments, refetch: refetchAttachments } = trpc.attachments.list.useQuery(
    { todoId: id },
    { enabled: !!id }
  );

  const createAttachmentMutation = trpc.attachments.create.useMutation({
    onSuccess: () => {
      console.log('[TaskDetails] Anexo criado com sucesso');
      refetchAttachments();
    },
    onError: (error) => {
      console.error('[TaskDetails] Erro ao criar anexo:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a imagem.');
    },
  });

  const deleteAttachmentMutation = trpc.attachments.delete.useMutation({
    onSuccess: () => {
      console.log('[TaskDetails] Anexo excluído com sucesso');
      refetchAttachments();
    },
    onError: (error) => {
      console.error('[TaskDetails] Erro ao excluir anexo:', error);
      Alert.alert('Erro', 'Não foi possível excluir a imagem.');
    },
  });

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleShare = async () => {
    try {
      const shareText = `📋 *${todo.title}*\n\n` +
        `Status: ${todo.completed ? '✅ Concluída' : '⏳ Pendente'}\n` +
        `Prioridade: ${getPriorityLabel(todo.priority)}\n` +
        `Criada em: ${formatDate(todo.createdAt)}` +
        (todo.dueDate ? `\nData/Hora: ${formatDate(todo.dueDate)}` : '');

      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'Compartilhar Tarefa',
            text: shareText,
          });
        } else {
          await navigator.clipboard.writeText(shareText);
          Alert.alert('Copiado!', 'Texto copiado para a área de transferência.');
        }
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          const blob = new Blob([shareText], { type: 'text/plain' });
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            const uri = base64data;
            
            try {
              await Sharing.shareAsync(uri, {
                mimeType: 'text/plain',
                dialogTitle: 'Compartilhar Tarefa',
              });
            } catch (error) {
              console.error('Error sharing:', error);
              Alert.alert('Erro', 'Não foi possível compartilhar a tarefa.');
            }
          };
          reader.readAsDataURL(blob);
        } else {
          Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo.');
        }
      }
    } catch (error) {
      console.error('Error sharing task:', error);
    }
  };

  const handleOpenCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'A câmera não está disponível na web. Use a galeria.');
      handlePickImage();
      return;
    }

    if (!cameraPermission) {
      return;
    }

    if (!cameraPermission.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera.');
        return;
      }
    }

    setShowCamera(true);
  };

  const handleTakePhoto = async (cameraRef: any) => {
    try {
      console.log('[TaskDetails] Tirando foto...');
      const photo = await cameraRef.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      console.log('[TaskDetails] Foto tirada, processando...');
      setShowCamera(false);

      const base64Data = `data:image/jpeg;base64,${photo.base64}`;
      const fileSize = Math.round(photo.base64.length * 0.75);

      await createAttachmentMutation.mutateAsync({
        todoId: id,
        filename: `photo_${Date.now()}.jpg`,
        fileUrl: base64Data,
        fileType: 'image/jpeg',
        fileSize,
      });

      console.log('[TaskDetails] Foto anexada com sucesso');
    } catch (error) {
      console.error('[TaskDetails] Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
      setShowCamera(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const base64Data = asset.base64 
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        const fileSize = asset.fileSize || Math.round((asset.base64?.length || 0) * 0.75);

        await createAttachmentMutation.mutateAsync({
          todoId: id,
          filename: asset.fileName || `image_${Date.now()}.jpg`,
          fileUrl: base64Data,
          fileType: asset.mimeType || 'image/jpeg',
          fileSize,
        });

        console.log('[TaskDetails] Imagem anexada com sucesso');
      }
    } catch (error) {
      console.error('[TaskDetails] Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    Alert.alert(
      'Excluir Imagem',
      'Tem certeza que deseja excluir esta imagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteAttachmentMutation.mutate({ attachmentId });
          },
        },
      ]
    );
  };

  const renderAttachmentItem = ({ item }: { item: Attachment }) => (
    <View style={styles.attachmentItem}>
      <Image
        source={{ uri: item.fileUrl }}
        style={styles.attachmentImage}
        contentFit="cover"
      />
      <View style={styles.attachmentInfo}>
        <Text style={styles.attachmentFilename} numberOfLines={1}>
          {item.filename}
        </Text>
        <Text style={styles.attachmentSize}>
          {formatFileSize(item.fileSize)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteAttachmentButton}
        onPress={() => handleDeleteAttachment(item.id)}
        disabled={deleteAttachmentMutation.isPending}
      >
        <X size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const CameraScreen = () => {
    const cameraRef = useRef<CameraView>(null);

    return (
      <>
        <Stack.Screen options={{ title: 'Tirar Foto' }} />
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            ref={cameraRef}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.cameraCancelButton}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cameraButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraCaptureButton}
                onPress={() => handleTakePhoto(cameraRef.current)}
              >
                <View style={styles.cameraCaptureButtonInner} />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </>
    );
  };

  if (showCamera) {
    return <CameraScreen />;
  }

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
          headerRight: () => (
            <TouchableOpacity
              onPress={handleShare}
              style={{ marginRight: 16 }}
              testID="share-button"
            >
              <Share2 size={24} color="#fff" />
            </TouchableOpacity>
          ),
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
              <ImageIcon size={20} color="#6b7280" />
              <Text style={styles.sectionTitle}>Imagens Anexadas</Text>
            </View>
            
            <View style={styles.imageActions}>
              <TouchableOpacity
                style={styles.imageActionButton}
                onPress={handleOpenCamera}
                disabled={createAttachmentMutation.isPending}
              >
                <Camera size={20} color="#fff" />
                <Text style={styles.imageActionButtonText}>
                  {Platform.OS === 'web' ? 'Galeria' : 'Câmera'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageActionButton, styles.imageActionButtonSecondary]}
                onPress={handlePickImage}
                disabled={createAttachmentMutation.isPending}
              >
                <ImageIcon size={20} color="#6366f1" />
                <Text style={styles.imageActionButtonTextSecondary}>Galeria</Text>
              </TouchableOpacity>
            </View>

            {createAttachmentMutation.isPending && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.uploadingText}>Enviando imagem...</Text>
              </View>
            )}

            {loadingAttachments ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#6366f1" />
              </View>
            ) : attachmentsData && attachmentsData.attachments.length > 0 ? (
              <FlatList
                data={attachmentsData.attachments}
                renderItem={renderAttachmentItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.attachmentsList}
              />
            ) : (
              <View style={styles.noAttachmentsContainer}>
                <Text style={styles.noAttachmentsText}>Nenhuma imagem anexada</Text>
              </View>
            )}
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
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  imageActionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  imageActionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  imageActionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6366f1',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noAttachmentsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noAttachmentsText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  attachmentsList: {
    gap: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  attachmentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentFilename: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  deleteAttachmentButton: {
    padding: 8,
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 32,
  },
  cameraCancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  cameraCaptureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraCaptureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});
