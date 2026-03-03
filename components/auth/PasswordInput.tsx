import { useState } from 'react';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Tokens } from '@/constants/Tokens';
import { useThemeColor } from '@/components/Themed';

import { AuthInput } from './AuthInput';

export interface PasswordInputProps extends Omit<Parameters<typeof AuthInput>[0], 'secureTextEntry' | 'rightAdornment'> {
  value: string;
  onChangeText: (text: string) => void;
}

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const tintColor = useThemeColor('tint');

  const toggle = (
    <Pressable
      onPress={() => setVisible((v) => !v)}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
      style={{ minWidth: Tokens.touchTarget, minHeight: Tokens.touchTarget, justifyContent: 'center', alignItems: 'center' }}
    >
      <Ionicons
        name={visible ? 'eye-off-outline' : 'eye-outline'}
        size={24}
        color={tintColor}
      />
    </Pressable>
  );

  return (
    <AuthInput
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightAdornment={toggle}
    />
  );
}
