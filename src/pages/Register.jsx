import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthService from '../services/plugins/auth'
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { signUpSchema } from '../schema';
import { useUserContext } from '../context/useUserContext';

const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const toast = useToast();
  const { setUserData } = useUserContext();

  const navigate = useNavigate();

  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.signUp(data);
      const { data: user } = response.data;

      localStorage.setItem("accessToken", user.access_token);
      localStorage.setItem("refreshToken", user.refresh_token);

      setUserData(user);
      toast({
        title: 'Account Created',
        description: 'Your account have been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.message || 'An error occurred while signing up.');
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "An error occurred during login.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <VStack spacing={4} width="300px">
        <FormControl isInvalid={errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            {...register('name')}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            {...register('email')}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register('password')}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        {apiError && (
          <Text color="red.500" textAlign="center">
            {apiError}
          </Text>
        )}
        <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
          Sign Up
        </Button>
        <Text>
          Already have an account?{' '}
          <Link to="/login" color="blue.500" onClick={() => navigate('/login')}>
            Login
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;
