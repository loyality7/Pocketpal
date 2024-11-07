import React, {useCallback, useEffect, useMemo, useRef} from 'react';

import {Portal} from 'react-native-paper';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

export interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  initialSnapPoint?: number;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onDismiss,
  children,
  snapPoints: customSnapPoints,
  initialSnapPoint = 0,
  enablePanDownToClose = true,
  enableDynamicSizing = false,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  const snapPoints = useMemo(
    () => customSnapPoints ?? ['50%', '90%'],
    [customSnapPoints],
  );

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
        style={[props.style, styles.backdrop]}
      />
    ),
    [styles.backdrop],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <GorhomBottomSheet
        ref={bottomSheetRef}
        index={initialSnapPoint}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClose={onDismiss}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.background}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        enableDynamicSizing={enableDynamicSizing}>
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </GorhomBottomSheet>
    </Portal>
  );
};
