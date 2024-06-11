import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
// import { GoogleLogin } from 'react-google-login';
import { Button } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const clientId =
  '224726940114-e4lkjubonrenj2h04ig1nj6nvf0409og.apps.googleusercontent.com';
const redirectUri = 'http://localhost:5173/oauth2callback'; // Убедитесь, что этот URI добавлен в список разрешенных в Google Console
const responseType = 'code';
const scope = 'https://www.googleapis.com/auth/userinfo.email';
const accessType = 'offline';

const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(
  clientId
)}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&response_type=${responseType}&scope=${encodeURIComponent(
  scope
)}&access_type=${accessType}`;

export function GoogleLoginButton() {
  let [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  }, [searchParams]);

  // const login = useGoogleLogin({
  //   onSuccess: async (tokenResponse: TokenResponse) => {
  //     try {
  //       const res = await axios.post('http://localhost:5555/google-auth', {}, {
  //         headers: {
  //           Authorization: `Bearer ${tokenResponse.access_token}`,
  //         },
  //       });
  //       // console.log('Login successful:', res.data);
  //       // alert(`Logged in successfully! Welcome ${res.data.user.name}.`);
  //     } catch (error) {
  //       console.error('Login error:', error);
  //       // alert('Login failed, please try again.');
  //     }
  //   },
  //   onError: error => {
  //     console.log('Login failed:', error);
  //     // alert('Login failed, please try again.');
  //   },
  // });

  const exchangeCodeForToken = async (code: any) => {
    try {
      const res = await axios.post(
        'http://localhost:5555/google-auth',
        {},
        {
          headers: {
            Authorization: `Bearer ${code}`,
          },
        }
      );
      console.log('Login successful:', res.data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    // <Button onClick={() => login()} style={{ width: '100%', height: 55 }}>
    //   <img style={{ width: 40, height: 40 }} src='../../public/google_icon.svg' alt='Google Login' />
    //   Sign in with Google
    // </Button>
    <Button
      onClick={() => (window.location.href = authUrl)}
      style={{ width: '100%', height: 55 }}
    >
      <img
        style={{ width: 40, height: 40 }}
        src="../../public/google_icon.svg"
        alt="Google Login"
      />
      Sign in with Google
    </Button>
  );
}

export default GoogleLoginButton;

// import {
//   GoogleLogin,
//   GoogleLoginResponse,
//   GoogleLoginResponseOffline,
// } from 'react-google-login';
// import { Button } from 'antd';
// import axios from 'axios';

// export function GoogleLoginButton() {
//   const clientId =
//     '224726940114-e4lkjubonrenj2h04ig1nj6nvf0409og.apps.googleusercontent.com';

//   const handleLoginSuccess = async (
//     response: GoogleLoginResponse | GoogleLoginResponseOffline
//   ) => {
//     if ('tokenId' in response) {
//       const { tokenId } = response;
//       try {
//         const res = await axios.post(
//           'http://localhost:5555/google-auth',
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${tokenId}`,
//             },
//           }
//         );
//         console.log('Login successful:', res.data);
//         alert(`Logged in successfully! Welcome ${res.data.user.name}.`);
//       } catch (error) {
//         console.error('Login error:', error);
//         alert('Login failed, please try again.');
//       }
//     } else {
//       console.log('Received offline token, which is not handled.');
//     }
//   };

//   const handleLoginFailure = (error: any) => {
//     console.log('Login failed:', error);
//     alert('Login failed, please try again.');
//   };

//   return (
//     <GoogleLogin
//       clientId={clientId}
//       buttonText="Sign in with Google"
//       onSuccess={handleLoginSuccess}
//       onFailure={handleLoginFailure}
//       cookiePolicy={'single_host_origin'}
//       render={renderProps => (
//         <Button
//           onClick={renderProps.onClick}
//           disabled={renderProps.disabled}
//           style={{ width: '100%', height: 55 }}
//         >
//           Sign in with Google 🚀
//         </Button>
//       )}
//     />
//   );
// }

// export default GoogleLoginButton;
