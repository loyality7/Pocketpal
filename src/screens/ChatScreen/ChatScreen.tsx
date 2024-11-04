import React, {useRef, ReactNode} from 'react';

import {observer} from 'mobx-react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Bubble, ChatView} from '../../components';
import {LoadingBubble} from '../../components/LoadingBubble';

import {useChatSession} from '../../hooks';

import {ModelNotLoadedMessage} from './ModelNotLoadedMessage';

import {modelStore, chatSessionStore} from '../../store';

import {L10nContext} from '../../utils';
import {MessageType} from '../../utils/types';
import {user, assistant} from '../../utils/chat';

const renderBubble = ({
  child,
  message,
  nextMessageInGroup,
}: {
  child: ReactNode;
  message: MessageType.Any;
  nextMessageInGroup: boolean;
}) => {
  // Check for our special loading message
  if (message.id === 'loading-indicator') {
    return <LoadingBubble />;
  }
  return (
    <Bubble
      child={child}
      message={message}
      nextMessageInGroup={nextMessageInGroup}
    />
  );
};

export const ChatScreen: React.FC = observer(() => {
  const context = modelStore.context;
  const currentMessageInfo = useRef<{createdAt: number; id: string} | null>(
    null,
  );
  const l10n = React.useContext(L10nContext);
  const baseMessages: MessageType.Any[] =
    chatSessionStore.currentSessionMessages;

  const {handleSendPress, handleStopPress, inferencing, isStreaming} =
    useChatSession(context, currentMessageInfo, baseMessages, user, assistant);

  // Add loading message if inferencing but not yet streaming
  const messages = React.useMemo(() => {
    if (!inferencing || isStreaming) {
      return baseMessages;
    }
    return [
      {
        id: 'loading-indicator',
        type: 'text',
        text: '',
        author: assistant,
      } as MessageType.Text,
      ...baseMessages,
    ];
  }, [baseMessages, inferencing, isStreaming]);

  return (
    <SafeAreaProvider>
      <ChatView
        customBottomComponent={
          !context && !modelStore.isContextLoading
            ? () => <ModelNotLoadedMessage />
            : undefined
        }
        renderBubble={renderBubble}
        messages={messages}
        onSendPress={handleSendPress}
        onStopPress={handleStopPress}
        user={user}
        isStopVisible={inferencing}
        textInputProps={{
          editable: !!context && !inferencing,
          value: inferencing ? '' : undefined,
          placeholder: !context
            ? modelStore.isContextLoading
              ? l10n.loadingModel
              : l10n.modelNotLoaded
            : l10n.typeYourMessage,
        }}
      />
    </SafeAreaProvider>
  );
});
