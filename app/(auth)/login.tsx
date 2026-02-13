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
import { login } from '@/services/api/auth';
import useAuthStore from '@/store/auth';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginScreen() {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const user = await login(data);
      setUser(user);
      router.replace('/(app)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome Back</ThemedText>
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
      <Button title="Login" onPress={handleSubmit(onSubmit)} loading={loading} />
      <Link href="/(auth)/register" style={styles.link}>
        <ThemedText type="link">Don't have an account? Register</ThemedText>
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
