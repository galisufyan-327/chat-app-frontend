import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schema";
import AuthService from "../services/plugins/auth";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { setUserData } = useUserContext();

  const toast = useToast();

  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.login(data);
      const { data: user } = response.data;

      localStorage.setItem("accessToken", user.access_token);
      localStorage.setItem("refreshToken", user.refresh_token);


      setUserData(user);
      toast({
        title: 'Login',
        description: 'You have been successfully logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate("/");
    } catch (error) {
      console.log("API error:", error);
      setApiError(
        error?.response?.data?.message || "An error occurred during login."
      );

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
        <FormControl isInvalid={errors.email}>
          <FormLabel>Email address</FormLabel>
          <Input type="email" {...register("email")} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormLabel>Password</FormLabel>
          <Input type="password" {...register("password")} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        {apiError && (
          <Text color="red.500" textAlign="center">
            {apiError}
          </Text>
        )}
        <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
          Login
        </Button>
        <Text>
          Don't have an account?{' '}
          <Link to="/sign-up" color="blue.500" onClick={() => navigate('/sign-up')}>
            Sign up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginPage;
