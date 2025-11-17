import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { UserPlus, Mail, Lock, User, Calendar, Users } from 'lucide-react-native';
import { useAuth } from './contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [howFound, setHowFound] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !age.trim() || !howFound.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      setError('Digite uma idade válida');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await register(email.trim(), password, name.trim(), ageNumber, howFound.trim());

    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Erro ao cadastrar');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <UserPlus size={48} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Cadastre-se para começar</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color="#6366f1" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  testID="register-name-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6366f1" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  testID="register-email-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6366f1" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  testID="register-password-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6366f1" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  testID="register-confirm-password-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <Calendar size={20} color="#6366f1" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Idade"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  testID="register-age-input"
                />
              </View>

              <View style={styles.inputContainer}>
                <Users size={20} color="#6366f1" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Como conheceu a plataforma?"
                  placeholderTextColor="#999"
                  value={howFound}
                  onChangeText={setHowFound}
                  autoCapitalize="sentences"
                  testID="register-how-found-input"
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={isLoading}
                testID="register-button"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Cadastrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Já tem uma conta? </Text>
                <TouchableOpacity
                  onPress={() => router.back()}
                  testID="go-to-login-button"
                >
                  <Text style={styles.linkText}>Faça login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#fff',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#6366f1',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
