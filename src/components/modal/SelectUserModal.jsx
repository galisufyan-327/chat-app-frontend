import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Button from "../Button";
import UserService from "../../services/plugins/user";

function SelectUserModal({
  isNewChatOpen,
  closeNewChat,
  userList,
  handleChange
}) {
  const [selectedUser, setSelectedUser] = useState('');
  const toast = useToast();

  const handleUserSelection = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      
      toast({
        title: "Error",
        description: "Please select a user to continue.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    try {
      await UserService.startNewConversation({
        title: userList.find((user) => user.id === parseInt(selectedUser)).username,
        participants: [selectedUser]
      });

      handleChange()
      closeNewChat();
    } catch (error) {
      console.error("Error starting chat:", error);

      toast({
        title: "Error",
        description:
          error.response?.data?.message || "An error occurred during starting new conversation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isNewChatOpen} onClose={closeNewChat}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start a 1:1 conversation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={2}>
            <Select onChange={handleUserSelection}>
              <option value="">Select a user</option>
              {userList?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Start Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SelectUserModal;
