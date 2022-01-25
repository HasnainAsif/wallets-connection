import './App.css';
import {
  binanceWalletConnect,
  connectCoinbaseWallet,
  connectMetamaskWallet,
  disconnectWalletConnect,
  walletConnect,
} from './Connection';
import { useWallet } from 'use-wallet';

function App() {
  //For Binance
  const { reset } = useWallet();

  const onClickConnect = (e) => {
    e.preventDefault();
    walletConnect();
  };

  const onClickDisconnect = (e) => {
    e.preventDefault();
    disconnectWalletConnect();
    alert('disconnected');
  };

  const onClickCoinbaseConnect = (e) => {
    e.preventDefault();
    connectCoinbaseWallet();
  };

  const onClickCoinbaseDisconnect = (e) => {
    e.preventDefault();
    // disconnectWalletConnect();
    alert('coinbase disconnected...');
    // console.log(window.ethereum.providers[1]);
  };

  // const onClickBinanceConnect = (e) => {
  //   e.preventDefault();
  //   alert('binance connected...');
  //   // walletConnect();
  // };

  const onClickBinanceConnect = (e) => {
    e.preventDefault();

    const binanceEnabled = async () => {
      if (window.BinanceChain) {
        //Pass window.BinanceChain to BSC Connector
        let { binanceInstance, binanceAccount } = await binanceWalletConnect(
          window.BinanceChain
        );

        // //Set Binance Address
        // if (binanceAccount) {
        //   //Initiate event listener
        //   window.BinanceChain.on('accountsChanged', function (accounts) {
        //     // //Update setAddr and Local storage on event
        //     alert(accounts[0]);
        //     // setAddr(accounts[0]);
        //     // localStorage.setItem('binance-addr', accounts[0]);
        //   });

        //   // //Assign current address
        //   // setAddr(binanceAccount);
        //   // localStorage.setItem('binance-addr', binanceAccount);
        // }

        return true;
      }
      return false;
    };
    if (!binanceEnabled()) {
      alert(
        'Please install an Ethereum-compatible browser or extension like Binance Wallet Extension to use this dApp!'
      );
      // handleClose();
    } else {
      console.log(window.BinanceChain);
      alert('binance connected');
      // localStorage.setItem('wallet-header', 'binance');
      // handleClose();
    }
  };

  const onClickBinanceDisconnect = (e) => {
    e.preventDefault();
    // disconnectWalletConnect();
    reset();
    alert('binance disconnected...');
  };

  const onClickMetamaskConnect = (e) => {
    e.preventDefault();
    connectMetamaskWallet();
  };

  const onClickMetamaskDisconnect = (e) => {
    e.preventDefault();
    // disconnectWalletConnect();
    alert('Metamask disconnected...');
  };

  return (
    <div className='App'>
      <button onClick={onClickConnect}>Wallet Connect</button>
      <button onClick={onClickDisconnect}>Wallet Disconnect</button>

      <p>
        <button onClick={onClickCoinbaseConnect}>Coinbase Connect</button>
        <button onClick={onClickCoinbaseDisconnect}>Coinbase Disconnect</button>
      </p>

      <p>
        <button onClick={onClickBinanceConnect}>Binance Connect</button>
        <button onClick={onClickBinanceDisconnect}>Binance Disconnect</button>
      </p>

      <p>
        <button onClick={onClickMetamaskConnect}>Metamask Connect</button>
        <button onClick={onClickMetamaskDisconnect}>Metamask Disconnect</button>
      </p>
    </div>
  );
}

export default App;
