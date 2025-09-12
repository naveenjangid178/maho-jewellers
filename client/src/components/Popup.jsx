import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // Check if the popup has already been shown in the current session
    const hasPopupBeenShown = sessionStorage.getItem('popupShown');

    if (!hasPopupBeenShown) {
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Website!</h2>
            <p className="text-gray-600 mb-4">We're glad to have you here. Enjoy browsing!</p>
            <button
              onClick={closePopup}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
