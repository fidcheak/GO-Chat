import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ControlledInputProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  rules?: object;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  rules = {},
}) => {
  const color = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#ccc', dark: '#555' }, 'icon');

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            style={[styles.input, { color, backgroundColor, borderColor }]}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={borderColor}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ControlledInput;
