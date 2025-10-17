import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
  const [privacyHtml, setPrivacyHtml] = useState('');

  useEffect(() => {
    // Fetch the privacy-policy.html file from the public folder
    fetch('/privacy-policy.html')
      .then((response) => response.text())
      .then((data) => {
        setPrivacyHtml(data);
      })
      .catch((error) => console.error('Error fetching privacy policy:', error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className='md:px-12 px-4 py-8' dangerouslySetInnerHTML={{ __html: privacyHtml }} />
    </div>
  );
};

export default PrivacyPolicy;