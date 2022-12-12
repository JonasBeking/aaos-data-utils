
import type {
  VehicleDataService,
  VehicleErrorEvent,
  VehicleDataEvent,
  RestrictedVehicleDataService,
  PermissionStates
} from "./definitions";

export abstract class VehicleDataProxy<VehicleDataEventType extends VehicleDataEvent, VehicleErrorEventType extends VehicleErrorEvent> {

  protected dataService : VehicleDataService<VehicleDataEventType,VehicleErrorEventType>

  protected constructor(dataService : VehicleDataService<VehicleDataEventType,VehicleErrorEventType>) {
    this.dataService = dataService
  }

  generateActiveView(dataId : number, callback : (dataEvent : VehicleDataEventType | null, err? : any) => void, addressableName? : string) : Promise<void> {
    return this.dataService.generateActiveView({
      dataId : dataId,
      addressableName: addressableName
    },((dataEvent, err) => {
      if(err) {
        const errorEvent : VehicleErrorEventType = JSON.parse(err)

        console.error(`Failed getting value for propertyId: ${dataId} - ${addressableName} due to ${err}`)
        callback(dataEvent,errorEvent)
      }
      else{
        console.debug(`Received value: ${JSON.stringify(dataEvent)} for propertyId: ${dataId} - ${addressableName}`)
        callback(dataEvent)
      }
    })).then(() => {
      console.debug(`Requested Active Property View for propertyId: ${dataId} - ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed registering Active Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`)
      let throwable
      try{
        throwable = JSON.parse(errorEvent) as VehicleErrorEventType
      } catch (e) {
        throwable = errorEvent
      }
      throw throwable
    })
  }

  generatePassiveView(dataId : number, addressableName? : string) : Promise<void> {
    return this.dataService.generatePassiveView({
      dataId : dataId,
      addressableName: addressableName
    }).then(() => {
      console.debug(`Successfully registered Passive Property View for propertyId: ${dataId} - ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed registering Passive Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`)
      let throwable
      try{
        throwable = JSON.parse(errorEvent) as VehicleErrorEventType
      } catch (e) {
        throwable = errorEvent
      }
      throw throwable
    })
  }

  removeView(addressableName : string) : Promise<void> {
    return this.dataService.removeView({
      addressableName : addressableName
    }).then(() => {
      console.debug(`Removed View for ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed removing View for ${addressableName}. Reason: ${errorEvent}`)
      let throwable
      try{
        throwable = JSON.parse(errorEvent) as VehicleErrorEventType
      } catch (e) {
        throwable = errorEvent
      }
      throw throwable
    })
  }

  view(addressableName : string) : Promise<VehicleDataEventType | VehicleErrorEventType>{
    return this.dataService.view({addressableName : addressableName}).then((event) => {
      console.debug(`Received value: ${JSON.stringify(event)} for ${addressableName}`)
      if(event.event === -1) {
        return (event as VehicleErrorEventType)
      }
      else{
        return (event as VehicleDataEventType)
      }
    }).catch(errorEvent => {
      console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`)
      let throwable
      try{
        throwable = JSON.parse(errorEvent) as VehicleErrorEventType
      } catch (e) {
        throwable = errorEvent
      }
      throw throwable
    })
  }

  viewAll(addressableName : string) : Promise<(VehicleDataEventType | VehicleErrorEventType)[]>{
    return this.dataService.viewAll({addressableName : addressableName}).then(({events}) => {
      console.debug(`Received value: ${JSON.stringify(events)} for ${addressableName}`)
      return events
    }).catch(errorEvent => {
      console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`)
      let throwable
      try{
        throwable = JSON.parse(errorEvent) as VehicleErrorEventType
      } catch (e) {
        throwable = errorEvent
      }
      throw throwable
    })
  }
}

export abstract class RestrictedVehicleDataProxy<VehicleDataEventType extends VehicleDataEvent,VehicleErrorEventType extends VehicleErrorEvent, PermissionType extends string> extends VehicleDataProxy<VehicleDataEventType,VehicleErrorEventType>{

  dataService : RestrictedVehicleDataService<VehicleDataEventType,VehicleErrorEventType,PermissionType>

  protected constructor(dataService : RestrictedVehicleDataService<VehicleDataEventType,VehicleErrorEventType,PermissionType>) {
    super(dataService);
    this.dataService = dataService;
  }

  checkPermissions(): Promise<PermissionStates<PermissionType>> {
    return this.dataService.checkPermissions().then(permissionStatus => {
      console.debug(`Current status of permissions: ${JSON.stringify(permissionStatus)}`)
      return permissionStatus
    }).catch(reason => {
      console.error(`Failed checking current status for permissions. Reason: ${reason}`)
      let throwable
      try{
        throwable = JSON.parse(reason) as VehicleErrorEventType
      } catch (e) {
        throwable = reason
      }
      throw throwable
    })
  }

  requestPermissions(permissions: PermissionType[]): Promise<PermissionStates<PermissionType>> {
    return this.dataService.requestPermissions({
      permissions : permissions
    }).then(permissionStatus => {
      console.debug(`Current PermissionStatus: ${JSON.stringify(permissionStatus)}`)
      return permissionStatus
    }).catch(reason => {
      console.error(`Failed requesting Permissions. Reason: ${reason}`)
      let throwable
      try{
        throwable = JSON.parse(reason) as VehicleErrorEventType
      } catch (e) {
        throwable = reason
      }
      throw throwable
    })
  }
}

export * from './definitions';
