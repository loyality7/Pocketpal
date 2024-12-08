import React from 'react';
import {View} from 'react-native';

import {TextInput as PaperTextInput, TextInputProps} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

export type CustomTextInputProps = TextInputProps & {
  showDivider?: boolean;
};

export const TextInput: React.FC<CustomTextInputProps> = ({
  style,
  showDivider = false,
  ...rest
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <PaperTextInput
        {...rest}
        underlineColor={theme.colors.border}
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.placeholder}
      />
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};
