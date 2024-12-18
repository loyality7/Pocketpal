import {View, ScrollView} from 'react-native';
import React, {useState, useCallback} from 'react';

import {v4 as uuidv4} from 'uuid';
import {observer} from 'mobx-react';
import RNDeviceInfo from 'react-native-device-info';
import Slider from '@react-native-community/slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Button, Card, ActivityIndicator, Icon} from 'react-native-paper';

import {submitBenchmark} from '../../api/benchmark';

import {Menu, Dialog, Checkbox} from '../../components';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';
import {DeviceInfoCard} from './DeviceInfoCard';
import {BenchResultCard} from './BenchResultCard';

import {modelStore, benchmarkStore, uiStore} from '../../store';

import type {DeviceInfo, Model} from '../../utils/types';
import {BenchmarkConfig, BenchmarkResult} from '../../utils/types';

const DEFAULT_CONFIGS: BenchmarkConfig[] = [
  {pp: 512, tg: 128, pl: 1, nr: 3, label: 'Default'},
  {pp: 128, tg: 32, pl: 1, nr: 3, label: 'Fast'},
];

const BENCHMARK_PARAMS_METADATA = {
  pp: {
    validation: {min: 64, max: 512},
    descriptionKey: 'Number of prompt processing tokens',
  },
  tg: {
    validation: {min: 32, max: 512},
    descriptionKey: 'Number of text generation tokens',
  },
  pl: {
    validation: {min: 1, max: 4},
    descriptionKey: 'Pipeline parallel size',
  },
  nr: {
    validation: {min: 1, max: 10},
    descriptionKey: 'Number of repetitions',
  },
};

export const BenchmarkScreen: React.FC = observer(() => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<BenchmarkConfig>(
    DEFAULT_CONFIGS[0],
  );
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [localSliderValues, setLocalSliderValues] = useState<{
    [key: string]: number;
  }>({});
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [pendingDeleteTimestamp, setPendingDeleteTimestamp] = useState<
    string | null
  >(null);
  const [deleteAllConfirmVisible, setDeleteAllConfirmVisible] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [pendingShareResult, setPendingShareResult] =
    useState<BenchmarkResult | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const styles = createStyles(theme);

  const handleModelSelect = async (model: Model) => {
    setShowModelMenu(false);
    if (model.id !== modelStore.activeModelId) {
      try {
        await modelStore.initContext(model);
        setSelectedModel(model);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Model initialization error:', error);
        }
      }
    } else {
      setSelectedModel(model);
    }
  };

  const handleSliderChange = (name: string, value: number) => {
    setSelectedConfig(prev => ({
      ...prev,
      [name]: value,
      label: 'Custom',
    }));
  };

  const trackPeakMemoryUsage = async () => {
    try {
      const total = await RNDeviceInfo.getTotalMemory();
      const used = await RNDeviceInfo.getUsedMemory();
      const percentage = (used / total) * 100;
      return {total, used, percentage};
    } catch (error) {
      console.error('Failed to fetch memory stats:', error);
      return null;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stopBenchmark = async () => {
    if (modelStore.context) {
      try {
        // TODO: This is not working for bench.
        await modelStore.context.stopCompletion();
      } catch (error) {
        console.error('Error stopping benchmark:', error);
      }
    }
  };

  const runBenchmark = async () => {
    if (!modelStore.context || !modelStore.activeModel) {
      return;
    }

    setIsRunning(true);
    let peakMemoryUsage: NonNullable<
      BenchmarkResult['peakMemoryUsage']
    > | null = null;
    let memoryCheckInterval: ReturnType<typeof setInterval> | undefined;
    const startTime = Date.now();

    try {
      // Start memory tracking
      memoryCheckInterval = setInterval(async () => {
        const currentUsage = await trackPeakMemoryUsage();
        if (
          currentUsage &&
          (!peakMemoryUsage ||
            currentUsage.percentage > peakMemoryUsage.percentage)
        ) {
          peakMemoryUsage = currentUsage;
        }
      }, 1000);

      const {modelDesc, modelSize, modelNParams, ppAvg, ppStd, tgAvg, tgStd} =
        await modelStore.context.bench(
          selectedConfig.pp,
          selectedConfig.tg,
          selectedConfig.pl,
          selectedConfig.nr,
        );

      const wallTimeMs = Date.now() - startTime;

      const result: BenchmarkResult = {
        config: selectedConfig,
        modelDesc,
        modelSize,
        modelNParams,
        ppAvg,
        ppStd,
        tgAvg,
        tgStd,
        timestamp: new Date().toISOString(),
        modelId: modelStore.activeModel.id,
        modelName: modelStore.activeModel.name,
        oid: modelStore.activeModel.hfModelFile?.oid,
        rfilename: modelStore.activeModel.hfModelFile?.rfilename,
        filename: modelStore.activeModel.filename,
        peakMemoryUsage: peakMemoryUsage || undefined,
        wallTimeMs,
        uuid: uuidv4(),
      };

      benchmarkStore.addResult(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Benchmark error:', error);
      }
    } finally {
      clearInterval(memoryCheckInterval);
      setIsRunning(false);
    }
  };

  const handlePresetSelect = (config: BenchmarkConfig) => {
    setSelectedConfig(config);
    setLocalSliderValues({});
  };

  const handleDeleteResult = (timestamp: string) => {
    setPendingDeleteTimestamp(timestamp);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteTimestamp) {
      benchmarkStore.removeResult(pendingDeleteTimestamp);
    }
    setDeleteConfirmVisible(false);
    setPendingDeleteTimestamp(null);
  };

  const handleDeleteAll = () => {
    setDeleteAllConfirmVisible(true);
  };

  const handleConfirmDeleteAll = () => {
    benchmarkStore.clearResults();
    setDeleteAllConfirmVisible(false);
  };

  const handleDeviceInfo = useCallback((info: DeviceInfo) => {
    setDeviceInfo(info);
  }, []);

  const handleShareResult = async (result: BenchmarkResult) => {
    if (!deviceInfo) {
      throw new Error('Device information not available');
    }
    if (result.submitted) {
      throw new Error('This benchmark has already been submitted');
    }
    try {
      const response = await submitBenchmark(deviceInfo, result);
      console.log('Benchmark submitted successfully:', response);
      benchmarkStore.markAsSubmitted(result.uuid);
    } catch (error) {
      console.error('Failed to submit benchmark:', error);
      throw error;
    }
  };

  const handleSharePress = async (result: BenchmarkResult) => {
    if (!uiStore.benchmarkShareDialog.shouldShow) {
      await handleShareResult(result);
      return;
    }
    setPendingShareResult(result);
    setShowShareDialog(true);
  };

  const handleConfirmShare = async () => {
    if (dontShowAgain) {
      uiStore.setBenchmarkShareDialogPreference(false);
    }
    setIsSubmitting(true);
    try {
      if (pendingShareResult) {
        await handleShareResult(pendingShareResult);
      }
      setShowShareDialog(false);
      setPendingShareResult(null);
    } catch (error) {
      setShareError(
        error instanceof Error ? error.message : 'Failed to share benchmark',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModelSelector = () => (
    <Menu
      visible={showModelMenu}
      onDismiss={() => setShowModelMenu(false)}
      anchorPosition="bottom"
      anchor={
        <Button
          mode="outlined"
          onPress={() => setShowModelMenu(true)}
          contentStyle={styles.modelSelectorContent}
          icon={({color}) => (
            <Icon source="chevron-down" size={24} color={color} />
          )}>
          {selectedModel?.name ||
            modelStore.activeModel?.name ||
            'Select Model'}
        </Button>
      }>
      {modelStore.availableModels.map(model => (
        <Menu.Item
          key={model.id}
          onPress={() => handleModelSelect(model)}
          label={model.name}
          leadingIcon={
            model.id === modelStore.activeModelId ? 'check' : undefined
          }
        />
      ))}
    </Menu>
  );

  const renderSlider = ({
    name,
    step = 1,
  }: {
    name: keyof typeof BENCHMARK_PARAMS_METADATA;
    step?: number;
  }) => (
    <View style={styles.settingItem}>
      <Text variant="labelSmall" style={styles.settingLabel}>
        {name.toUpperCase()}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={BENCHMARK_PARAMS_METADATA[name].validation.min}
        maximumValue={BENCHMARK_PARAMS_METADATA[name].validation.max}
        step={step}
        value={localSliderValues[name] ?? selectedConfig[name]}
        onValueChange={value => {
          setLocalSliderValues(prev => ({...prev, [name]: value}));
        }}
        onSlidingComplete={value => {
          handleSliderChange(name, value);
        }}
        thumbTintColor={theme.colors.primary}
        minimumTrackTintColor={theme.colors.primary}
      />
      <View style={styles.sliderDescriptionContainer}>
        <Text style={styles.description}>
          {BENCHMARK_PARAMS_METADATA[name].descriptionKey}
        </Text>
        <Text style={styles.settingValue}>
          {Number.isInteger(step)
            ? Math.round(
                localSliderValues[name] ?? selectedConfig[name],
              ).toString()
            : (localSliderValues[name] ?? selectedConfig[name]).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderAdvancedSettings = () => (
    <Dialog
      visible={showAdvancedDialog}
      onDismiss={() => setShowAdvancedDialog(false)}
      title="Advanced Settings"
      actions={[
        {
          label: 'Done',
          onPress: () => setShowAdvancedDialog(false),
        },
      ]}>
      <View>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Test Profile
        </Text>
        <View style={styles.presetContainer}>
          {DEFAULT_CONFIGS.map((config, index) => (
            <Button
              key={index}
              mode={selectedConfig === config ? 'contained' : 'outlined'}
              onPress={() => handlePresetSelect(config)}
              style={styles.presetButton}>
              {config.label}
            </Button>
          ))}
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Custom Parameters
        </Text>
        <Text variant="bodySmall" style={styles.advancedDescription}>
          Fine-tune the benchmark parameters for specific testing scenarios.
        </Text>
        <View style={styles.slidersContainer}>
          {renderSlider({name: 'pp'})}
          {renderSlider({name: 'tg'})}
          {renderSlider({name: 'nr'})}
        </View>
      </View>
    </Dialog>
  );

  const renderWarningMessage = () => (
    <View style={styles.warningContainer}>
      <Text variant="bodySmall" style={styles.warningText}>
        Note: Test could run for up to 2-3 minutes for larger models and cannot
        be interrupted once started.
      </Text>
    </View>
  );

  const renderShareDialog = () => (
    <Dialog
      visible={showShareDialog}
      onDismiss={() => {
        setShowShareDialog(false);
        setPendingShareResult(null);
      }}
      title="Share Benchmark Results"
      scrollable
      actions={[
        {
          label: 'Cancel',
          onPress: () => {
            setShowShareDialog(false);
            setPendingShareResult(null);
          },
          disabled: isSubmitting,
        },
        {
          label: isSubmitting ? 'Sharing...' : 'Share',
          onPress: handleConfirmShare,
          mode: 'contained',
          loading: isSubmitting,
          disabled: isSubmitting,
        },
      ]}>
      <Text variant="bodyMedium" style={styles.dialogSection}>
        Shared data includes:
      </Text>
      <View style={styles.dialogList}>
        <Text variant="bodyMedium">• Device specs & model info</Text>
        <Text variant="bodyMedium">• Performance metrics</Text>
      </View>

      <Button
        mode="text"
        onPress={() => setShowDetails(!showDetails)}
        icon={showDetails ? 'chevron-up' : 'chevron-down'}
        style={styles.detailsButton}>
        {showDetails ? 'Hide Raw Data' : 'View Raw Data'}
      </Button>

      {showDetails && pendingShareResult && deviceInfo && (
        <View style={styles.detailsContainer}>
          <Text variant="bodySmall" style={styles.codeBlock}>
            {JSON.stringify(
              {
                deviceInfo,
                benchmark: pendingShareResult,
              },
              null,
              2,
            )}
          </Text>
        </View>
      )}

      {shareError && <Text style={styles.errorText}>{shareError}</Text>}

      <View style={styles.checkboxContainer}>
        <Checkbox
          checked={dontShowAgain}
          onPress={() => setDontShowAgain(!dontShowAgain)}
        />
        <Text
          variant="bodySmall"
          style={styles.checkboxLabel}
          onPress={() => setDontShowAgain(!dontShowAgain)}>
          Don't show this message again
        </Text>
      </View>
    </Dialog>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Card elevation={0} style={styles.card}>
          <Card.Content>
            <DeviceInfoCard onDeviceInfo={handleDeviceInfo} />
            {renderModelSelector()}

            {modelStore.loadingModel ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Initializing model...</Text>
              </View>
            ) : (
              <>
                {!modelStore.context ? (
                  <Text style={styles.warning}>
                    Please select and initialize a model first
                  </Text>
                ) : (
                  <>
                    <Button
                      mode="text"
                      onPress={() => setShowAdvancedDialog(true)}
                      icon="tune"
                      style={styles.advancedButton}>
                      Advanced Settings
                    </Button>

                    {!isRunning && renderWarningMessage()}

                    <Button
                      mode="contained"
                      onPress={runBenchmark}
                      disabled={isRunning}
                      style={styles.button}>
                      {isRunning ? 'Running Test...' : 'Start Test'}
                    </Button>

                    {isRunning && (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.warningText}>
                          Please keep this screen open until the test completes
                        </Text>
                      </View>
                    )}

                    {renderAdvancedSettings()}
                  </>
                )}
              </>
            )}

            {benchmarkStore.results.length > 0 && (
              <View style={styles.resultsCard}>
                <View style={styles.resultsHeader}>
                  <Text variant="titleSmall">Test Results</Text>
                  <Button
                    mode="text"
                    onPress={handleDeleteAll}
                    icon="delete"
                    compact>
                    Clear All
                  </Button>
                </View>
                {benchmarkStore.results.map((result, index) => (
                  <View key={index} style={styles.resultItem}>
                    <BenchResultCard
                      result={result}
                      onDelete={handleDeleteResult}
                      onShare={handleSharePress}
                    />
                  </View>
                ))}
              </View>
            )}

            <Dialog
              visible={deleteConfirmVisible}
              onDismiss={() => setDeleteConfirmVisible(false)}
              title="Delete Result"
              actions={[
                {
                  label: 'Cancel',
                  onPress: () => setDeleteConfirmVisible(false),
                },
                {
                  label: 'Delete',
                  onPress: handleConfirmDelete,
                },
              ]}>
              <Text>
                Are you sure you want to delete this benchmark result?
              </Text>
            </Dialog>

            <Dialog
              visible={deleteAllConfirmVisible}
              onDismiss={() => setDeleteAllConfirmVisible(false)}
              title="Clear All Results"
              actions={[
                {
                  label: 'Cancel',
                  onPress: () => setDeleteAllConfirmVisible(false),
                },
                {
                  label: 'Clear All',
                  onPress: handleConfirmDeleteAll,
                },
              ]}>
              <Text>
                Are you sure you want to delete all benchmark results?
              </Text>
            </Dialog>

            {renderShareDialog()}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
});
