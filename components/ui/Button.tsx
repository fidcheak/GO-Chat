import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
};

export default function Button({ title, loading, disabled, style, ...rest }: Props) {
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: tint },
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={background} />
      ) : (
        <Text style={[styles.text, { color: background }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.7,
  },
});