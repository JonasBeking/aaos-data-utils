export type DataViewCallback<VehicleDataEventType> = (message : VehicleDataEventType | null, err?: any) => void;
export type CallbackID = string;

export interface VehicleDataEvent {
  timestamp : number,
  event : string,
  data : any
}

export interface VehicleErrorEvent {
  timestamp : number,
  event : "error",
  reason : string
}

export type PermissionsStatus<T extends string> = {[key in T] : 'denied' | 'granted'}

export interface VehicleDataService<VehicleDataEventType extends VehicleDataEvent>{
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
   * Gets the value of a previously registered view.
   * @param options
   */
  view(options : {
    addressableName : string
  }) : Promise<VehicleDataEventType | VehicleErrorEvent>

  /**
   * Tell a registered view to discord or keep old events to poll later on
   * @param options
   */
  setDataViewOverwriteOldEvents(options : {
    addressableName : string,
    overwriteOldEvents: boolean
  }) : Promise<void>
}

export interface RestrictedVehicleDataService<VehicleDataEventType extends VehicleDataEvent, PermissionType extends string> extends VehicleDataService<VehicleDataEventType>{
  /**
   * Gets the status for all permissions
   */
  checkPermissions() : Promise<PermissionsStatus<PermissionType>>

  /**
   * Requests the permissions passed to it or if nothing is passed, requests all permissions known to the plugin
   * @param options
   */
  requestPermissions(options : {
    permissions : PermissionType[]
  }) : Promise<PermissionsStatus<PermissionType>>
}
