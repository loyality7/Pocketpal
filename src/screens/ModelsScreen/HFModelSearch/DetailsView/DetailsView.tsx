import React from 'react';
import {ScrollView, View} from 'react-native';

import {Title, Text, Chip, Button, IconButton} from 'react-native-paper';

import {useTheme} from '../../../../hooks';

import {createStyles} from './styles';

import {HuggingFaceModel, ModelFile} from '../../../../utils/types';
import {formatBytes, formatNumber, timeAgo} from '../../../../utils';

interface DetailsViewProps {
  model: HuggingFaceModel;
  onClose: () => void;
  onModelBookmark: (model: HuggingFaceModel, file: ModelFile) => void;
  isModelBookmarked: (model: HuggingFaceModel, file: ModelFile) => boolean;
}

export const DetailsView = ({
  model,
  onClose,
  onModelBookmark,
  isModelBookmarked,
}: DetailsViewProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Title style={styles.modelTitle}>{model.id}</Title>
          <View style={styles.modelStats}>
            <Chip icon="clock" style={styles.stat}>
              {timeAgo(model.lastModified)}
            </Chip>
            <Chip icon="download" style={styles.stat}>
              {formatNumber(model.downloads, 0)}
            </Chip>
            <Chip icon="heart" style={styles.stat}>
              {formatNumber(model.likes, 0)}
            </Chip>
            {model.trendingScore > 20 && (
              <Chip icon="trending-up" style={styles.stat}>
                Trending
              </Chip>
            )}
          </View>
          <Title style={styles.sectionTitle}>Available GGUF Files</Title>
          {model.siblings.map((file, index) => (
            <View key={index} style={styles.fileCard}>
              <View style={styles.fileContent}>
                <View>
                  <Text style={styles.fileName}>{file.rfilename}</Text>
                  {file.size && (
                    <Text style={styles.fileSize}>
                      {`Size: ${formatBytes(file.size, 2, false)}`}
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
                  />
                  <IconButton icon="download" onPress={() => {}} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Button mode="contained" onPress={onClose} style={styles.closeButton}>
        Close
      </Button>
    </View>
  );
};
