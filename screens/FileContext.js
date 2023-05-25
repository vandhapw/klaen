import React, { createContext, useContext } from 'react';

// Create a new context
const FileContext = createContext();

// Create a custom hook to access the context
export const useFileContext = () => useContext(FileContext);

// Create a provider component to wrap your app
export const FileProvider = ({ children }) => {
    console.log('file provider')
  const receiveFile = async (data) => {
    try {
      // Extract the file content from the received data
      const { filePath } = data;
      console.log(data, 'data')

      // Perform further operations with the file, e.g., read as JSON
      // You can use appropriate libraries like 'react-native-fs' or 'xlsx' to handle the file
      console.log('Received file path:', filePath);
      
      // Update the file value in the context
      // You can modify this logic to store and access the value as needed
    } catch (error) {
      console.error('Error receiving file:', error);
    }
  };

  return (
    <FileContext.Provider value={{ receiveFile }}>
      {children}
    </FileContext.Provider>
  );
};
