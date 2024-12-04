import {
  MenuProps as PaperMenuProps,
  MenuItemProps as PaperMenuItemProps,
} from 'react-native-paper';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

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
  icon?: IconSource;
  selected?: boolean;
  submenu?: React.ReactNode[];
  onSubmenuOpen?: () => void;
  onSubmenuClose?: () => void;
}

export interface SubmenuState {
  isOpen: boolean;
  parentId?: string;
}
