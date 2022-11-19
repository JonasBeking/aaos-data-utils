export type DataViewCallback<VehicleDataEventType> = (message : VehicleDataEventType | null, err?: any) => void;
export type CallbackID = string;

export interface VehicleEvent{
  timestamp : number,
  event : number
}

export interface VehicleDataEvent extends VehicleEvent{
  data : any
}

export interface VehicleErrorEvent extends VehicleEvent{
  event : -1,
  reason : string
}

export type PermissionStates<T extends string> = {[key in T] : 'denied' | 'granted'}

export interface VehicleDataService<VehicleDataEventType extends VehicleDataEvent, VehicleErrorEventType extends VehicleErrorEvent>{
  /**
   * Generates an active view on the side of android: The view will pass data on a callback so no active polling is
   * required on the WebView side
   * @param options
   * @param callback
   */
  generateActiveView(options : {
    dataId : number,
    addressableName? : string
  }, callback : DataViewCallback<VehicleDataEventType>) : Promise<CallbackID>
  /**
   * Generates an active view on the side of android: The view will not pass data on a callback so active polling is
   * required on the WebView side
   * @param options
   */
  generatePassiveView(options : {
    dataId : number,
    overwriteOldEvents : boolean,
    addressableName? : string
  }) : Promise<void>

  /**
   * Removes a view previously generated
   * @param options
   */
  removeView(options : {
    addressableName : string
  }) : Promise<void>

  /**
   * Gets the most recent event received by the view
   * @param options
   */
  view(options : {
    addressableName : string
  }) : Promise<VehicleDataEventType | VehicleErrorEventType>

  /**
   * Gets the latest 16 events received by the view
   * @param options
   */
  viewAll(options : {
    addressableName : string
  }) : Promise<{events : Array<VehicleDataEventType | VehicleErrorEventType>}>

}

export interface RestrictedVehicleDataService<VehicleDataEventType extends VehicleDataEvent, VehicleErrorEventType extends VehicleErrorEvent, PermissionType extends string> extends VehicleDataService<VehicleDataEventType,VehicleErrorEventType>{
  /**
   * Gets the status for all permissions
   */
  checkPermissions() : Promise<PermissionStates<PermissionType>>

  /**
   * Requests the permissions passed to it or if nothing is passed, requests all permissions known to the plugin
   * @param options
   */
  requestPermissions(options : {
    permissions : PermissionType[]
  }) : Promise<PermissionStates<PermissionType>>
}
