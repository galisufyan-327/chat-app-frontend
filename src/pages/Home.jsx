import React, { useEffect, useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import { Box, Flex, VStack  } from "@chakra-ui/react";
import Button from "../components/Button";
import SelectUserModal from "../components/modal/SelectUserModal";
import SelectGroupModal from "../components/modal/SelectGroupModal";
import UserService from "../services/plugins/user";
import UserList from "../components/user/UserList";

function Home() {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupChatOpen, setIsNewGroupChatOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [userLists, setUserList] = useState([]);
  const [initialRender, setInitialRender] = useState(false);
  const [conversations, setConversations] = useState([]);

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
    getUserConverstaion();
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

      if (!initialRender) {
        setSelectedParticipant(conversations[0]);
        setInitialRender(true);
      }
      setConversations(conversations);
    } catch (error) {
      console.log("API error:", error);
    }
  };

  const handleExistingUser = (conversation) => {
    setSelectedParticipant(conversation)    
    closeNewChat()
  }

  const handleSelectParticipant = (participant) => {
    setSelectedParticipant(participant);
  };

  useEffect(() => {
    getUserList();
    getUserConverstaion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-4">
      <Flex>
        <Box width="30%" h="600px" overflow="auto" borderRight="1px solid #ccc">
          <Flex gap={2} justify={"center"}>
            <Button p={4} onClick={openNewChat}>
              New Chat
            </Button>
            <Button p={4} onClick={openNewGroupChat}>
              New Group Chat
            </Button>
          </Flex>

          <VStack p={4} spacing={2} align="start" mt="auto">
            <UserList
              conversations={conversations}
              handleSelectParticipant={handleSelectParticipant}
            />
          </VStack>
        </Box>
        <Box width="70%">
          {selectedParticipant ? (
            <ChatBox participant={selectedParticipant} closeChatBox={() => setSelectedParticipant(null)} />
          ) : null}
        </Box>

        <SelectUserModal
          isNewChatOpen={isNewChatOpen}
          closeNewChat={closeNewChat}
          conversations={conversations}
          userList={userLists}
          handleExistingUser={handleExistingUser}
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
