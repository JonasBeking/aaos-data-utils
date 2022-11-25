
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
    console.log("Attempting to generate active view")
    return this.dataService.generateActiveView({
      dataId : dataId,
      addressableName: addressableName
    },((dataEvent, err) => {
      if(err) {
        console.error(`Failed getting value for propertyId: ${dataId} - ${addressableName}`)
        callback(dataEvent,err)
      }
      else{
        console.log(`Received value: ${JSON.stringify(dataEvent)} for propertyId: ${dataId} - ${addressableName}`)
        callback(dataEvent)
      }
    })).then(() => {
      console.log(`Successfully registered Active Property View for propertyId: ${dataId} - ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed registering Active Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEventType
    })
  }

  generatePassiveView(dataId : number, addressableName? : string) : Promise<void> {
    return this.dataService.generatePassiveView({
      dataId : dataId,
      addressableName: addressableName
    }).then(() => {
      console.log(`Successfully registered Passive Property View for propertyId: ${dataId} - ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed registering Passive Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEventType
    })
  }

  removeView(addressableName : string) : Promise<void> {
    return this.dataService.removeView({
      addressableName : addressableName
    }).then(() => {
      console.log(`Removed View for ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed removing View for ${addressableName}. Reason: ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEventType
    })
  }

  view(addressableName : string) : Promise<VehicleDataEventType | VehicleErrorEventType>{
    return this.dataService.view({addressableName : addressableName}).then((event) => {
      console.log(`Received value: ${JSON.stringify(event)} for ${addressableName}`)
      if(event.event === -1) {
        return (event as VehicleErrorEventType)
      }
      else{
        return (event as VehicleDataEventType)
      }
    }).catch(errorEvent => {
      console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEventType
    })
  }

  viewAll(addressableName : string) : Promise<(VehicleDataEventType | VehicleErrorEventType)[]>{
    return this.dataService.viewAll({addressableName : addressableName}).then(({events}) => {
      console.log(`Received value: ${JSON.stringify(events)} for ${addressableName}`)
      return events
    }).catch(errorEvent => {
      console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEventType
    })
  }
}

export abstract class RestrictedVehicleDataProxy<VehicleDataEventType extends VehicleDataEvent,VehicleErrorEventType extends VehicleErrorEvent, PermissionType extends string> extends VehicleDataProxy<VehicleDataEventType,VehicleErrorEventType>{

  dataService : RestrictedVehicleDataService<VehicleDataEventType,VehicleErrorEventType,PermissionType>

  protected constructor(dataService : RestrictedVehicleDataService<VehicleDataEventType,VehicleErrorEventType,PermissionType>) {
    super(dataService);
    this.dataService = dataService;
  }

  checkPermissions(): Promise<PermissionStates<PermissionType> | null> {
    return this.dataService.checkPermissions().then(permissionStatus => {
      console.log(`Current Permissionsstatus: ${JSON.stringify(permissionStatus)}`)
      return permissionStatus
    }).catch(reason => {
      console.error(`Failed checking current PermissionStatus. Reason: ${reason}`)
      return null
    })
  }

  requestPermissions(permissions: PermissionType[]): Promise<PermissionStates<PermissionType> | null> {
    return this.dataService.requestPermissions({
      permissions : permissions
    }).then(permissionStatus => {
      console.log(`Current PermissionStatus: ${JSON.stringify(permissionStatus)}`)
      return permissionStatus
    }).catch(reason => {
      console.error(`Failed requesting Permissions. Reason: ${reason}`)
      return null
    })
  }
}

export * from './definitions';
