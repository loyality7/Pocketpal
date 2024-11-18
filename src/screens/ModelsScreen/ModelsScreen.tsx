import React, {useState, useMemo, useContext} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Platform,
  Alert,
  Image,
} from 'react-native';

import {toJS} from 'mobx';
import {v4 as uuidv4} from 'uuid';
import RNFS from 'react-native-fs';
import 'react-native-get-random-values';
import {observer} from 'mobx-react-lite';
import DocumentPicker from 'react-native-document-picker';
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Text,
  Tooltip,
} from 'react-native-paper';

import iconHF from '../../assets/icon-hf.png';
import iconHFLight from '../../assets/icon-hf-light.png';

import {useTheme} from '../../hooks';

import {styles} from './styles';
import {FABGroup} from './FABGroup';
import {ModelCard} from './ModelCard';
import {HFModelSearch} from './HFModelSearch';
import {ModelAccordion} from './ModelAccordion';

import {uiStore, modelStore} from '../../store';

import {L10nContext} from '../../utils';
import {Model, ModelOrigin} from '../../utils/types';

export const ModelsScreen: React.FC = observer(() => {
  const l10n = useContext(L10nContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [hfSearchVisible, setHFSearchVisible] = useState(false);
  const [_, setTrigger] = useState<boolean>(false);
  const {colors} = useTheme();

  const filters = uiStore.pageStates.modelsScreen.filters;
  const setFilters = (value: string[]) => {
    uiStore.setValue('modelsScreen', 'filters', value);
  };
  const FILTER_CONFIG = [
    {
      value: 'hf',
      icon: ({size}) => (
        <Image
          source={iconHFLight}
          style={{
            width: size,
            height: size,
          }}
        />
      ),
      activeIcon: ({size}) => (
        <Image
          source={iconHF}
          style={{
            width: size,
            height: size,
          }}
        />
      ),
      tooltip: l10n.tooltipHf,
    },
    {
      value: 'downloaded',
      icon: 'download',
      activeIcon: 'download-circle',
      tooltip: l10n.tooltipDownloaded,
    },
    {
      value: 'grouped',
      icon: 'layers-outline',
      activeIcon: 'layers',
      tooltip: l10n.tooltipGroupByType,
    },
  ] as const;

  const expandedGroups = uiStore.pageStates.modelsScreen.expandedGroups;

  const onRefresh = async () => {
    setRefreshing(true);
    await modelStore.refreshDownloadStatuses();
    setTrigger(prev => !prev);
    setRefreshing(false);
  };

  const handleAddLocalModel = async () => {
    DocumentPicker.pick({
      type:
        Platform.OS === 'ios' ? 'public.data' : DocumentPicker.types.allFiles,
    })
      .then(async res => {
        let [file] = res;
        if (file) {
          // Assign a default name if file.name is null or undefined
          // Not sure if this can ever happen, though.
          let fileName =
            file.name || file.uri.split('/').pop() || `file_${uuidv4()}`;

          const permanentDir = `${RNFS.DocumentDirectoryPath}/models/local`;
          let permanentPath = `${permanentDir}/${fileName}`;
          if (!(await RNFS.exists(permanentDir))) {
            await RNFS.mkdir(permanentDir);
          }

          if (await RNFS.exists(permanentPath)) {
            const choice = await new Promise<'replace' | 'keep' | 'cancel'>(
              resolve => {
                Alert.alert(
                  l10n.fileAlreadyExists,
                  l10n.fileAlreadyExistsMessage,
                  [
                    {
                      text: l10n.replace,
                      onPress: () => resolve('replace'),
                    },
                    {
                      text: l10n.keepBoth,
                      onPress: () => resolve('keep'),
                    },
                    {
                      text: l10n.cancel,
                      onPress: () => resolve('cancel'),
                      style: 'cancel',
                    },
                  ],
                );
              },
            );

            switch (choice) {
              case 'replace':
                await RNFS.unlink(permanentPath);
                break;
              case 'keep':
                let counter = 1;
                const nameParts = fileName.split('.');
                const ext = nameParts.length > 1 ? nameParts.pop() : '';
                const name = nameParts.join('.');
                do {
                  permanentPath = `${permanentDir}/${name}_${counter}.${ext}`;
                  counter++;
                } while (await RNFS.exists(permanentPath));
                break;
              case 'cancel':
                console.log('File copy cancelled by user');
                return;
            }
          }

          await RNFS.copyFile(file.uri, permanentPath);
          await modelStore.addLocalModel(permanentPath);
          setTrigger(prev => !prev);
        }
      })
      .catch(e => console.log('No file picked, error: ', e.message));
  };

  const activeModelId = toJS(modelStore.activeModel?.id);
  const models = toJS(modelStore.models);

  const filteredAndSortedModels = useMemo(() => {
    let result = models;
    if (filters.includes('downloaded')) {
      result = result.filter(model => model.isDownloaded);
    }
    if (!filters.includes('grouped')) {
      result = result.sort((a, b) => {
        if (a.isDownloaded && !b.isDownloaded) {
          return -1;
        }
        if (!a.isDownloaded && b.isDownloaded) {
          return 1;
        }
        return 0;
      });
    }
    if (filters.includes('hf')) {
      result = result.filter(model => model.origin === ModelOrigin.HF);
    }
    return result;
  }, [models, filters]);

  const groupedModels = useMemo(() => {
    if (!filters.includes('grouped')) {
      return {ungrouped: filteredAndSortedModels};
    }

    return filteredAndSortedModels.reduce((acc, item) => {
      const groupKey =
        item.origin === ModelOrigin.LOCAL || item.isLocal
          ? l10n.localModel
          : item.type || l10n.unknownGroup;

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, Model[]>);
  }, [filteredAndSortedModels, filters, l10n.localModel, l10n.unknownGroup]);

  const toggleGroup = (type: string) => {
    const currentExpandedGroups =
      uiStore.pageStates.modelsScreen.expandedGroups;
    const updatedExpandedGroups = {
      ...currentExpandedGroups,
      [type]: !currentExpandedGroups[type],
    };
    uiStore.setValue('modelsScreen', 'expandedGroups', updatedExpandedGroups);
  };

  const renderGroupHeader = ({item: group}) => {
    const isExpanded = expandedGroups[group.type];
    return (
      <ModelAccordion
        group={group}
        expanded={isExpanded}
        onPress={() => toggleGroup(group.type)}>
        <FlatList
          data={group.items}
          keyExtractor={subItem => subItem.id}
          renderItem={({item: subItem}) => (
            <ModelCard model={subItem} activeModelId={activeModelId} />
          )}
        />
      </ModelAccordion>
    );
  };

  const renderItem = ({item}) => (
    <ModelCard model={item} activeModelId={activeModelId} />
  );

  const flatListModels = Object.keys(groupedModels)
    .map(type => ({
      type,
      items: groupedModels[type],
    }))
    .filter(group => group.items.length > 0);

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

  const renderFilterIcon = ({
    value,
    icon,
    activeIcon,
    tooltip,
  }: (typeof FILTER_CONFIG)[number]) => {
    const isSelected = filters.includes(value);
    return (
      <Tooltip key={value} title={tooltip}>
        <IconButton
          testID={`${value}-filter-button`}
          key={value}
          icon={isSelected ? activeIcon : icon}
          selected={isSelected}
          onPress={() => {
            const newFilters = isSelected
              ? filters.filter(f => f !== value)
              : [...filters, value];
            setFilters(newFilters);
          }}
          mode={isSelected ? 'contained-tonal' : undefined}
          size={24}
          iconColor={isSelected ? colors.primary : colors.onSurfaceVariant}
          style={styles.filterIcon}
        />
      </Tooltip>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.surface}]}>
      <Portal>
        <Dialog
          testID="reset-dialog"
          visible={resetDialogVisible}
          onDismiss={hideResetDialog}>
          <Dialog.Title>{l10n.confirmReset}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.paragraph}>
              This will reset model settings (
              <Text variant="labelMedium">
                'system prompt', 'chat template', 'temperature',
              </Text>
              etc.) to their default configuration.
            </Paragraph>

            <Paragraph style={styles.paragraph}>
              - Your downloaded models will <Text style={styles.bold}>not</Text>{' '}
              be removed.
            </Paragraph>

            <Paragraph style={styles.paragraph}>
              - Your 'Local Models' will remain intact.
            </Paragraph>

            {/*<Paragraph style={styles.paragraph}>
              - This action is <Text style={styles.bold}>irreversible.</Text>
            </Paragraph>*/}
          </Dialog.Content>
          <Dialog.Actions>
            <Button testID="cancel-reset-button" onPress={hideResetDialog}>
              {l10n.cancel}
            </Button>
            <Button testID="proceed-reset-button" onPress={handleReset}>
              {l10n.proceedWithReset}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.filterContainer}>
        {FILTER_CONFIG.map(renderFilterIcon)}
      </View>

      <FlatList
        testID="flat-list"
        contentContainerStyle={styles.listContainer} // Ensure padding for last card
        data={
          filters.includes('grouped') ? flatListModels : filteredAndSortedModels
        }
        keyExtractor={item =>
          filters.includes('grouped') ? item.type : item.id
        }
        extraData={activeModelId}
        renderItem={
          filters.includes('grouped') ? renderGroupHeader : renderItem
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />

      <HFModelSearch
        visible={hfSearchVisible}
        onDismiss={() => setHFSearchVisible(false)}
      />
      <FABGroup
        onAddHFModel={() => setHFSearchVisible(true)}
        onAddLocalModel={handleAddLocalModel}
        onResetModels={showResetDialog}
      />
    </View>
  );
});
