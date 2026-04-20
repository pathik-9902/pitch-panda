import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { UserContext } from '../UserContext';
import Alert from '../../components/Alert';
import { B_URL } from '@env';

const Login = () => {
  const router = useRouter();
  const { setUserState } = useContext(UserContext);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    phone: '',
  });
  const [alert, setAlert] = useState({});

  const changeHandler = (value) => {
    const formattedValue = value.replace(/\D/g, '');
    setUserDetails({
      ...user,
      phone: formattedValue.startsWith('91') ? formattedValue.slice(2, 12) : formattedValue.slice(0, 10),
    });
    setFormErrors({ ...formErrors, phone: '' });
  };

  const validateForm = (values) => {
    const errors = {};
    const phoneRegex = /^[0-9]{10}$/;
    if (!values.phone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(values.phone)) {
      errors.phone = 'Enter a valid 10-digit number';
    }
    return errors;
  };

  const loginHandler = () => {
    const errors = validateForm(user);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
  };

  useEffect(() => {
    const handleLogin = async () => {
      if (!isSubmit) return;
      try {
        const phonenum = `+91${user.phone}`;
        const response = await axios.post(`${B_URL}/auth/login`, { phone: phonenum });
        const { data } = response;
        setAlert({ type: 'success', message: data.message });
        setUserState(data.user);
        router.replace('/(tabs)/(home)/Home');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          const phonenum = `+91${user.phone}`;
          router.push({ pathname: '/(auth)/Register', params: { phone: phonenum } });
        } else {
          setAlert({ type: 'error', message: 'Something went wrong. Please try again.' });
        }
      } finally {
        setIsSubmit(false);
      }
    };
    handleLogin();
  }, [isSubmit]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Enter your phone number to continue</Text>
        </View>
        
        {alert.message ? <Alert type={alert.type} message={alert.message} /> : null}
        
        <View style={styles.inputSection}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="00000 00000"
              placeholderTextColor="#94A3B8"
              onChangeText={changeHandler}
              value={user.phone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {formErrors.phone && <Text style={styles.error}>{formErrors.phone}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmit && styles.buttonDisabled]}
          onPress={loginHandler}
          disabled={isSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{isSubmit ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.signUpText} onPress={() => router.push('/(auth)/Register')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
  inputSection: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    paddingHorizontal: 20,
    height: 68,
  },
  prefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#5AB25E',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 4,
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
  signUpText: {
    color: '#5AB25E',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default Login;
