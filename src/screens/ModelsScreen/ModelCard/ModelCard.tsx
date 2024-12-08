import React, {useCallback, useState} from 'react';
import {Alert, Linking, View, Image, ScrollView} from 'react-native';

import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  Card,
  ProgressBar,
  Button,
  IconButton,
  Text,
  Paragraph,
  TouchableRipple,
  HelperText,
  ActivityIndicator,
  Snackbar,
  Dialog,
  Portal,
} from 'react-native-paper';

import {Divider} from '../../../components';

import {useTheme, useMemoryCheck, useStorageCheck} from '../../../hooks';

import {createStyles} from './styles';
import {ModelSettings} from '../ModelSettings';

import {uiStore, modelStore} from '../../../store';

import {chatTemplates} from '../../../utils/chat';
import {getModelDescription, L10nContext} from '../../../utils';
import {Model, ModelOrigin, RootDrawerParamList} from '../../../utils/types';

type ChatScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

interface ModelCardProps {
  model: Model;
  activeModelId?: string;
  onFocus?: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = observer(
  ({model, activeModelId, onFocus}) => {
    const l10n = React.useContext(L10nContext);
    const theme = useTheme();
    const styles = createStyles(theme);

    const navigation = useNavigation<ChatScreenNavigationProp>();

    const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);

    const {memoryWarning, shortMemoryWarning} = useMemoryCheck(model);
    const {isOk: storageOk, message: storageNOkMessage} =
      useStorageCheck(model);

    const isActiveModel = activeModelId === model.id;
    const isDownloaded = model.isDownloaded;
    const isDownloading = modelStore.isDownloading(model.id);
    const isHfModel = model.origin === ModelOrigin.HF;

    const handleSettingsUpdate = useCallback(
      (name: string, value: any) => {
        const chatTemplateConfig =
          name === 'name'
            ? chatTemplates[value]
            : {...model.chatTemplate, [name]: value};
        modelStore.updateModelChatTemplate(model.id, chatTemplateConfig);
      },
      [model.id, model.chatTemplate],
    );

    const handleCompletionSettingsUpdate = useCallback(
      (name: string, value: any) => {
        modelStore.updateCompletionSettings(model.id, {
          ...model.completionSettings,
          [name]: value,
        });
      },
      [model.id, model.completionSettings],
    );

    const handleDelete = useCallback(() => {
      if (model.isDownloaded) {
        Alert.alert(
          'Delete Model',
          'Are you sure you want to delete this downloaded model?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              onPress: async () => {
                await modelStore.deleteModel(model);
              },
            },
          ],
        );
      }
    }, [model]);

    const handleReset = useCallback(() => {
      modelStore.resetModelChatTemplate(model.id);
      modelStore.resetCompletionSettings(model.id);
    }, [model.id]);

    const openHuggingFaceUrl = useCallback(() => {
      if (model.hfUrl) {
        Linking.openURL(model.hfUrl).catch(err => {
          console.error('Failed to open URL:', err);
          setSnackbarVisible(true);
        });
      }
    }, [model.hfUrl]);

    const handleRemove = useCallback(() => {
      Alert.alert(
        'Remove Model',
        'Are you sure you want to remove this model from the list?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => modelStore.removeModelFromList(model),
          },
        ],
      );
    }, [model]);

    const handleOpenSettings = useCallback(() => {
      setSettingsModalVisible(true);
    }, []);

    const handleCloseSettings = useCallback(() => {
      setSettingsModalVisible(false);
    }, []);

    const renderDownloadOverlay = () => (
      <View>
        {!storageOk && (
          <HelperText
            testID="storage-error-text"
            type="error"
            visible={!storageOk}
            padding="none"
            style={styles.storageErrorText}>
            {storageNOkMessage}
          </HelperText>
        )}
        <View style={styles.overlayButtons}>
          {isHfModel && (
            <Button
              testID="remove-model-button"
              icon="delete-outline"
              mode="text"
              textColor={theme.colors.error}
              onPress={handleRemove}
              style={styles.removeButton}>
              Remove
            </Button>
          )}
          {storageOk && (
            <Button
              testID="download-button"
              icon="download"
              mode="text"
              onPress={() => modelStore.checkSpaceAndDownload(model.id)}
              disabled={!storageOk}
              textColor={theme.colors.secondary}
              style={styles.downloadButton}>
              Download
            </Button>
          )}
        </View>
      </View>
    );

    const renderModelLoadButton = () => {
      if (
        modelStore.isContextLoading &&
        modelStore.loadingModel?.id === model.id
      ) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              testID="loading-indicator"
              animating={true}
              color={theme.colors.primary}
            />
          </View>
        );
      }

      const handlePress = () => {
        if (isActiveModel) {
          modelStore.manualReleaseContext();
        } else {
          modelStore
            .initContext(model)
            .then(() => {
              console.log('initialized');
            })
            .catch(e => {
              console.log(`Error: ${e}`);
            });
          if (uiStore.autoNavigatetoChat) {
            navigation.navigate('Chat');
          }
        }
      };

      return (
        <Button
          testID={isActiveModel ? 'offload-button' : 'load-button'}
          icon={isActiveModel ? 'eject' : 'play-circle-outline'}
          mode="text"
          onPress={handlePress}
          style={styles.actionButton}>
          {isActiveModel ? l10n.offload : l10n.load}
        </Button>
      );
    };

    const handleWarningPress = () => {
      setSnackbarVisible(true);
    };

    return (
      <>
        <Card
          elevation={0}
          style={[
            styles.card,
            {backgroundColor: theme.colors.surface},
            isActiveModel && {backgroundColor: theme.colors.tertiaryContainer},
            {borderColor: theme.colors.primary},
          ]}>
          {isHfModel && (
            <Image
              source={require('../../../assets/icon-hf.png')}
              style={styles.hfBadge}
            />
          )}
          <View style={styles.cardInner}>
            <View style={styles.cardContent}>
              <View style={styles.headerRow}>
                <View style={styles.modelInfoContainer}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.modelName]}>{model.name}</Text>

                    {model.hfUrl && (
                      <IconButton
                        testID="open-huggingface-url"
                        icon="open-in-new"
                        size={14}
                        iconColor={theme.colors.onSurfaceVariant}
                        onPress={openHuggingFaceUrl}
                        style={styles.hfButton}
                      />
                    )}
                  </View>
                  <Text style={styles.modelDescription}>
                    {getModelDescription(model, isActiveModel, modelStore)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Display warning icon if there's a memory warning */}
            {shortMemoryWarning && isDownloaded && (
              <TouchableRipple
                testID="memory-warning-button"
                onPress={handleWarningPress}
                style={styles.warningContainer}>
                <View style={styles.warningContent}>
                  <IconButton
                    icon="alert-circle-outline"
                    iconColor={theme.colors.error}
                    size={20}
                    style={styles.warningIcon}
                  />
                  <Text style={styles.warningText}>{shortMemoryWarning}</Text>
                </View>
              </TouchableRipple>
            )}

            {isDownloading && (
              <>
                <ProgressBar
                  testID="download-progress-bar"
                  progress={modelStore.getDownloadProgress(model.id)}
                  color={theme.colors.tertiary}
                  style={styles.progressBar}
                />
                {model.downloadSpeed && (
                  <Paragraph style={styles.downloadSpeed}>
                    {model.downloadSpeed}
                  </Paragraph>
                )}
              </>
            )}

            <Divider style={styles.divider} />
            {isDownloaded ? (
              <Card.Actions style={styles.actions}>
                <Button
                  testID="delete-button"
                  icon="delete"
                  mode="text"
                  compact
                  textColor={theme.colors.error}
                  onPress={() => handleDelete()}
                  style={styles.actionButton}>
                  {l10n.delete}
                </Button>
                <Button
                  testID="settings-button"
                  icon="tune"
                  mode="text"
                  compact
                  onPress={handleOpenSettings}
                  style={styles.actionButton}>
                  Settings
                </Button>
                {renderModelLoadButton()}
              </Card.Actions>
            ) : isDownloading ? (
              <Card.Actions style={styles.actions}>
                <View style={styles.overlayButtons}>
                  <Button
                    testID="cancel-button"
                    icon="close"
                    mode="text"
                    textColor={theme.colors.error}
                    onPress={() => modelStore.cancelDownload(model.id)}>
                    {l10n.cancel}
                  </Button>
                </View>
              </Card.Actions>
            ) : (
              renderDownloadOverlay()
            )}
          </View>
        </Card>
        {/* Snackbar to show full memory warning */}
        <Snackbar
          testID="memory-warning-snackbar"
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_MEDIUM}
          action={{
            label: l10n.dismiss,
            onPress: () => {
              setSnackbarVisible(false);
            },
          }}>
          {memoryWarning}
        </Snackbar>
        {/* Settings Modal */}
        <Portal>
          <Dialog
            visible={settingsModalVisible}
            onDismiss={handleCloseSettings}
            style={styles.settingsDialog}>
            <Dialog.Title style={styles.dialogTitle}>
              Model Settings
            </Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              <ScrollView style={styles.dialogScrollArea}>
                <ModelSettings
                  chatTemplate={model.chatTemplate}
                  completionSettings={model.completionSettings}
                  isActive={isActiveModel}
                  onChange={handleSettingsUpdate}
                  onCompletionSettingsChange={handleCompletionSettingsUpdate}
                  onFocus={onFocus}
                />
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleCloseSettings}>Cancel</Button>
              <Button onPress={handleReset}>Reset</Button>
              <Button
                mode="contained"
                onPress={() => {
                  handleCloseSettings();
                }}>
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </>
    );
  },
);
