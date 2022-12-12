export class VehicleDataProxy {
    constructor(dataService) {
        this.dataService = dataService;
    }
    generateActiveView(dataId, callback, addressableName) {
        return this.dataService.generateActiveView({
            dataId: dataId,
            addressableName: addressableName
        }, ((dataEvent, err) => {
            if (err) {
                const errorEvent = JSON.parse(err);
                console.error(`Failed getting value for propertyId: ${dataId} - ${addressableName} due to ${err}`);
                callback(dataEvent, errorEvent);
            }
            else {
                console.debug(`Received value: ${JSON.stringify(dataEvent)} for propertyId: ${dataId} - ${addressableName}`);
                callback(dataEvent);
            }
        })).then(() => {
            console.debug(`Requested Active Property View for propertyId: ${dataId} - ${addressableName}`);
        }).catch(errorEvent => {
            console.error(`Failed registering Active Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`);
            let throwable;
            try {
                throwable = JSON.parse(errorEvent);
            }
            catch (e) {
                throwable = errorEvent;
            }
            throw throwable;
        });
    }
    generatePassiveView(dataId, addressableName) {
        return this.dataService.generatePassiveView({
            dataId: dataId,
            addressableName: addressableName
        }).then(() => {
            console.debug(`Successfully registered Passive Property View for propertyId: ${dataId} - ${addressableName}`);
        }).catch(errorEvent => {
            console.error(`Failed registering Passive Property View for propertyId: ${dataId} - ${addressableName}. Reason: ${errorEvent}`);
            let throwable;
            try {
                throwable = JSON.parse(errorEvent);
            }
            catch (e) {
                throwable = errorEvent;
            }
            throw throwable;
        });
    }
    removeView(addressableName) {
        return this.dataService.removeView({
            addressableName: addressableName
        }).then(() => {
            console.debug(`Removed View for ${addressableName}`);
        }).catch(errorEvent => {
            console.error(`Failed removing View for ${addressableName}. Reason: ${errorEvent}`);
            let throwable;
            try {
                throwable = JSON.parse(errorEvent);
            }
            catch (e) {
                throwable = errorEvent;
            }
            throw throwable;
        });
    }
    view(addressableName) {
        return this.dataService.view({ addressableName: addressableName }).then((event) => {
            console.debug(`Received value: ${JSON.stringify(event)} for ${addressableName}`);
            if (event.event === -1) {
                return event;
            }
            else {
                return event;
            }
        }).catch(errorEvent => {
            console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`);
            let throwable;
            try {
                throwable = JSON.parse(errorEvent);
            }
            catch (e) {
                throwable = errorEvent;
            }
            throw throwable;
        });
    }
    viewAll(addressableName) {
        return this.dataService.viewAll({ addressableName: addressableName }).then(({ events }) => {
            console.debug(`Received value: ${JSON.stringify(events)} for ${addressableName}`);
            return events;
        }).catch(errorEvent => {
            console.error(`Failed receiving value for ${addressableName}. Reason ${errorEvent}`);
            let throwable;
            try {
                throwable = JSON.parse(errorEvent);
            }
            catch (e) {
                throwable = errorEvent;
            }
            throw throwable;
        });
    }
}
export class RestrictedVehicleDataProxy extends VehicleDataProxy {
    constructor(dataService) {
        super(dataService);
        this.dataService = dataService;
    }
    checkPermissions() {
        return this.dataService.checkPermissions().then(permissionStatus => {
            console.debug(`Current status of permissions: ${JSON.stringify(permissionStatus)}`);
            return permissionStatus;
        }).catch(reason => {
            console.error(`Failed checking current status for permissions. Reason: ${reason}`);
            let throwable;
            try {
                throwable = JSON.parse(reason);
            }
            catch (e) {
                throwable = reason;
            }
            throw throwable;
        });
    }
    requestPermissions(permissions) {
        return this.dataService.requestPermissions({
            permissions: permissions
        }).then(permissionStatus => {
            console.debug(`Current PermissionStatus: ${JSON.stringify(permissionStatus)}`);
            return permissionStatus;
        }).catch(reason => {
            console.error(`Failed requesting Permissions. Reason: ${reason}`);
            let throwable;
            try {
                throwable = JSON.parse(reason);
            }
            catch (e) {
                throwable = reason;
            }
            throw throwable;
        });
    }
}
export * from './definitions';
//# sourceMappingURL=index.js.map