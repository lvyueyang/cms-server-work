import { createContext, useContext } from 'react';
import { SSRProps } from '../types';

export const SSRContext = createContext<SSRProps>({} as SSRProps);

export const useSSRContext = () => {
  const context = useContext(SSRContext);
  return context;
};
