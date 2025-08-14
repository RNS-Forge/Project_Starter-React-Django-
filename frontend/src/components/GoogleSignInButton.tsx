import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: 'signin' | 'signup_with' | 'continue_with' | 'signin_with';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  width?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  text = 'signin_with',
  theme = 'outline',
  size = 'large',
  width = '100%'
}) => {
  const { googleLogin } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        onError?.('No credential received from Google');
        return;
      }

      const response = await googleLogin(credentialResponse.credential);
      
      if (response.success) {
        onSuccess?.();
      } else {
        onError?.(response.message);
      }
    } catch (error: unknown) {
      console.error('Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed';
      onError?.(errorMessage);
    }
  };

  const handleError = () => {
    onError?.('Google login failed');
  };

  return (
    <div style={{ width }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        theme={theme}
        size={size}
        width={width === '100%' ? window.innerWidth - 40 : parseInt(width)}
        logo_alignment="left"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleSignInButton;
