import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://3000-icvbmdhbxp0mqoakxxqho-e5e91674.sg1.manus.computer/api/trpc';
const { width, height } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0066cc" />
      <WorkerApp />
    </SafeAreaView>
  );
}

function WorkerApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth.login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.result?.token) {
        await AsyncStorage.setItem('authToken', data.result.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.result.user));
        setIsLoggedIn(true);
        Alert.alert('הצלחה', 'התחברת בהצלחה');
      } else {
        Alert.alert('שגיאה', 'שם משתמש או סיסמה שגויים');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'לא הצלחנו להתחבר לשרת');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} loading={loading} />;
  }

  return <WorkerDashboard onLogout={() => setIsLoggedIn(false)} />;
}

function LoginScreen({ onLogin, email, setEmail, password, setPassword, loading }: any) {
  return (
    <ScrollView style={styles.loginContainer} contentContainerStyle={styles.loginContent}>
      <View style={styles.loginHeader}>
        <Text style={styles.loginTitle}>קבלן שלד</Text>
        <Text style={styles.loginSubtitle}>אפליקציית עובד</Text>
      </View>

      <View style={styles.loginForm}>
        <TextInput
          style={styles.input}
          placeholder="אימייל"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="סיסמה"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={onLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>התחבר</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.demoText}>
          דוגמה: slamhkrakra006@gmail.com
        </Text>
      </View>
    </ScrollView>
  );
}

function WorkerDashboard({ onLogout }: any) {
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setElapsedTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking, startTime]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const startWork = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/workSessions.start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ workerId: user?.workerId }),
      });

      const data = await response.json();
      if (data.result) {
        setStartTime(new Date());
        setIsWorking(true);
        Alert.alert('עבודה התחילה', 'התחלת יום עבודה בהצלחה');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'לא הצלחנו להתחיל את העבודה');
    }
  };

  const endWork = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/workSessions.end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ workerId: user?.workerId }),
      });

      const data = await response.json();
      if (data.result) {
        setIsWorking(false);
        setStartTime(null);
        Alert.alert('עבודה הסתיימה', `עבדת: ${elapsedTime}`);
        setElapsedTime('00:00:00');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'לא הצלחנו לסיים את העבודה');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    onLogout();
  };

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>קבלן שלד</Text>
          <Text style={styles.headerSubtitle}>{user?.name || 'עובד'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>סטטוס עבודה</Text>
          <Text style={[styles.statusValue, { color: isWorking ? '#4CAF50' : '#999' }]}>
            {isWorking ? '🟢 עובד' : '⚫ לא עובד'}
          </Text>
        </View>

        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>זמן עבודה</Text>
          <Text style={styles.timerValue}>{elapsedTime}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {!isWorking ? (
            <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startWork}>
              <Text style={styles.buttonText}>▶ התחל עבודה</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={endWork}>
              <Text style={styles.buttonText}>⏹ סיים עבודה</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>משימות היום</Text>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>📋 בדוק את אתר הבנייה</Text>
            <Text style={styles.taskTime}>09:00 - 12:00</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>🔨 התקן חומרים</Text>
            <Text style={styles.taskTime}>13:00 - 17:00</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>📸 צלם תמונות</Text>
            <Text style={styles.taskTime}>17:00 - 18:00</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💰 הכנסה היום</Text>
          <Text style={styles.infoValue}>₪360</Text>
          <Text style={styles.infoSubtext}>8 שעות עבודה</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loginTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  loginSubtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  loginForm: {
    gap: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  loginButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#0066cc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    fontSize: 28,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  timerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tasksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  taskTime: {
    fontSize: 14,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  infoTitle: {
    fontSize: 18,
    color: '#0066cc',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  infoSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
