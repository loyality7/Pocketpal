import {Image, View} from 'react-native';
import React, {useContext, useState} from 'react';

import {observer} from 'mobx-react';
import {Menu, IconButton} from 'react-native-paper';

import iconHF from '../../assets/icon-hf.png';
import iconHFLight from '../../assets/icon-hf-light.png';

import {useTheme} from '../../hooks';

import {styles} from './styles';

import {modelStore, uiStore} from '../../store';

import {L10nContext} from '../../utils';

import {ModelsResetDialog} from '..';

export const ModelsHeaderRight = observer(() => {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [_, setTrigger] = useState<boolean>(false);

  const {colors} = useTheme();

  const l10n = useContext(L10nContext);

  const filters = uiStore.pageStates.modelsScreen.filters;
  const setFilters = (value: string[]) => {
    uiStore.setValue('modelsScreen', 'filters', value);
    setFilterMenuVisible(false);
  };

  const showResetDialog = () => setResetDialogVisible(true);
  const hideResetDialog = () => setResetDialogVisible(false);

  const handleReset = async () => {
    try {
      modelStore.resetModels();
      setTrigger(prev => !prev); // Trigger UI refresh
    } catch (error) {
      console.error('Error resetting models:', error);
    } finally {
      hideResetDialog();
    }
  };

  const toggleFilter = (filterName: string) => {
    const newFilters = filters.includes(filterName)
      ? filters.filter(f => f !== filterName)
      : [...filters, filterName];
    setFilters(newFilters);
  };

  return (
    <View style={styles.container}>
      <ModelsResetDialog
        visible={resetDialogVisible}
        onDismiss={hideResetDialog}
        onReset={handleReset}
      />
      <Menu
        visible={filterMenuVisible}
        onDismiss={() => setFilterMenuVisible(false)}
        anchor={
          <IconButton
            icon="filter"
            size={24}
            style={styles.iconButton}
            onPress={() => setFilterMenuVisible(true)}
            iconColor={
              filters.length > 0 ? colors.primary : colors.onBackground
            }
          />
        }>
        <Menu.Item
          leadingIcon={({size}) => (
            <Image
              source={filters.includes('hf') ? iconHF : iconHFLight}
              style={{width: size, height: size}}
            />
          )}
          onPress={() => toggleFilter('hf')}
          title={l10n.filterTitleHf}
          trailingIcon={filters.includes('hf') ? 'check' : undefined}
        />
        <Menu.Item
          leadingIcon={
            filters.includes('downloaded') ? 'download-circle' : 'download'
          }
          onPress={() => toggleFilter('downloaded')}
          title={l10n.filterTitleDownloaded}
          trailingIcon={filters.includes('downloaded') ? 'check' : undefined}
        />
      </Menu>

      {/* Grouping icon */}
      <IconButton
        icon={filters.includes('grouped') ? 'layers' : 'layers-outline'}
        size={24}
        style={styles.iconButton}
        onPress={() => toggleFilter('grouped')}
        iconColor={
          filters.includes('grouped') ? colors.primary : colors.onBackground
        }
      />

      {/* New overflow menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            size={24}
            style={styles.iconButton}
            onPress={() => setMenuVisible(true)}
          />
        }>
        <Menu.Item
          leadingIcon="refresh"
          onPress={() => {
            setMenuVisible(false);
            showResetDialog();
          }}
          title="Reset Models"
        />
      </Menu>
    </View>
  );
});
