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
      Config: {config.label}
    </Text>
    <View style={styles.paramRow}>
      <Text style={styles.paramLabel}>PP: {config.pp}</Text>
      <Text style={styles.paramLabel}>TG: {config.tg}</Text>
      <Text style={styles.paramLabel}>PL: {config.pl}</Text>
      <Text style={styles.paramLabel}>Rep: {config.nr}</Text>
    </View>
  </View>
);

export const BenchResultCard = ({result}: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card elevation={0} style={styles.resultCard}>
      <Card.Content>
        <View style={styles.resultHeader}>
          <Text variant="titleSmall" style={styles.modelDesc}>
            {result.modelDesc}
          </Text>
          <Text variant="bodySmall" style={styles.modelInfo}>
            Size: {formatSize(result.modelSize)} | Params:{' '}
            {formatParams(result.modelNParams)}
          </Text>
        </View>

        <View style={styles.resultDetails}>
          {renderBenchmarkParams(result.config, styles)}

          <View style={styles.benchmarkResults}>
            <View style={styles.resultRow}>
              <Text>
                PP: {result.ppAvg.toFixed(2)} ± {result.ppStd.toFixed(2)} t/s
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text>
                TG: {result.tgAvg.toFixed(2)} ± {result.tgStd.toFixed(2)} t/s
              </Text>
            </View>
          </View>
        </View>
        <Text variant="bodySmall" style={styles.timestamp}>
          {new Date(result.timestamp).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );
};
