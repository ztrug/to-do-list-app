import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Calendar,
  Users,
  LogOut,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useAuth } from './contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfilePhoto } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const showPhotoOptions = () => {
    if (Platform.OS === 'web') {
      pickImageFromGallery();
      return;
    }

    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        {
          text: 'Tirar Foto',
          onPress: takePhoto,
        },
        {
          text: 'Escolher da Galeria',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const InfoCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoCard}>
      <View style={styles.iconContainer}>
        <Icon size={24} color="#6366f1" strokeWidth={2} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
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
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                testID="back-button"
              >
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Perfil</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.profileSection}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={showPhotoOptions}
                testID="avatar-button"
              >
                {user?.profilePhoto ? (
                  <Image 
                    source={{ uri: user.profilePhoto }} 
                    style={styles.avatarImage}
                  />
                ) : (
                  <User size={48} color="#fff" strokeWidth={2} />
                )}
                <View style={styles.cameraIconContainer}>
                  <Camera size={16} color="#fff" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>

            <InfoCard icon={User} label="Nome" value={user?.name || ''} />
            <InfoCard icon={Mail} label="Email" value={user?.email || ''} />
            <InfoCard
              icon={Calendar}
              label="Idade"
              value={user?.age ? `${user.age} anos` : ''}
            />
            <InfoCard
              icon={Users}
              label="Como conheceu"
              value={user?.howFound || ''}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            testID="logout-button"
          >
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative' as const,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  cameraIconContainer: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 16,
  },
  infoCard: {
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f1ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ef4444',
  },
});
