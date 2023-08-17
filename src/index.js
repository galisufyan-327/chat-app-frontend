import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/useUserContext";
import {  MultiSelectTheme } from 'chakra-multiselect'


const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme
  }
})

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <App />
        </UserProvider>
      </ChakraProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
