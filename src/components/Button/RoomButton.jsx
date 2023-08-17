import React from 'react';
import Button from '.'

const RoomButton = ({ roomName, selected, onClick }) => {
  return (
    <Button
      variant={selected ? 'solid' : 'ghost'}
      onClick={() => onClick(roomName)}
      mb={2}
      w="100%"
    >
      {roomName}
    </Button>
  );
};

export default RoomButton;