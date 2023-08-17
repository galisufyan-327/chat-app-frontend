import React, { createContext, useContext, useState, useEffect } from 'react';
import UserService from '../services/plugins/user';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserService.personalInfo();
        const { data: user } = response.data;

        setUserData(user);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  const contextValue = {
    userData,
    isLoading,
    setUserData
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
