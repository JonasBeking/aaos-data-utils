export interface AAOSDataUtilsPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
