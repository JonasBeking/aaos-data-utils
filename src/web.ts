import { WebPlugin } from '@capacitor/core';

import type { AAOSDataUtilsPlugin } from './definitions';

export class AAOSDataUtilsWeb extends WebPlugin implements AAOSDataUtilsPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
