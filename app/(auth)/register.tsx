import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useRouter } from 'expo-router';

import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import ControlledInput from '@/components/ui/ControlledInput';
import Button from '@/components/ui/Button';
import { register } from '@/services/api/auth';
import useAuthStore from '@/store/auth';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

export default function RegisterScreen() {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const user = await register(data);
      setUser(user);
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create Account</ThemedText>
      <ControlledInput
        name="username"
        control={control}
        placeholder="Username"
      />
      <ControlledInput
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Register" onPress={handleSubmit(onSubmit)} loading={loading} />
      <Link href="/(auth)/login" style={styles.link}>
        <ThemedText type="link">Already have an account? Login</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  link: {
    marginTop: 16,
  },
});
