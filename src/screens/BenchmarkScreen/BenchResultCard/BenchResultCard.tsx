import React from 'react';
import {View} from 'react-native';

import {Card, Text} from 'react-native-paper';

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
};

type Props = {
  result: BenchmarkResult;
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

export const BenchResultCard = ({result}: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card elevation={1} style={styles.resultCard}>
      <Card.Content>
        <View style={styles.resultHeader}>
          <Text variant="titleMedium" style={styles.modelDesc}>
            {result.modelDesc}
          </Text>
          <Text variant="bodySmall" style={styles.modelInfo}>
            Size: {formatSize(result.modelSize)} • Params:{' '}
            {formatParams(result.modelNParams)}
          </Text>
        </View>

        {renderBenchmarkParams(result.config, styles)}

        <View style={styles.benchmarkResults}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Prompt Processing</Text>
            <Text style={styles.resultValue}>
              {result.ppAvg.toFixed(2)} ± {result.ppStd.toFixed(2)} t/s
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Token Generation</Text>
            <Text style={styles.resultValue}>
              {result.tgAvg.toFixed(2)} ± {result.tgStd.toFixed(2)} t/s
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" style={styles.timestamp}>
          {new Date(result.timestamp).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );
};
