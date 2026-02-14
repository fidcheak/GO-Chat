import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = TextInputProps & {
  control: Control<any>;
  name: string;
  label?: string;
  error?: FieldError;
};

export default function ControlledInput({ control, name, label, error, ...rest }: Props) {
  const color = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'inputBorder');
  const errorColor = useThemeColor({}, 'errorText');
  const placeholderTextColor = useThemeColor({}, 'placeholder');

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color }]}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              { color, borderColor: error ? errorColor : borderColor },
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={placeholderTextColor}
            {...rest}
          />
        )}
      />
      {error && <Text style={[styles.errorText, { color: errorColor }]}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});