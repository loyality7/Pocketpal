import {StyleSheet} from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    searchBar: {
      margin: 10,
      borderRadius: 16,
      height: 40,
    },
  });
