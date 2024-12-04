import {
  MD3DarkTheme,
  DefaultTheme as PaperLightTheme,
} from 'react-native-paper';

import {Colors, Theme} from './types';

import {getThemeColorsAsArray} from '.';

const lightColors: Colors = {
  ...PaperLightTheme.colors,
  primary: '#202124',
  onPrimary: '#FFFFFF',
  primaryContainer: '#DEE0E6',
  onPrimaryContainer: '#2D2F33',
  secondary: '#3669F5',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#ADBCE6',
  onSecondaryContainer: '#0B1633',
  tertiary: '#018786',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#9EE6E5',
  onTertiaryContainer: '#013332',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#E6ACA9',
  onErrorContainer: '#330B09',
  background: '#fcfcfc',
  onBackground: '#333333',
  surface: '#fcfcfc',
  onSurface: '#333333',
  surfaceVariant: '#e4e4e6',
  onSurfaceVariant: '#646466',
  outline: '#969799',

  outlineVariant: '#a1a1a1',
  receivedMessageDocumentIcon: PaperLightTheme.colors.primary,
  sentMessageDocumentIcon: PaperLightTheme.colors.onSurface,
  userAvatarImageBackground: 'transparent',
  userAvatarNameColors: getThemeColorsAsArray(PaperLightTheme),
  searchBarBackground: 'rgba(118, 118, 128, 0.12)', // iOS light mode searchbar
  menuBackground: '#fcfcfc',
  menuBackdrop: 'rgba(255, 255, 255, 0.27)',
  menuSeparator: 'rgba(17, 17, 17, 0.5)',
  menuGroupSeparator: 'rgba(0, 0, 0, 0.08)',
  menuText: '#000000',
  menuDangerText: '#B3261E',
};

export const lightTheme: Theme = {
  ...PaperLightTheme,
  borders: {
    inputBorderRadius: 20,
    messageBorderRadius: 20,
  },
  colors: lightColors,
  fonts: {
    ...PaperLightTheme.fonts,
    dateDividerTextStyle: {
      color: lightColors.onSurface,
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 16,
      opacity: 0.4,
    },
    emptyChatPlaceholderTextStyle: {
      color: lightColors.onSurface,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    inputTextStyle: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    receivedMessageBodyTextStyle: {
      color: lightColors.onPrimary,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    receivedMessageCaptionTextStyle: {
      color: lightColors.onSurfaceVariant,
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
    receivedMessageLinkDescriptionTextStyle: {
      color: lightColors.onPrimary,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    receivedMessageLinkTitleTextStyle: {
      color: lightColors.onPrimary,
      fontSize: 16,
      fontWeight: '800',
      lineHeight: 22,
    },
    sentMessageBodyTextStyle: {
      color: lightColors.onSurface,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    sentMessageCaptionTextStyle: {
      color: lightColors.onSurfaceVariant,
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
    sentMessageLinkDescriptionTextStyle: {
      color: lightColors.onSurface,
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    sentMessageLinkTitleTextStyle: {
      color: lightColors.onSurface,
      fontSize: 16,
      fontWeight: '800',
      lineHeight: 22,
    },
    userAvatarTextStyle: {
      color: lightColors.onSurface,
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 16,
    },
    userNameTextStyle: {
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 16,
    },
  },
  insets: {
    messageInsetsHorizontal: 20,
    messageInsetsVertical: 10,
  },
};

const darkColors: Colors = {
  ...MD3DarkTheme.colors,
  primary: '#DADDE6',
  onPrimary: '#44464C',
  primaryContainer: '#5B5E66',
  onPrimaryContainer: '#DEE0E6',
  secondary: '#95ABE6',
  onSecondary: '#11214C',
  secondaryContainer: '#162C66',
  onSecondaryContainer: '#ADBCE6',
  tertiary: '#80E6E4',
  onTertiary: '#014C4C',
  tertiaryContainer: '#016665',
  onTertiaryContainer: '#9EE6E5',
  error: '#E69490',
  onError: '#4C100D',
  errorContainer: '#661511',
  onErrorContainer: '#E6ACA9',
  background: '#333333',
  onBackground: '#e5e5e6',
  surface: '#333333',
  onSurface: '#e5e5e6',
  surfaceVariant: '#646466',
  onSurfaceVariant: '#e3e4e6',
  outline: '#b0b1b3',

  outlineVariant: '#a1a1a1',
  receivedMessageDocumentIcon: MD3DarkTheme.colors.primary,
  sentMessageDocumentIcon: MD3DarkTheme.colors.onSurface,
  userAvatarImageBackground: 'transparent',
  userAvatarNameColors: getThemeColorsAsArray(MD3DarkTheme),
  searchBarBackground: 'rgba(28, 28, 30, 0.92)', // iOS dark mode searchbar
  menuBackground: 'rgba(45, 45, 45, 0.39)',
  menuBackdrop: 'rgba(30, 30, 30, 0.27)',
  menuSeparator: 'rgba(255, 255, 255, 0.15)',
  menuGroupSeparator: 'rgba(255, 255, 255, 0.08)',
  menuText: '#FFFFFF',
  menuDangerText: '#E69490',
};

export const darkTheme: Theme = {
  ...MD3DarkTheme,
  borders: lightTheme.borders,
  colors: darkColors,
  fonts: {
    ...lightTheme.fonts,
    dateDividerTextStyle: {
      ...lightTheme.fonts.dateDividerTextStyle,
      color: MD3DarkTheme.colors.onSurface,
    },
    receivedMessageBodyTextStyle: {
      ...lightTheme.fonts.receivedMessageBodyTextStyle,
      color: MD3DarkTheme.colors.onPrimary,
    },
    receivedMessageCaptionTextStyle: {
      ...lightTheme.fonts.receivedMessageCaptionTextStyle,
      color: MD3DarkTheme.colors.onSurfaceVariant,
    },
    receivedMessageLinkDescriptionTextStyle: {
      ...lightTheme.fonts.receivedMessageLinkDescriptionTextStyle,
      color: MD3DarkTheme.colors.onPrimary,
    },
    receivedMessageLinkTitleTextStyle: {
      ...lightTheme.fonts.receivedMessageLinkTitleTextStyle,
      color: MD3DarkTheme.colors.onPrimary,
    },
  },
  insets: lightTheme.insets,
};
