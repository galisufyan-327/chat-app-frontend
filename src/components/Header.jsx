import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Spacer } from '@chakra-ui/react';
import { useUserContext } from '../context/useUserContext';

const Header = ({ isLoggedIn }) => {
  const { userData } = useUserContext();

  return (
    <Flex padding="1rem" backgroundColor="gray.200">
      <Link to="/">Hello {userData.username}</Link>
      <Spacer />
      {userData ? (
        <Link to="/login">Logout</Link> // Update with the appropriate profile link
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/sign-up">Sign Up</Link>
        </>
      )}
    </Flex>
  );
};

export default Header;
