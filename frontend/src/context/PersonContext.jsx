// src/context/PersonContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const PersonContext = createContext();

// Provider component
export const PersonProvider = ({ children }) => {
  const [persons, setPersons] = useState([]);

  // Fetch all persons from your backend
  const fetchPersons = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/person'); // Adjust the URL as needed
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  // Fetch persons when the component mounts
  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <PersonContext.Provider value={{ persons, setPersons }}>
      {children}
    </PersonContext.Provider>
  );
};
