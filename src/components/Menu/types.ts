import {
  MenuProps as PaperMenuProps,
  MenuItemProps as PaperMenuItemProps,
} from 'react-native-paper';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export interface MenuProps extends Omit<PaperMenuProps, 'anchor' | 'theme'> {
  anchor: React.ReactNode;
}

export interface MenuItemProps
  extends Omit<PaperMenuItemProps, 'title' | 'titleStyle'> {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
  isGroupLabel?: boolean;
}
