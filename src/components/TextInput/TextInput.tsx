import React, {forwardRef} from 'react';
import {View, TextInput as RNTextInput} from 'react-native';

import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

export type TextInputProps = PaperTextInputProps & {
  showDivider?: boolean;
};

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({style, showDivider = false, ...rest}, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    return (
      <View style={styles.container}>
        <PaperTextInput
          ref={ref}
          {...rest}
          dense
          underlineColor={theme.colors.border}
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.placeholder}
        />
        {showDivider && <View style={styles.divider} />}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';
