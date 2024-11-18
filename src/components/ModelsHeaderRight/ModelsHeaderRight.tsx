import {Image, View} from 'react-native';
import React, {useContext, useState} from 'react';

import {observer} from 'mobx-react';
import {Menu, IconButton} from 'react-native-paper';

import iconHF from '../../assets/icon-hf.png';
import iconHFLight from '../../assets/icon-hf-light.png';

import {useTheme} from '../../hooks';

import {styles} from './styles';

import {uiStore} from '../../store';

import {L10nContext} from '../../utils';

export const ModelsHeaderRight = observer(() => {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const {colors} = useTheme();

  const l10n = useContext(L10nContext);

  const filters = uiStore.pageStates.modelsScreen.filters;
  const setFilters = (value: string[]) => {
    uiStore.setValue('modelsScreen', 'filters', value);
    setFilterMenuVisible(false);
  };

  const toggleFilter = (filterName: string) => {
    const newFilters = filters.includes(filterName)
      ? filters.filter(f => f !== filterName)
      : [...filters, filterName];
    setFilters(newFilters);
  };

  return (
    <View style={styles.container}>
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
      <IconButton
        icon={filters.includes('grouped') ? 'layers' : 'layers-outline'}
        size={24}
        style={styles.iconButton}
        onPress={() => toggleFilter('grouped')}
        iconColor={
          filters.includes('grouped') ? colors.primary : colors.onBackground
        }
      />
    </View>
  );
});
