import { registerPlugin } from '@capacitor/core';

import type { AAOSDataUtilsPlugin } from './definitions';

const AAOSDataUtils = registerPlugin<AAOSDataUtilsPlugin>('AAOSDataUtils', {
  web: () => import('./web').then(m => new m.AAOSDataUtilsWeb()),
});

export * from './definitions';
export { AAOSDataUtils };
