import { AsyncLocalStorage } from 'node:async_hooks';

export const clsStore = new AsyncLocalStorage<Map<string, any>>();

export const CLS_KEYS = {
  TRACE_ID: 'traceId',
};
