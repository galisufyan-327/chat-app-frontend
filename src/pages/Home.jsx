import React, { useEffect, useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import { Avatar, Box, Flex, VStack } from "@chakra-ui/react";
import Button from "../components/Button";
import SelectUserModal from "../components/modal/SelectUserModal";
import SelectGroupModal from "../components/modal/SelectGroupModal";
import UserService from "../services/plugins/user";

const UserList = ({ participants, handleSelectParticipant }) => {
  return (
    <VStack spacing={4} className="w-100 p-40" align="start">
      {participants?.map((user) => (
        <Flex
          key={user.id}
          align="center"
          className="w-100 p-10 cursor-pointer"
          _hover={{
            background: "blue.100",
            borderRadius: "10px"
          }}
          onClick={() => handleSelectParticipant(user)}
        >
          <Avatar size="md" name={user.title} src={user.imageUrl} />
          <Box ml={2}>{user.title}</Box>
        </Flex>
      ))}
    </VStack>
  );
};

function Home() {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupChatOpen, setIsNewGroupChatOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [userLists, setUserList] = useState([]);
  const [participants, setParticipants] = useState([]);

  const openNewChat = () => {
    setIsNewChatOpen(true);
  };

  const closeNewChat = () => {
    setIsNewChatOpen(false);
  };

  const openNewGroupChat = () => {
    setIsNewGroupChatOpen(true);
  };

  const closeNewGroupChat = () => {
    setIsNewGroupChatOpen(false);
  };

  const handleUserSelection = () => {
    getUserConverstaion()
  };

  const handleGroupSelection = (data) => {
    getUserConverstaion();
  };

  const getUserList = async () => {
    try {
      const response = await UserService.getUserList();
      const { users } = response.data;

      setUserList(users);
    } catch (error) {
      console.log("API error:", error);
    }
  };

  const getUserConverstaion = async () => {
    try {
      const response = await UserService.getUserConversations();
      const { conversations } = response.data;

      setParticipants(conversations);
    } catch (error) {
      console.log("API error:", error);
    }
  }

  const handleSelectParticipant = (participant) => {
    setSelectedParticipant(participant);
  }

  useEffect(() => {
    getUserList();
    getUserConverstaion();
  }, []);

  return (
    <div className="mt-4">
      <Flex>
        <Box width="30%" borderRight="1px solid #ccc">
          {/* <VStack spacing={4}> */}
          <Flex gap={2} justify={"center"}>
            <Button p={4} onClick={openNewChat}>
              New Chat
            </Button>
            <Button p={4} onClick={openNewGroupChat}>
              New Group Chat
            </Button>
          </Flex>
          {/* </VStack> */}

          <VStack p={4} spacing={2} align="start" mt="auto">
            <UserList
              participants={participants}
              handleSelectParticipant={handleSelectParticipant}
            />
          </VStack>
        </Box>
        <Box width="70%">
          {selectedParticipant ? (
            <ChatBox participant={selectedParticipant} />
          ) : null}
        </Box>

        <SelectUserModal
          isNewChatOpen={isNewChatOpen}
          closeNewChat={closeNewChat}
          userList={userLists}
          handleChange={(userId) => handleUserSelection(userId)}
        />

        <SelectGroupModal
          isNewGroupChatOpen={isNewGroupChatOpen}
          closeNewGroupChat={closeNewGroupChat}
          userList={userLists}
          handleGroupSelection={handleGroupSelection}
        />
      </Flex>
    </div>
  );
}

export default Home;
