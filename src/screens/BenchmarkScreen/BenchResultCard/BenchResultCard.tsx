import React from 'react';
import {View} from 'react-native';

import {Card, Text, Button} from 'react-native-paper';

import {useTheme} from '../../../hooks';

import {createStyles} from './styles';
import type {BenchmarkConfig} from '../types';

type BenchmarkResult = {
  config: BenchmarkConfig;
  modelDesc: string;
  modelSize: number;
  modelNParams: number;
  ppAvg: number;
  ppStd: number;
  tgAvg: number;
  tgStd: number;
  timestamp: string;
  modelId: string;
  peakMemoryUsage?: {
    total: number;
    used: number;
    percentage: number;
  };
  wallTimeMs?: number;
};

type Props = {
  result: BenchmarkResult;
  onDelete: (timestamp: string) => void;
};

const formatSize = (bytes: number) =>
  `${(bytes / 1024.0 / 1024.0 / 1024.0).toFixed(2)} GiB`;
const formatParams = (params: number) => `${(params / 1e9).toFixed(2)}B`;

const renderBenchmarkParams = (
  config: BenchmarkConfig,
  styles: ReturnType<typeof createStyles>,
) => (
  <View style={styles.benchmarkParams}>
    <Text variant="bodySmall" style={styles.configLabel}>
      BENCHMARK CONFIGURATION
    </Text>
    <View style={styles.chipContainer}>
      <View style={styles.chip}>
        <Text style={styles.chipText}>PP: {config.pp}</Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.chipText}>TG: {config.tg}</Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.chipText}>PL: {config.pl}</Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.chipText}>Rep: {config.nr}</Text>
      </View>
    </View>
  </View>
);

export const BenchResultCard = ({result, onDelete}: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) {
      return '0 Byte';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Card elevation={0} style={styles.resultCard}>
      <Card.Content>
        <View style={styles.resultHeader}>
          <View style={styles.headerLeft}>
            <Text variant="titleMedium" style={styles.modelDesc}>
              {result.modelDesc}
            </Text>
            <Text variant="bodySmall" style={styles.modelInfo}>
              Size: {formatSize(result.modelSize)} • Params:{' '}
              {formatParams(result.modelNParams)}
            </Text>
          </View>
          <Button
            mode="text"
            onPress={() => onDelete(result.timestamp)}
            icon="delete"
            compact
            style={styles.deleteButton}>
            {''}
          </Button>
        </View>

        {renderBenchmarkParams(result.config, styles)}

        <View style={styles.benchmarkResults}>
          <View style={styles.resultRow}>
            <Text variant="labelSmall" style={styles.resultLabel}>
              Prompt Processing
            </Text>
            <Text variant="bodySmall" style={styles.resultValue}>
              {result.ppAvg.toFixed(2)} ± {result.ppStd.toFixed(2)} t/s
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text variant="labelSmall" style={styles.resultLabel}>
              Token Generation
            </Text>
            <Text variant="bodySmall" style={styles.resultValue}>
              {result.tgAvg.toFixed(2)} ± {result.tgStd.toFixed(2)} t/s
            </Text>
          </View>
          {result.wallTimeMs && (
            <View style={styles.resultRow}>
              <Text variant="labelSmall" style={styles.resultLabel}>
                Total Time
              </Text>
              <Text variant="bodySmall" style={styles.resultValue}>
                {formatDuration(result.wallTimeMs)}
              </Text>
            </View>
          )}
          {result.peakMemoryUsage && (
            <View style={styles.resultRow}>
              <Text variant="labelSmall" style={styles.resultLabel}>
                Peak Memory Usage
              </Text>
              <Text variant="bodySmall" style={styles.resultValue}>
                {formatBytes(result.peakMemoryUsage.used)} /{' '}
                {formatBytes(result.peakMemoryUsage.total)} (
                {result.peakMemoryUsage.percentage.toFixed(1)}%)
              </Text>
            </View>
          )}
        </View>

        <Text variant="bodySmall" style={styles.timestamp}>
          {new Date(result.timestamp).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );
};
