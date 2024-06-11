import { Button, ConfigProvider } from 'antd';

export function GoogleLoginButton(props: any) {
  return (
    <ConfigProvider
      theme={{
        token: {},
        components: {
          Button: {
            colorPrimaryTextHover: '#000',
            colorPrimaryHover: '#000',
          },
        },
      }}
    >
      <Button {...props} style={{ width: '100%', height: '55px' }}>
        <img
          style={{ width: 40, height: 40 }}
          src="../../public/google_icon.svg"
          alt="Google Login"
        />
        Sign in with Google
      </Button>
    </ConfigProvider>
  );
}

export default GoogleLoginButton;
