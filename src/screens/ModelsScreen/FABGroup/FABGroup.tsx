import {Image} from 'react-native';
import React, {useContext, useMemo, useState} from 'react';

import {FAB, Portal} from 'react-native-paper';

import {L10nContext} from '../../../utils';
import {styles} from './styles';

interface FABGroupProps {
  onAddHFModel: () => void;
  onAddLocalModel: () => void;
  onResetModels: () => void;
}

const HFIcon: React.FC<any> = props => (
  <Image
    source={require('../../../assets/icon-hf.png')}
    style={styles.icon}
    {...props}
  />
);

export const FABGroup: React.FC<FABGroupProps> = ({
  onAddHFModel,
  onAddLocalModel,
  onResetModels,
}) => {
  const [open, setOpen] = useState(false);
  const l10n = useContext(L10nContext);

  const onStateChange = ({open: isOpen}) => setOpen(isOpen);

  const actions = useMemo(
    () => [
      {
        icon: HFIcon,
        label: l10n.hfFABLabel,
        onPress: () => {
          onAddHFModel();
        },
      },
      {
        icon: 'folder-plus',
        label: l10n.localFABLabel,
        onPress: () => {
          onAddLocalModel();
        },
      },
      {
        icon: 'refresh',
        label: l10n.resetFABLabel,
        onPress: () => {
          onResetModels();
        },
      },
    ],
    [l10n, onAddHFModel, onAddLocalModel, onResetModels],
  );

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible={true}
        icon={open ? 'close' : 'chevron-up'}
        actions={actions}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            console.log('FAB Group closed');
          } else {
            console.log('FAB Group opened');
          }
        }}
        fabStyle={styles.fab}
        accessibilityLabel={open ? 'Close menu' : 'Open menu'}
      />
    </Portal>
  );
};
