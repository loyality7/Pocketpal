import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {Icon} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

type Props = {
  checked: boolean;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
};

export const Checkbox: React.FC<Props> = ({
  checked,
  onPress,
  size = 20,
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.checkbox,
          {width: size, height: size},
          checked ? styles.checkedBox : styles.uncheckedBox,
        ]}>
        {checked && (
          <Icon source="check" size={size * 0.7} color={theme.colors.surface} />
        )}
      </View>
    </TouchableOpacity>
  );
};
