import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const slideAnim = useRef(new Animated.Value(300)).current; // Slide animation starting position
  const { signIn, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    // Slide-up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    clearError();

    try {
      await signIn(email, password);
    } catch (err) {
      Alert.alert('Login failed', error || 'An error occurred while logging in');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/logo.png')} // Adjust path to the logo
      style={styles.backgroundImage}
    >
      {/* Green Overlay */}
      <LinearGradient
        colors={['rgba(83, 163, 156, 0.7)', 'rgba(83, 163, 156, 0.7)']} // Semi-transparent #53a39c
        style={styles.overlay}
      />

      {/* Center Logo and Title */}
      <View style={styles.centerContent}>
      <Ionicons name="paw" size={60} color="#FFD700" style={styles.logo} />
        <Text style={styles.title}>Animal Health Care Management System</Text>
        <Text style={styles.subtitle}>Albay Park & Wildlife</Text>
      </View>

      {/* Bottom Sheet for Login */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.description}>
          Welcome to the Animal Health Care System. Log in to manage and monitor the health of the animals.
        </Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
        />

        {/* Error Message */}
        {error && !isLoading && <Text style={styles.errorText}>{error}</Text>}

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>LOG IN</Text>
          )}
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By signing up, you agree to the{' '}
          <Text style={styles.linkText}>privacy policy</Text> and{' '}
          <Text style={styles.linkText}>terms of use</Text>.
        </Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 139, 34, 0.7)',
  },
  centerContent: {
    position: 'absolute',
    top: '20%',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#53a39c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#6B8E23',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
