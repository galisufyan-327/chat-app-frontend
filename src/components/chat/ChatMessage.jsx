import React from 'react';
import { Text } from '@chakra-ui/react';

const ChatMessage = ({ userName, message }) => {
  return (
    <Text mb={2}>
      <Text as='b' mr={2}>
        {userName}:
      </Text>
      {message}
    </Text>
  );
};

export default ChatMessage;