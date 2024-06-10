// import React from 'react';
// import { GoogleLogin } from '@react-oauth/google';
// import { Button } from 'antd';
// import axios from 'axios';

// const GoogleLoginButton = () => {
//   const clientId =
//     '224726940114-e4lkjubonrenj2h04ig1nj6nvf0409og.apps.googleusercontent.com';

//   const onSuccess = async response => {
//     try {
//       const { tokenId } = response;
//       const res = await axios.post('http://localhost:3000/api/google-auth', {
//         token: tokenId,
//       });
//       console.log('Login Success: currentUser:', res.data.userInfo);
//       alert('Logged in successfully, welcome ' + res.data.userInfo.name + '!');
//     } catch (error) {
//       console.error('Login Failed:', error);
//     }
//   };

//   const onFailure = response => {
//     console.error('Login Failed:', response);
//     alert('Failed to login with Google.');
//   };

//   return (
//     <GoogleLogin
//       clientId={clientId}
//       buttonText="Login with Google"
//       onSuccess={onSuccess}
//       onFailure={onFailure}
//       cookiePolicy={'single_host_origin'}
//       render={renderProps => (
//         <Button
//           onClick={renderProps.onClick}
//           disabled={renderProps.disabled}
//           type="primary"
//         >
//           Login with Google
//         </Button>
//       )}
//     />
//   );
// };

// export default GoogleLoginButton;

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import axios from 'axios';

export function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const res = await axios.post(
          'http://localhost:5555/google-auth',
          {},
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        console.log('Login successful:', res.data);
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    onError: error => console.log('Login failed:', error),
  });

  return (
    <Button style={{ width: '100%', height: 55 }} onClick={() => login()}>
      <img
        style={{ width: 35, height: 35 }}
        src="../../public/google_icon.svg"
      />
      Google
    </Button>
  );
}

export default GoogleLoginButton;
