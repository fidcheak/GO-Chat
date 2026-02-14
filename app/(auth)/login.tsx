import { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useRouter } from 'expo-router';

import ControlledInput from '@/components/ui/ControlledInput';
import Button from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuthStore } from '@/store/auth';
import { login } from '@/services/api/auth';
import { useThemeColor } from '@/hooks/useThemeColor';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const tint = useThemeColor({}, 'tint');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await login(data);
      setUser(user);
      // The root layout will handle the redirect automatically
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome Back!</ThemedText>
      <ControlledInput
        name="username"
        control={control}
        label="Username"
        placeholder="Enter your username"
        error={errors.username}
        autoCapitalize="none"
      />
      <ControlledInput
        name="password"
        control={control}
        label="Password"
        placeholder="Enter your password"
        error={errors.password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} loading={loading} />
      <View style={styles.registerLinkContainer}>
        <ThemedText>Don't have an account? </ThemedText>
        <Link href="/(auth)/register">
          <Text style={[styles.link, { color: tint }]}>Register</Text>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  link: {
    fontWeight: 'bold',
  },
});