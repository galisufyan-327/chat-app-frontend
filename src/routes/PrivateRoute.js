import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { useUserContext } from '../context/useUserContext'; // Import the UserContext
import Header from '../components/Header';

const PrivateRoute = ({ element: Element }) => {
  const { userData, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <Box position="fixed" top="0" left="0" width="100%" height="100%" zIndex="9999" background="rgba(255, 255, 255, 0.8)">
        <Center height="100vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Box>
    );
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Element />
    </>
  );
};

export default PrivateRoute;
