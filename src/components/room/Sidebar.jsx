import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import RoomButton from '../Button/RoomButton'

const Sidebar = ({ selectedRoom, onRoomChange }) => {
  const rooms = ['General', 'Random'];

  return (
    <Box w="20%" p={4} bg="gray.200">
      <Heading size="md" mb={4}>
        Rooms
      </Heading>
      {rooms.map((roomName) => (
        <RoomButton
          key={roomName}
          roomName={roomName}
          selected={selectedRoom === roomName}
          onClick={onRoomChange}
        />
      ))}
    </Box>
  );
};

export default Sidebar;
