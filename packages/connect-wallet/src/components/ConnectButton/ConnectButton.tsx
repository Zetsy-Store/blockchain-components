import {eventNames, useEventWithTracking} from '@shopify/blockchain-components';
import {useCallback, useEffect, useState} from 'react';
import {
  Button,
  CaretDown,
  CircleTick,
  Copy,
  device,
  formatWalletAddress,
  getButtonClassname,
  Popover,
  Text,
  useKeyPress,
  useOutsideClick,
} from 'shared';

import {ConnectorIcon} from '../ConnectorIcon';
import {useAppSelector} from '../../hooks/useAppState';
import {useCopyToClipboard} from '../../hooks/useCopyToClipboard';
import {useDisconnect} from '../../hooks/useDisconnect';
import {useTranslation} from '../../hooks/useTranslation';
import {useWindowDimensions} from '../../hooks/useWindowDimensions';
import {useModal} from '../../providers/ModalProvider';

export const ConnectButton = () => {
  const {activeWallet} = useAppSelector((state) => state.wallet);
  const {copy, copied} = useCopyToClipboard();
  const {disconnect} = useDisconnect();
  const {openModal} = useModal();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const {t} = useTranslation('ConnectButton');
  const {width} = useWindowDimensions();
  const shouldUseMobileSizes = Boolean(width && width < device.sm);

  const ref = useOutsideClick(
    () => !shouldUseMobileSizes && setPopoverVisible(false),
  );
  const escPress = useKeyPress('Escape');

  const togglePopover = useCallback(() => {
    setPopoverVisible(!popoverVisible);
  }, [popoverVisible]);

  useEffect(() => {
    if (escPress && popoverVisible) {
      togglePopover();
    }
  }, [escPress, popoverVisible, togglePopover]);

  const handleClick = useCallback(() => {
    if (!activeWallet) {
      openModal();
    }
  }, [activeWallet, openModal]);

  const handleDisconnect = useCallback(() => {
    if (!activeWallet) {
      return;
    }

    disconnect(activeWallet.address);
    setPopoverVisible(false);
  }, [activeWallet, disconnect]);

  const togglePopoverWithTracking = useEventWithTracking({
    eventName: eventNames.CONNECT_WALLET_CONNECTED_BUTTON_CLICKED,
    callback: togglePopover,
  });

  if (!activeWallet) {
    return (
      <Button
        aria-label={t('buttonText')}
        fullWidth
        primary
        label={t('buttonText')}
        onClick={handleClick}
        onClickEventName={eventNames.CONNECT_WALLET_CONNECT_BUTTON_CLICKED}
        size="Lg"
      />
    );
  }

  const {address, connectorId, displayName} = activeWallet;
  const buttonClassname = getButtonClassname({
    fullWidth: true,
    size: 'Lg',
  });
  const buttonLabel = displayName || formatWalletAddress(address);

  return (
    <div
      className="sbc-relative"
      id="shopify-connect-wallet-connected-button-wrapper"
      ref={ref}
    >
      <button
        aria-disabled={false}
        aria-label={buttonLabel}
        className={`${buttonClassname} sbc-gap-x-2`}
        onClick={togglePopoverWithTracking}
        type="button"
      >
        <ConnectorIcon id={connectorId} size="xs" />
        <Text as="span" variant="bodyLg">
          {buttonLabel}
        </Text>
        <div
          className={`sbc-h-5 sbc-w-5 sbc-origin-center sbc-transition-transform ${
            popoverVisible ? 'sbc-rotate-180' : 'sbc-rotate-0'
          }`}
        >
          {CaretDown}
        </div>
      </button>

      <Popover
        id="shopify-connect-wallet-popover-container"
        onDismiss={() => setPopoverVisible(false)}
        target="shopify-connect-wallet-connected-button-wrapper"
        visible={popoverVisible}
      >
        <ConnectorIcon id={connectorId} size="lg" />

        <button
          className="sbc-flex sbc-cursor-pointer sbc-items-center sbc-gap-x-3 sbc-rounded-full sbc-bg-address-chip sbc-py-2 sbc-px-3 sbc-text-address-chip sbc-transition-colors sbc-border-none hover:sbc-bg-address-chip-hover"
          onClick={() => copy(address)}
          type="button"
        >
          <Text as="span" className="sbc-pointer-events-none" variant="bodyLg">
            {formatWalletAddress(address)}
          </Text>
          {copied ? CircleTick : Copy}
        </button>

        <Button
          aria-label={t('popover.disconnectButton')}
          fullWidth
          label={t('popover.disconnectButton')}
          onClick={handleDisconnect}
          onClickEventName={eventNames.CONNECT_WALLET_DISCONNECT_BUTTON_CLICKED}
        />
      </Popover>
    </div>
  );
};
