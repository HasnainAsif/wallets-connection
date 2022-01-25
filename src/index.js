import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UseWalletProvider } from 'use-wallet';
import {
  BscConnector,
  UserRejectedRequestError,
  ConnectionRejectedError,
} from '@binance-chain/bsc-connector';

ReactDOM.render(
  <React.StrictMode>
    <UseWalletProvider
      connectors={{
        bsc: {
          web3ReactConnector() {
            return new BscConnector({ supportedChainIds: [1, 56, 97] });
          },
          handleActivationError(err) {
            if (err instanceof UserRejectedRequestError) {
              return new ConnectionRejectedError();
            }
          },
        },
      }}
    >
      <App />
    </UseWalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
