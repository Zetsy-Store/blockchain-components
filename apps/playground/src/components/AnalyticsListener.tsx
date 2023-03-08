import {useContext, useEffect} from 'react';
import {AnalyticsContext} from 'shared';

export const AnalyticsListener = () => {
  const {subscribeToAll} = useContext(AnalyticsContext);
  useEffect(() => {
    const {unsubscribe} = subscribeToAll((payload: any) => {
      // eslint-disable-next-line no-console
      console.log('Captured event', payload);
    });
    return () => unsubscribe();
  });

  return null;
};
