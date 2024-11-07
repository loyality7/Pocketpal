import React from 'react';
import {ScrollView, View} from 'react-native';

import {Title, Text, Chip, IconButton, Tooltip} from 'react-native-paper';

import {useTheme} from '../../../../hooks';

import {createStyles} from './styles';

import {HuggingFaceModel, ModelFile} from '../../../../utils/types';
import {
  extractHFModelTitle,
  formatBytes,
  formatNumber,
  timeAgo,
} from '../../../../utils';

interface DetailsViewProps {
  model: HuggingFaceModel;
  onModelBookmark: (model: HuggingFaceModel, file: ModelFile) => void;
  isModelBookmarked: (model: HuggingFaceModel, file: ModelFile) => boolean;
}

export const DetailsView = ({
  model,
  onModelBookmark,
  isModelBookmarked,
}: DetailsViewProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  console.log('model.trendingScore: ', model.trendingScore);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.modelAuthor}>
            {model.author}
          </Text>
          <Tooltip title={model.id}>
            <Text
              ellipsizeMode="middle"
              numberOfLines={1}
              variant="headlineSmall"
              style={styles.modelTitle}>
              {extractHFModelTitle(model.id)}
            </Text>
          </Tooltip>
          <View style={styles.modelStats}>
            <Chip icon="clock" compact style={styles.stat}>
              {timeAgo(model.lastModified)}
            </Chip>
            <Chip icon="download" compact style={styles.stat}>
              {formatNumber(model.downloads, 0)}
            </Chip>
            <Chip icon="heart" compact style={styles.stat}>
              {formatNumber(model.likes, 0)}
            </Chip>
            {model.trendingScore > 20 && (
              <Chip
                icon="trending-up"
                style={styles.stat}
                compact
                mode="outlined">
                🔥
              </Chip>
            )}
          </View>
          <Title style={styles.sectionTitle}>Available GGUF Files</Title>
          {model.siblings.map((file, index) => (
            <View key={index} style={styles.fileCard}>
              <View style={styles.fileContent}>
                <View style={styles.fileInfo}>
                  <Tooltip title={file.rfilename}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="head"
                      style={styles.fileName}>
                      {file.rfilename}
                    </Text>
                  </Tooltip>
                  {file.size && (
                    <Text style={styles.fileSize}>
                      {formatBytes(file.size, 2, false, true)}
                    </Text>
                  )}
                </View>
                <View style={styles.fileActions}>
                  <IconButton
                    icon={
                      isModelBookmarked(model, file)
                        ? 'bookmark'
                        : 'bookmark-outline'
                    }
                    onPress={() => onModelBookmark(model, file)}
                    size={20}
                  />
                  <IconButton icon="download" onPress={() => {}} size={20} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
