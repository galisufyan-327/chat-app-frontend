import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import UserService from "../../services/plugins/user";
import { useUserContext } from "../../context/useUserContext";
import { useSocket } from "../../hooks/useSocket";

const ChatMessage = ({ message, isCurrentUser }) => (
  <Text>
    <Text as="b">{isCurrentUser ? "You" : message.send_by}:&nbsp;</Text>
    {message.content}
  </Text>
);

const ChatBox = ({ participant }) => {
  const toast = useToast();
  const { userData } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);
  const { socket } = useSocket();

  const fetchMessages = async () => {
    try {
      const response = await UserService.getUserConversationDetails(
        participant.conversation_id
      );

      const { messages = [] } = response.data || {};
      setMessages([...messages]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        sender_id: userData.id,
        content: newMessage,
        send_by: userData.username,
      },
    ];

    setMessages(updatedMessages);
    setNewMessage("");

    try {
      await UserService.sendMessage({
        conversationId: participant.conversation_id,
        senderId: userData.id,
        sendBy: userData.username,
        content: newMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);

      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred during saving message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    clearInterval(pollingInterval);
    setPollingInterval(setInterval(fetchMessages, 4000));

    console.log("participant.conversation_id", participant.conversation_id);

    socket.emit("joinGroupRoom", participant.conversation_id);
    socket?.on("message", (notificationData) => {
      if (notificationData.sender_id !== userData.id) {
        if (messages.find((message) => message.id === notificationData.id))
          return;

        const prevMessages = messages;

        prevMessages.push(notificationData);

        setMessages([...prevMessages]);
      }
    });

    return () => {
      clearInterval(pollingInterval);
    };
  }, [participant]);

  return (
    <Box p={4}>
      <FormLabel>{participant.title}</FormLabel>
      <VStack spacing={4} align="stretch">
        <Box
          p={4}
          bg="gray.100"
          borderRadius="md"
          boxShadow="sm"
          height="700px"
          overflow="auto"
          minHeight="700px"
        >
          {messages.map((socketMessage, index) => (
            <ChatMessage
              key={index}
              message={socketMessage}
              isCurrentUser={socketMessage.sender_id === userData.id}
            />
          ))}
        </Box>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message..."
        />
        <Button colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default ChatBox;
