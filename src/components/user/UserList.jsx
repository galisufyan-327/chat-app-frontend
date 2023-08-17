import { Avatar, Box, Flex, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { useUserContext } from "../../context/useUserContext";

const UserList = ({ conversations, handleSelectParticipant }) => {
  const { socket } = useSocket();
  const { userData } = useUserContext();
  const [conversationList, setConversationsList] = useState([]);

  useEffect(() => {
    setConversationsList(conversations);
  }, [conversations]);

  socket?.on("new-conversation", (notificationData) => {
    console.log(notificationData, conversationList, userData);

    const isEligible = notificationData?.participants.every(
      (participant) => participant.user_id !== userData.id
    );

    if (isEligible) return;

    const list = conversationList;

    if (list.find((con) => con.id === notificationData.id)) return

    list.push(notificationData);

    setConversationsList([...list]);
  });

  return (
    <VStack spacing={4} className="w-100 p-40" minH={"400px"} align="start">
      {conversations?.map((user) => (
        <Flex
          key={user.id}
          align="center"
          className="w-100 p-10 cursor-pointer"
          _hover={{
            background: "blue.100",
            borderRadius: "10px",
          }}
          onClick={() => handleSelectParticipant(user)}
        >
          <Avatar
            size="md"
            name={
              user.type === "group"
                ? user.title
                : user.participants.find(
                    (participant) => participant.user_id !== userData.id
                  ).username
            }
            src={user.imageUrl}
          />
          <Box ml={2}>
            {user.type === "group"
              ? user.title
              : user.participants.find(
                  (participant) => participant.user_id !== userData.id
                ).username}
          </Box>
        </Flex>
      ))}
    </VStack>
  );
};

export default UserList;
