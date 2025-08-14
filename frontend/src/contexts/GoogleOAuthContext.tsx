import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '66462752826-fqke7i519nvbedp5h9kq0rhpga60v0p5.apps.googleusercontent.com';

interface GoogleOAuthContextProps {
  children: React.ReactNode;
}

export const GoogleOAuthWrapper: React.FC<GoogleOAuthContextProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthWrapper;
