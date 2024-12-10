import React, {ReactNode} from 'react';
import {ViewStyle, ScrollView} from 'react-native';

import {Button, Portal, Dialog as PaperDialog} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

export interface DialogAction {
  label: string;
  onPress: () => void;
  mode?: 'text' | 'contained' | 'outlined';
}

interface CustomDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  children: ReactNode;
  actions?: DialogAction[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollAreaStyle?: ViewStyle;
  scrollable?: boolean;
  dismissableBackButton?: boolean;
  dismissable?: boolean;
}

export const Dialog: React.FC<CustomDialogProps> = ({
  visible,
  onDismiss,
  title,
  children,
  actions = [],
  style,
  contentStyle,
  scrollAreaStyle,
  scrollable = false,
  dismissableBackButton = true,
  dismissable = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const content = scrollable ? (
    <PaperDialog.ScrollArea style={[styles.dialogContent, contentStyle]}>
      <ScrollView
        style={[styles.dialogScrollArea, scrollAreaStyle]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        {children}
      </ScrollView>
    </PaperDialog.ScrollArea>
  ) : (
    <PaperDialog.Content style={[styles.dialogContent, contentStyle]}>
      {children}
    </PaperDialog.Content>
  );

  return (
    <Portal>
      <PaperDialog
        dismissableBackButton={dismissableBackButton}
        dismissable={dismissable}
        visible={visible}
        onDismiss={onDismiss}
        style={[styles.dialog, style]}>
        <PaperDialog.Title style={styles.dialogTitle}>
          {title}
        </PaperDialog.Title>
        {content}
        {actions.length > 0 && (
          <PaperDialog.Actions style={styles.actionsContainer}>
            {actions.map(action => (
              <Button
                key={action.label}
                mode={action.mode || 'text'}
                onPress={action.onPress}
                style={styles.dialogActionButton}>
                {action.label}
              </Button>
            ))}
          </PaperDialog.Actions>
        )}
      </PaperDialog>
    </Portal>
  );
};
