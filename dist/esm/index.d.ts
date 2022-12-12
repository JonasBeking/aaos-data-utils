import type { VehicleDataService, VehicleErrorEvent, VehicleDataEvent, RestrictedVehicleDataService, PermissionStates } from "./definitions";
export declare abstract class VehicleDataProxy<VehicleDataEventType extends VehicleDataEvent, VehicleErrorEventType extends VehicleErrorEvent> {
    protected dataService: VehicleDataService<VehicleDataEventType, VehicleErrorEventType>;
    protected constructor(dataService: VehicleDataService<VehicleDataEventType, VehicleErrorEventType>);
    generateActiveView(dataId: number, callback: (dataEvent: VehicleDataEventType | null, err?: any) => void, addressableName?: string): Promise<void>;
    generatePassiveView(dataId: number, addressableName?: string): Promise<void>;
    removeView(addressableName: string): Promise<void>;
    view(addressableName: string): Promise<VehicleDataEventType | VehicleErrorEventType>;
    viewAll(addressableName: string): Promise<(VehicleDataEventType | VehicleErrorEventType)[]>;
}
export declare abstract class RestrictedVehicleDataProxy<VehicleDataEventType extends VehicleDataEvent, VehicleErrorEventType extends VehicleErrorEvent, PermissionType extends string> extends VehicleDataProxy<VehicleDataEventType, VehicleErrorEventType> {
    dataService: RestrictedVehicleDataService<VehicleDataEventType, VehicleErrorEventType, PermissionType>;
    protected constructor(dataService: RestrictedVehicleDataService<VehicleDataEventType, VehicleErrorEventType, PermissionType>);
    checkPermissions(): Promise<PermissionStates<PermissionType>>;
    requestPermissions(permissions: PermissionType[]): Promise<PermissionStates<PermissionType>>;
}
export * from './definitions';
