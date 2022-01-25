import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { BscConnector } from '@binance-chain/bsc-connector';
import Web3 from 'web3';

// metamask connections start
function isMetaMaskInstalled() {
  const { ethereum } = window;
  if (!Boolean(ethereum)) {
    return { isInstalled: false, provider: null };
  }
  if (!ethereum.isMetaMask) {
    return { isInstalled: false, provider: null };
  }
  if (ethereum.isMetaMask && !ethereum.providers) {
    // this check will be true when only metamask extension is installed and coinbase is not installed
    return { isInstalled: true, provider: ethereum };
  }
  if (ethereum.isMetaMask && ethereum.providers) {
    // this check will be true when coinbase extension is installed along with metamask
    const provider = ethereum.providers.find((provider) => provider.isMetaMask);
    return { isInstalled: true, provider: provider };
    // ethereum.providers.forEach((provider) => {
    //   if (provider.isMetaMask) return { isInstalled: true, provider: provider };
    // });
  }

  return { isInstalled: false, provider: null };
}
async function isMetaMaskConnected(provider) {
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  return {
    isConnected: accounts && accounts.length > 0,
    address: accounts[0],
    provider,
  };
}
async function initialiseMetamask() {
  const { isInstalled, provider } = isMetaMaskInstalled();
  if (!isInstalled) {
    window.alert(
      'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
    );
    return { isConnected: false, address: null, provider };
  }
  return await isMetaMaskConnected(provider);
}

// coinbase connection starts
function isCoinbaseInstalled() {
  const { ethereum } = window;
  if (!Boolean(ethereum)) {
    return { isInstalled: false, provider: null };
  }
  if (ethereum.isWalletLink) {
    // this check will be true when metamask extension is not installed
    return { isInstalled: true, provider: ethereum };
  }
  if (ethereum.isMetaMask && ethereum.providers) {
    // this check will be true when metamask extension is installed along with coinbase
    const provider = ethereum.providers.find(
      (provider) => provider.isWalletLink
    );
    return { isInstalled: true, provider: provider };
    // ethereum.providers.forEach((provider) => {
    //   if (provider.isWalletLink)
    //     return { isInstalled: true, provider: provider };
    // });
  }
  return { isInstalled: false, provider: null };
}
async function isCoinbaseConnected(provider) {
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  //   const accounts = await provider.enable();

  return {
    isConnected: accounts && accounts.length > 0,
    address: accounts[0],
    provider,
  };
}
async function initialiseCoinbase() {
  const { isInstalled, provider } = isCoinbaseInstalled();
  if (!isInstalled) {
    window.alert(
      'Please install an Ethereum-compatible browser or extension like Coinbase to use this dApp!'
    );
    return { isConnected: false, address: null, provider };
  }
  return await isCoinbaseConnected(provider);
}

// Metamask mobile wallet connect
export const walletConnect = async (
  //   setAddr,
  //   handleClose,
  firstTimeConnect
  //   setContract,
) => {
  const walletConnectProvider = new WalletConnectProvider({
    rpc: {
      1: `https://mainnet.infura.io/v3/cef28c4e6a144470b40df83c3e71b3d9`, // ethereum mainnet
      3: `https://ropsten.infura.io/v3/cef28c4e6a144470b40df83c3e71b3d9`, // ropsten
      97: 'https://data-seed-prebsc-1-s1.binance.org:8545', // binance - testnet
    },
  });

  //  Enable session (triggers QR Code modal)
  await walletConnectProvider.enable();

  if (walletConnectProvider.connected) {
    // setAddr(walletConnectProvider.accounts[0]);
    alert(walletConnectProvider.accounts[0]);
  }

  /////////////////////////Ethers
  const provider = new ethers.providers.Web3Provider(walletConnectProvider);

  //   if (firstTimeConnect) {
  //     //set value to localhost
  //     localStorage.setItem('wallet-header', 'wallet_connect');
  //     //Close Modal
  //     handleClose();
  //   }

  const _signer = provider.getSigner();

  // const _contract = new ethers.Contract(
  //   config.tokenContract.contractAddress,
  //   config.tokenContract.contractABI,
  //   _signer
  // );
  // setContract(_contract);
};

//Binance Wallet Connection
export const binanceWalletConnect = async (binanceInstance) => {
  try {
    binanceInstance = new BscConnector({
      supportedChainIds: [1, 56, 97], // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
    });
    // invoke method on bwc e.g.
    const res = await binanceInstance.activate();
    // console.log('res: ', res);
    let binanceAccount = await binanceInstance.getAccount();
    // const chainId = await binanceInstance.getChainId();
    // const accountAddress = await binanceInstance.getAccount();

    return { binanceInstance, binanceAccount };
  } catch (e) {
    console.log(e);
  }
};

// Coinbase Wallet Connection
export const connectCoinbaseWallet = async () => {
  const { isConnected, address, provider } = await initialiseCoinbase();

  //   alert(isConnected + ' : ' + address);

  if (isConnected) {
    window.web3 = new Web3(provider);
  }

  // alert('Coinbase connected successfully');
  // localStorage.setItem('wallet-header', 'coinbase');
  // localStorage.setItem('wallet-network', 'ethereum');
};

// Metamask Wallet Connection
export const connectMetamaskWallet = async () => {
  const { isConnected, address, provider } = await initialiseMetamask();

  //   alert(isConnected + ' : ' + address);

  if (isConnected) {
    window.web3 = new Web3(provider);
  }

  // alert('Metamask connected successfully');
  // localStorage.setItem('wallet-header', 'metamask');
  // localStorage.setItem('wallet-network', 'ethereum');
};

export const disconnectWalletConnect = async () => {
  //for bsc
  const provider = new WalletConnectProvider({
    rpc: {
      1: `https://mainnet.infura.io/v3/cef28c4e6a144470b40df83c3e71b3d9`, // ethereum mainnet
      3: `https://ropsten.infura.io/v3/cef28c4e6a144470b40df83c3e71b3d9`, // ropsten
      97: 'https://data-seed-prebsc-1-s1.binance.org:8545', // binance - testnet
    },
  });
  await provider.disconnect();
};
