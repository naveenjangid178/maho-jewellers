// src/components/PhoneLogin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const PhoneLogin = ({closePopup}) => {
  const [step, setStep] = useState(1); // Step 1: Phone, Step 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default fallback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get user's location to determine country code
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        const code = res.data.country_calling_code; // e.g. +91
        setCountryCode(code);
      } catch (error) {
        console.warn('Could not fetch location, using default country code.');
      }
    };

    fetchCountryCode();
  }, []);

  const handleSendOtp = async () => {
    if (phone.length < 6) {
      return setMessage('Please enter a valid phone number');
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
        phone: `${countryCode}${phone}`,
      });
      setStep(2);
      setMessage('OTP sent successfully');
    } catch (error) {
      setMessage('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return setMessage('OTP must be 6 digits');
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify`, {
        phone: `${countryCode}${phone}`,
        otp,
      });
      setMessage('OTP verified successfully');
      localStorage.setItem("user", res.data.user._id)
      localStorage.setItem("phone", `${countryCode}${phone}`)
      closePopup();
      // TODO: Redirect user or store token, etc.
    } catch (error) {
      setMessage('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded mt-4 shadow relative">
      <h2 className="text-xl font-semibold mb-4">
        {step === 1 ? 'Login with Phone' : 'Verify OTP'}
      </h2>

      {message && <p className="mb-4 text-sm text-center text-red-600">{message}</p>}

      {step === 1 && (
        <div className="space-y-4">
          <label className="block">
            <div className="flex items-center mt-1">
              <span className="px-3 py-2 border border-r-0 rounded-l">
                {countryCode}
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 p-2 border rounded-r outline-none"
              />
            </div>
          </label>

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded hover:bg-blue-700"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600">Enter OTP</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="6-digit OTP"
              className="w-full p-2 border rounded"
            />
          </label>

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => setStep(1)}
            className="text-sm text-gray-500 underline block text-center"
          >
            Go back
          </button>
        </div>
      )}
      <button
        onClick={closePopup}
        className="cursor-pointer font-bold absolute top-0 right-4"
      >
        <X className='text-red-500 hover:text-red-700' />
      </button>
    </div>
  );
};

export default PhoneLogin;