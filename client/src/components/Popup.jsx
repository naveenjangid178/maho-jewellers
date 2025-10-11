import React, { useState, useEffect } from 'react';
import PhoneLogin from './PhoneLogin';
import { X } from 'lucide-react';
import { usePopup } from '../context/PopupContext';

const Popup = () => {
  const {isPopupVisible, setIsPopupVisible} = usePopup();

  useEffect(() => {
    // Check if the popup has already been shown in the current session
    const hasPopupBeenShown = sessionStorage.getItem('popupShown');
    const user = localStorage.getItem('phone')

    if (!hasPopupBeenShown && !user) {
      // Set a timeout to show the popup after 5 seconds
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
        sessionStorage.setItem('popupShown', 'true'); // Mark the popup as shown
      }, 5000); // 5000ms = 5 seconds

      // Clean up the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-100">
          <div className="bg-transparent backdrop-blur-2xl rounded-lg shadow-black shadow-xs max-w-sm w-full text-center">
            <PhoneLogin closePopup={closePopup} />
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
