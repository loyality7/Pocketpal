import {View, Linking} from 'react-native';
import React, {useState} from 'react';

import {Card, Text, Button, Tooltip} from 'react-native-paper';

import {useTheme} from '../../../hooks';

import {createStyles} from './styles';

import {formatBytes} from '../../../utils';
import {BenchmarkResult} from '../../../utils/types';

type Props = {
  result: BenchmarkResult;
  onDelete: (timestamp: string) => void;
  onShare: (result: BenchmarkResult) => Promise<void>;
};

const formatSize = (bytes: number) =>
  `${(bytes / 1024.0 / 1024.0 / 1024.0).toFixed(2)} GiB`;
const formatParams = (params: number) => `${(params / 1e9).toFixed(2)}B`;

export const BenchResultCard = ({result, onDelete, onShare}: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onShare(result);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit benchmark',
      );
    } finally {
      setIsSubmitting(false);
    }
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

  const openLeaderboard = () => {
    Linking.openURL(
      'https://huggingface.co/spaces/a-ghorbani/ai-phone-leaderboard',
    );
  };

  return (
    <Card elevation={0} style={styles.resultCard}>
      <Card.Content>
        <View style={styles.resultHeader}>
          <View style={styles.headerLeft}>
            <Text variant="titleSmall" style={styles.modelName}>
              {result.modelName}
            </Text>
            <Text style={styles.modelMeta}>
              {formatSize(result.modelSize)} •{' '}
              {formatParams(result.modelNParams)} params
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

        <View style={styles.configBar}>
          <Text variant="labelSmall">Config</Text>
          <Text style={styles.configText}>
            PP: {result.config.pp} • TG: {result.config.tg} • PL:{' '}
            {result.config.pl} • Rep: {result.config.nr}
          </Text>
        </View>

        <View style={styles.resultsContainer}>
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>
                {result.ppAvg.toFixed(2)}
                <Text style={styles.resultUnit}> t/s</Text>
              </Text>
              <Text style={styles.resultLabel}>Prompt Processing</Text>
              <Text style={styles.resultStd}>±{result.ppStd.toFixed(2)}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>
                {result.tgAvg.toFixed(2)}
                <Text style={styles.resultUnit}> t/s</Text>
              </Text>
              <Text style={styles.resultLabel}>Token Generation</Text>
              <Text style={styles.resultStd}>±{result.tgStd.toFixed(2)}</Text>
            </View>
          </View>

          {(result.wallTimeMs || result.peakMemoryUsage) && (
            <View style={styles.resultRow}>
              {result.wallTimeMs && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultValue}>
                    {formatDuration(result.wallTimeMs)}
                  </Text>
                  <Text style={styles.resultLabel}>Total Time</Text>
                </View>
              )}
              {result.peakMemoryUsage && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultValue}>
                    {result.peakMemoryUsage.percentage.toFixed(1)}%
                  </Text>
                  <Text style={styles.resultLabel}>Peak Memory</Text>
                  <Text style={styles.resultStd}>
                    {formatBytes(result.peakMemoryUsage.used, 0)} /{' '}
                    {formatBytes(result.peakMemoryUsage.total, 0)}
                  </Text>
                </View>
              )}
            </View>
          )}
          <Text style={styles.timestamp}>
            {new Date(result.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.footer}>
          {result.submitted ? (
            <View style={styles.shareContainer}>
              <Text variant="bodySmall" style={styles.submittedText}>
                ✓ Shared to{' '}
                <Text onPress={openLeaderboard} style={styles.leaderboardLink}>
                  AI Phone Leaderboard ↗
                </Text>
              </Text>
            </View>
          ) : !result.oid ? (
            <Tooltip title="Local model results cannot be shared">
              <Text variant="bodySmall" style={styles.disabledText}>
                Cannot share
              </Text>
            </Tooltip>
          ) : result.config.label === 'Custom' ? (
            <Tooltip title="Custom benchmark results cannot be shared">
              <Text variant="bodySmall" style={styles.disabledText}>
                Cannot share
              </Text>
            </Tooltip>
          ) : (
            <View style={styles.actionContainer}>
              <Button
                mode="outlined"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                icon="share"
                compact
                style={styles.submitButton}>
                Submit to Leaderboard
              </Button>
              <Text
                variant="bodySmall"
                onPress={openLeaderboard}
                style={styles.leaderboardLink}>
                View leaderboard ↗
              </Text>
            </View>
          )}
        </View>

        {submitError && <Text style={styles.errorText}>{submitError}</Text>}
      </Card.Content>
    </Card>
  );
};
