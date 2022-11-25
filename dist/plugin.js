var capacitorAAOSDataUtils = (function (exports) {
    'use strict';

    class VehicleDataProxy {
        constructor(dataService) {
            this.dataService = dataService;
        }
        generateActiveView(dataId, callback, addressableName) {
            console.log("Attempting to generate active view");
            return this.dataService.generateActiveView({
                dataId: dataId,
                addressableName: addressableName
            }, ((dataEvent, err) => {
                if (err) {
                    console.error(`Failed getting value for propertyId: ${dataId} - ${addressableName}`);
                    callback(dataEvent, err);
                }
                else {
                    console.log(`Received value: ${JSON.stringify(dataEvent)} for propertyId: ${dataId} - ${addressableName}`);
                    callback(dataEvent);
                }
            })).then(() => {
                console.log(`Successfully registered Active Property View for propertyId: ${dataId} - ${addressableName}`);
            }).catch(errorEvent => {
                console.error(`Failed registering Active Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`);
                throw JSON.parse(errorEvent);
            });
        }
        generatePassiveView(dataId, addressableName) {
            return this.dataService.generatePassiveView({
                dataId: dataId,
                addressableName: addressableName
            }).then(() => {
                console.log(`Successfully registered Passive Property View for propertyId: ${dataId} - ${addressableName}`);
            }).catch(errorEvent => {
                console.error(`Failed registering Passive Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`);
                throw JSON.parse(errorEvent);
            });
        }
        removeView(addressableName) {
            return this.dataService.removeView({
                addressableName: addressableName
            }).then(() => {
                console.log(`Removed View for ${addressableName}`);
            }).catch(errorEvent => {
                console.error(`Failed removing View for ${addressableName}. Reason: ${errorEvent}`);
                throw JSON.parse(errorEvent);
            });
        }
        view(addressableName) {
            return this.dataService.view({ addressableName: addressableName }).then((event) => {
                console.log(`Received value: ${JSON.stringify(event)} for ${addressableName}`);
                if (event.event === -1) {
                    return event;
                }
                else {
                    return event;
                }
            }).catch(errorEvent => {
                console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`);
                throw JSON.parse(errorEvent);
            });
        }
        viewAll(addressableName) {
            return this.dataService.viewAll({ addressableName: addressableName }).then(({ events }) => {
                console.log(`Received value: ${JSON.stringify(events)} for ${addressableName}`);
                return events;
            }).catch(errorEvent => {
                console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`);
                throw JSON.parse(errorEvent);
            });
        }
    }
    class RestrictedVehicleDataProxy extends VehicleDataProxy {
        constructor(dataService) {
            super(dataService);
            this.dataService = dataService;
        }
        checkPermissions() {
            return this.dataService.checkPermissions().then(permissionStatus => {
                console.log(`Current Permissionsstatus: ${JSON.stringify(permissionStatus)}`);
                return permissionStatus;
            }).catch(reason => {
                console.error(`Failed checking current PermissionStatus. Reason: ${reason}`);
                return null;
            });
        }
        requestPermissions(permissions) {
            return this.dataService.requestPermissions({
                permissions: permissions
            }).then(permissionStatus => {
                console.log(`Current PermissionStatus: ${JSON.stringify(permissionStatus)}`);
                return permissionStatus;
            }).catch(reason => {
                console.error(`Failed requesting Permissions. Reason: ${reason}`);
                return null;
            });
        }
    }

    exports.RestrictedVehicleDataProxy = RestrictedVehicleDataProxy;
    exports.VehicleDataProxy = VehicleDataProxy;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=plugin.js.map
