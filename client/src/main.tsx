import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Roboto, sans-serif',
        },
        components: {
          Layout: {
            siderBg: 'linear-gradient(0deg, #be4bdb 5%, #9775fa 95%)',
            headerHeight: 64,
            headerPadding: 0,
            headerColor: '#f0f2f5',
            headerBg: 'linear-gradient(270deg, #be4bdb 5%, #9775fa 95%)',
          },
          Menu: {
            lineType: 'line',
            colorBgTextHover: '#BE4BDB',
            itemActiveBg: '#7900d2',
            colorBgTextActive: '#7900d2',
            colorText: '#f0f2f5',
          },
          Button: {
            colorPrimary: 'linear-gradient(270deg, #be4bdb 5%, #9775fa 95%)',
            colorPrimaryHover:
              'linear-gradient(270deg, #be4bdb 5%, #9775fa 95%)',
            colorPrimaryActive:
              'linear-gradient(270deg, #be4bdb 5%, #9775fa 95%)',
            primaryColor: '#292929',
            colorTextLightSolid: '#292929',
            colorPrimaryTextHover: '#292929',
            defaultHoverColor: '#292929',
          },
          Divider: {
            colorSplit: '#C1C7C6',
          },
          Tabs: {
            itemSelectedColor: '#B37FEB',
            inkBarColor: '#B37FEB',
          },
        },
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);
