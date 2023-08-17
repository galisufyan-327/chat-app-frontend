import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Button from "../Button";
import { MultiSelect } from 'chakra-multiselect'
import { yupResolver } from "@hookform/resolvers/yup";
import UserService from "../../services/plugins/user";

const schema = yup.object().shape({
  groupName: yup.string().required("Group name is required"),
});

function SelectGroupModal({
  isNewGroupChatOpen,
  closeNewGroupChat,
  handleGroupSelection,
  userList,
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toast = useToast();

  const onSubmit = async (data) => {
    const selectedUserIds = data.selectedUsers.map((username) => {
      const user = userList.find((user) => user.username === username);
      return user ? user.id : null;
    }).filter(Boolean);

    if (!selectedUserIds.length) {
      toast({
        title: "Error",
        description: "Please select at least one user to continue.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    try {
      await UserService.startNewConversation({
        title: data.groupName,
        participants: selectedUserIds,
        type: 'group'
      });

      handleGroupSelection(data);
      closeNewGroupChat();
      reset({});
    } catch (error) {
      console.error("Error starting group chat:", error);
      // Handle API call error, e.g., show an error message
    }
  };

  return (
    <Modal isOpen={isNewGroupChatOpen} onClose={closeNewGroupChat}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={2}>
              <FormControl isInvalid={errors.groupName}>
                <FormLabel>Group Name</FormLabel>
                <Controller
                  name="groupName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter your group name" />
                  )}
                />
                <FormErrorMessage>
                  {errors.groupName && errors.groupName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Select Users</FormLabel>
                <Controller
                  name="selectedUsers"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      options={userList?.map((user) => ({
                        label: `${user.username}`,
                        value: `${user.username}`,
                      }))}
                    />
                  )}
                />
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            Start Group Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SelectGroupModal;
