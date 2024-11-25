import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { ApolloProvider } from '@apollo/client';
import router from './routes';
import { client } from './apollo-client';
import 'antd/dist/reset.css';

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ConfigProvider
        locale={frFR}
        theme={theme}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
