import {MetaMask as metaMaskIcon} from 'shared';
import {MetaMaskConnector} from 'wagmi/connectors/metaMask';

import {ConnectorInstance, ConnectorProps} from '../types/connector';
import {isInstalled} from '../utils/isInstalled';

import {buildWalletConnectConnector} from './buildWalletConnectConnector';

export const MetaMask = ({
  chains,
  projectId,
}: ConnectorProps): ConnectorInstance => {
  const mmInstalled = isInstalled('MetaMask');

  return {
    createConnector: () => {
      const connector = mmInstalled
        ? new MetaMaskConnector({chains})
        : buildWalletConnectConnector({chains, projectId});

      return connector;
    },
    marketingSite: 'https://metamask.io/',
    mobileAppPrefixes: {
      Android: '',
      iOS: 'https://metamask.app.link/wc?uri=',
    },
    icon: metaMaskIcon,
    id: 'metaMask',
    name: 'MetaMask',
    qrCodeSupported: !mmInstalled,
  };
};
