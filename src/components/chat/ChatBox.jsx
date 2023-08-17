import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  FormLabel,
  useToast,
  CloseButton
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

const ChatBox = ({ participant, closeChatBox }) => {
  const toast = useToast();
  const { userData } = useUserContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);
  const { socket } = useSocket();
  const messageContainerRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await UserService.getUserConversationDetails(
        participant.id
      );

      const { messages: receivedMessages } = response.data || {};
      receivedMessages && setMessages([...receivedMessages]);
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

    setMessages([...updatedMessages]);
    setNewMessage("");

    try {
      await UserService.sendMessage({
        conversationId: participant.id,
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

  socket?.on("message", (notificationData) => {
    if (notificationData.sender_id !== userData.id) {
      const prevMessages = messages;
      if (prevMessages.find((message) => message.id === notificationData.id))
        return;

      console.log(prevMessages, "smdfmasdf", messages)
      prevMessages.push(notificationData);

      setMessages([...prevMessages]);
    }
  });

  useEffect(() => {
    fetchMessages();

    console.log("coming here");

    clearInterval(pollingInterval);
    setPollingInterval(setInterval(fetchMessages, 4000));

    participant && socket.emit("joinGroupRoom", participant.id + '-conversations');
   
    return () => {
      clearInterval(pollingInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participant]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="flex-end">
        <CloseButton onClick={closeChatBox} size="sm" />
      </Box>
      <FormLabel>
        {participant.type === "group"
          ? participant.title
          : participant.participants.find(
              (participant) => participant.user_id !== userData.id
            ).username}
      </FormLabel>
      <VStack spacing={4} align="stretch">
        <Box
          ref={messageContainerRef}
          p={4}
          bg="gray.100"
          borderRadius="md"
          boxShadow="sm"
          height="300px"
          overflow="auto"
          minHeight="400px"
        >
          {messages.map((socketMessage, index) => (
            <ChatMessage
              key={index}
              message={socketMessage}
              isCurrentUser={socketMessage.sender_id === userData.id}
            />
          ))}
          {/* <div ref={messageContainerRef} /> */}
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
