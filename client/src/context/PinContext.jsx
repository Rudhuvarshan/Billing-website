import React, { createContext, useState, useContext, useEffect } from 'react';

const PinContext = createContext(null);
const DEFAULT_PIN = '123456';

export const PinProvider = ({ children }) => {
  const [pin, setPin] = useState(DEFAULT_PIN);

  useEffect(() => {
    const storedPin = localStorage.getItem('appPin');
    if (storedPin) {
      setPin(storedPin);
    } else {
      localStorage.setItem('appPin', DEFAULT_PIN);
    }
  }, []);

  const verifyPin = (pinToVerify) => {
    return pinToVerify === pin;
  };

  const updatePin = (newPin) => {
    localStorage.setItem('appPin', newPin);
    setPin(newPin);
  };

  const value = { verifyPin, updatePin };

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
};

export const usePin = () => {
  return useContext(PinContext);
};