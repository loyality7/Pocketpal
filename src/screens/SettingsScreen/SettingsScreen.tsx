import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';

import {debounce} from 'lodash';
import {observer} from 'mobx-react-lite';
import Slider from '@react-native-community/slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Divider, Switch, Text, Card} from 'react-native-paper';

import {TextInput} from '../../components';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

import {modelStore, uiStore} from '../../store';

import {L10nContext} from '../../utils';
export const SettingsScreen: React.FC = observer(() => {
  const l10n = useContext(L10nContext);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [contextSize, setContextSize] = useState(
    modelStore.n_context.toString(),
  );
  const [isValidInput, setIsValidInput] = useState(true);
  const inputRef = useRef<RNTextInput>(null);

  const debouncedUpdateStore = useRef(
    debounce((value: number) => {
      modelStore.setNContext(value);
    }, 500),
  ).current;

  useEffect(() => {
    setContextSize(modelStore.n_context.toString());
  }, []);

  useEffect(() => {
    return () => {
      debouncedUpdateStore.cancel();
    };
  }, [debouncedUpdateStore]);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
    setContextSize(modelStore.n_context.toString());
    setIsValidInput(true);
  };

  const handleContextSizeChange = (text: string) => {
    setContextSize(text);
    const value = parseInt(text, 10);
    if (!isNaN(value) && value >= modelStore.MIN_CONTEXT_SIZE) {
      setIsValidInput(true);
      debouncedUpdateStore(value);
    } else {
      setIsValidInput(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Model Settings Section */}
          <Card elevation={0} style={styles.card}>
            <Card.Title title={l10n.modelSettingsTitle} />
            <Card.Content>
              <View style={styles.settingItemContainer}>
                <View style={styles.switchContainer}>
                  <View style={styles.textContainer}>
                    <Text variant="titleMedium" style={styles.textLabel}>
                      {l10n.autoOffloadLoad}
                    </Text>
                    <Text variant="labelSmall" style={styles.textDescription}>
                      {l10n.autoOffloadLoadDescription}
                    </Text>
                  </View>
                  <Switch
                    testID="auto-offload-load-switch"
                    value={modelStore.useAutoRelease}
                    onValueChange={value =>
                      modelStore.updateUseAutoRelease(value)
                    }
                  />
                </View>
              </View>
              <Divider />
              {Platform.OS === 'ios' && (
                <View style={styles.settingItemContainer}>
                  <View style={styles.switchContainer}>
                    <View style={styles.textContainer}>
                      <Text variant="titleMedium" style={styles.textLabel}>
                        {l10n.metal}
                      </Text>
                      <Text variant="labelSmall" style={styles.textDescription}>
                        {l10n.metalDescription}
                      </Text>
                    </View>
                    <Switch
                      testID="metal-switch"
                      value={modelStore.useMetal}
                      onValueChange={value => modelStore.updateUseMetal(value)}
                    />
                  </View>
                  <Slider
                    testID="gpu-layers-slider"
                    disabled={!modelStore.useMetal}
                    value={modelStore.n_gpu_layers}
                    onValueChange={value =>
                      modelStore.setNGPULayers(Math.round(value))
                    }
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                    style={styles.nGPUSlider}
                    thumbTintColor={theme.colors.primary}
                    minimumTrackTintColor={theme.colors.primary}
                  />
                  <Text
                    variant="labelSmall"
                    style={[styles.textDescription, {}]}>
                    {l10n.layersOnGPU.replace(
                      '{{gpuLayers}}',
                      modelStore.n_gpu_layers.toString(),
                    )}
                  </Text>
                </View>
              )}
              <Divider />
              <View style={styles.settingItemContainer}>
                <Text variant="titleMedium" style={styles.textLabel}>
                  {l10n.contextSize}
                </Text>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.textInput,
                    !isValidInput && styles.invalidInput,
                  ]}
                  keyboardType="numeric"
                  value={contextSize}
                  onChangeText={handleContextSizeChange}
                  placeholder={l10n.contextSizePlaceholder.replace(
                    '{{minContextSize}}',
                    modelStore.MIN_CONTEXT_SIZE.toString(),
                  )}
                />
                {!isValidInput && (
                  <Text style={styles.errorText}>
                    {l10n.invalidContextSizeError.replace(
                      '{{minContextSize}}',
                      modelStore.MIN_CONTEXT_SIZE.toString(),
                    )}
                  </Text>
                )}
                <Text variant="labelSmall" style={styles.textDescription}>
                  {l10n.modelReloadNotice}
                </Text>
              </View>

              <View style={styles.switchContainer}>
                <View style={styles.textContainer}>
                  <Text variant="titleMedium" style={styles.textLabel}>
                    {l10n.autoNavigateToChat}
                  </Text>
                  <Text variant="labelSmall" style={styles.textDescription}>
                    {l10n.autoNavigateToChatDescription}
                  </Text>
                </View>
                <Switch
                  testID="auto-navigate-to-chat-switch"
                  value={uiStore.autoNavigatetoChat}
                  onValueChange={value => uiStore.setAutoNavigateToChat(value)}
                />
              </View>

              {Platform.OS === 'ios' && (
                <View style={styles.settingItemContainer}>
                  <View style={styles.switchContainer}>
                    <View style={styles.textContainer}>
                      <Text variant="titleMedium" style={styles.textLabel}>
                        {l10n.iOSBackgroundDownload}
                      </Text>
                      <Text variant="labelSmall" style={styles.textDescription}>
                        {l10n.iOSBackgroundDownloadDescription}
                      </Text>
                    </View>
                    <Switch
                      testID="ios-background-download-switch"
                      value={uiStore.iOSBackgroundDownloading}
                      onValueChange={value =>
                        uiStore.setiOSBackgroundDownloading(value)
                      }
                    />
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* UI Settings Section */}
          <Card elevation={0} style={styles.card}>
            <Card.Title title={l10n.uiSettingsTitle} />
            <Card.Content>
              <View style={styles.settingItemContainer}>
                <View style={styles.switchContainer}>
                  <View style={styles.textContainer}>
                    <Text variant="titleMedium" style={styles.textLabel}>
                      Dark Mode
                    </Text>
                    <Text variant="labelSmall" style={styles.textDescription}>
                      Toggle dark mode on or off.
                    </Text>
                  </View>
                  <Switch
                    testID="dark-mode-switch"
                    value={uiStore.colorScheme === 'dark'}
                    onValueChange={value =>
                      uiStore.setColorScheme(value ? 'dark' : 'light')
                    }
                  />
                </View>

                {Platform.OS === 'ios' && (
                  <View style={styles.switchContainer}>
                    <View style={styles.textContainer}>
                      <Text variant="titleMedium" style={styles.textLabel}>
                        {l10n.displayMemoryUsage}
                      </Text>
                      <Text variant="labelSmall" style={styles.textDescription}>
                        {l10n.displayMemoryUsageDescription}
                      </Text>
                    </View>
                    <Switch
                      testID="display-memory-usage-switch"
                      value={uiStore.displayMemUsage}
                      onValueChange={value => uiStore.setDisplayMemUsage(value)}
                    />
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
});
