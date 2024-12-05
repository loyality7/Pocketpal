import {useCallback} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {MessageType, User} from '../utils/types';
import {chatSessionStore} from '../store';

interface UseMessageActionsProps {
  user: User;
  messages: MessageType.Any[];
  handleSendPress: (message: MessageType.PartialText) => Promise<void>;
}

export const useMessageActions = ({
  user,
  messages,
  handleSendPress,
}: UseMessageActionsProps) => {
  const handleCopy = useCallback((message: MessageType.Text) => {
    if (message.type === 'text') {
      Clipboard.setString(message.text.trim());
    }
  }, []);

  const handleEdit = useCallback(
    async (message: MessageType.Text, newText: string) => {
      if (message.type !== 'text' || message.author.id !== user.id) {
        return;
      }

      // Remove all messages after this message (exclusive)
      chatSessionStore.removeMessagesFromId(message.id, false);

      // Send the new message
      await handleSendPress({text: newText, type: 'text'});
    },
    [handleSendPress, user.id],
  );

  const handleTryAgain = useCallback(
    async (message: MessageType.Text) => {
      if (message.type !== 'text') {
        return;
      }

      // If it's the user's message, resubmit it
      if (message.author.id === user.id) {
        // Remove all messages from this point (inclusive)
        const messageText = message.text;
        chatSessionStore.removeMessagesFromId(message.id, true);
        await handleSendPress({text: messageText, type: 'text'});
      } else {
        // If it's the assistant's message, find and resubmit the last user message
        const messageIndex = messages.findIndex(msg => msg.id === message.id);
        const previousMessage = messages
          .slice(messageIndex + 1)
          .find(msg => msg.author.id === user.id && msg.type === 'text') as
          | MessageType.Text
          | undefined;

        if (previousMessage && previousMessage.text) {
          const messageText = previousMessage.text;
          chatSessionStore.removeMessagesFromId(previousMessage.id, true);
          await handleSendPress({text: messageText, type: 'text'});
        }
      }
    },
    [messages, handleSendPress, user.id],
  );

  return {
    handleCopy,
    handleEdit,
    handleTryAgain,
  };
};
