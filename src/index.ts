import {
  VehicleDataService,
  VehicleErrorEvent,
  VehicleDataEvent,
  RestrictedVehicleDataService,
  PermissionsStatus
} from "./definitions";

export abstract class VehicleDataProxy<VehicleDataEventType extends VehicleDataEvent> {

  dataService : VehicleDataService<VehicleDataEventType>

  protected constructor(dataService : VehicleDataService<VehicleDataEventType>) {
    this.dataService = dataService;
  }

  generateActiveView(dataId : number, callback : (dataEvent : VehicleDataEventType | null, err? : any) => void, addressableName? : string) : Promise<void> {
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
      throw JSON.parse(errorEvent) as VehicleErrorEvent
    })
  }

  generatePassiveView(dataId : number, overwriteOldEvents : boolean, addressableName? : string) : Promise<void> {
    return this.dataService.generatePassiveView({
      dataId : dataId,
      overwriteOldEvents : overwriteOldEvents,
      addressableName: addressableName
    }).then(() => {
      console.log(`Successfully registered Passive Property View for propertyId: ${dataId} - ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed registering Passive Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEvent
    })
  }

  removeView(addressableName : string) : Promise<void> {
    return this.dataService.removeView({
      addressableName : addressableName
    }).then(() => {
      console.log(`Removed View for ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed removing View for ${addressableName}. Reason: ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEvent
    })
  }

  setDataViewOverwriteOldEvents(addressableName : string, overwriteOldEvents : boolean) : Promise<void> {
    return this.dataService.setDataViewOverwriteOldEvents({addressableName : addressableName, overwriteOldEvents : overwriteOldEvents}).then(() => {
      console.log(`Successfully set overwriteOldElements for DataView ${addressableName}`)
    }).catch(errorEvent => {
      console.error(`Failed setting overwriteOldElements for DataView ${addressableName}. Reason: ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEvent
    })
  }

  view(addressableName : string) : Promise<VehicleDataEventType | VehicleErrorEvent>{
    return this.dataService.view({addressableName : addressableName}).then((event) => {
      console.log(`Received value: ${JSON.stringify(event)} for ${addressableName}`)
      if(event.event === "error") {
        return (event as VehicleErrorEvent)
      }
      else{
        return (event as VehicleDataEventType)
      }
    }).catch(errorEvent => {
      console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`)
      throw JSON.parse(errorEvent) as VehicleErrorEvent
    })
  }
}

export abstract class RestrictedVehicleDataProxy<VehicleDataEventType extends VehicleDataEvent,PermissionType extends string> extends VehicleDataProxy<VehicleDataEventType>{

  protected constructor(dataService : RestrictedVehicleDataService<VehicleDataEventType,PermissionType>) {
    super(dataService);
  }

  private getDataService() : RestrictedVehicleDataService<VehicleDataEventType,PermissionType> {
    return (this.dataService as RestrictedVehicleDataService<VehicleDataEventType,PermissionType>)
  }

  checkPermissions(): Promise<PermissionsStatus<PermissionType> | null> {
    return this.getDataService().checkPermissions().then(permissionStatus => {
      console.log(`Current Permissionsstatus: ${JSON.stringify(permissionStatus)}`)
      return permissionStatus
    }).catch(reason => {
      console.error(`Failed checking current PermissionStatus. Reason: ${reason}`)
      return null
    })
  }

  requestPermissions(permissions: PermissionType[]): Promise<PermissionsStatus<PermissionType> | null> {
    return this.getDataService().requestPermissions({
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
export * from './configuration'
