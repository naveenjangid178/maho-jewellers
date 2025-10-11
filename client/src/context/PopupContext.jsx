import React, { createContext, useContext, useState } from 'react';

// Create a context for popup visibility
const PopupContext = createContext();

export const usePopup = () => {
  return useContext(PopupContext);
};

// Create a provider to manage popup state
export const PopupProvider = ({ children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <PopupContext.Provider value={{ isPopupVisible, setIsPopupVisible }}>
      {children}
    </PopupContext.Provider>
  );
};
