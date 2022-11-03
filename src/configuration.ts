import {VehiclePluginPermissionUtil} from "./VehiclePluginPermissionUtil";

const PACKAGE_PATH = "./node_modules/@capacitor-community/aaos-vehicle-property/"
const JAVA_CLASS_BASE_PATH = "android/src/main/java/io/ionic/plugins/aaosvehicleproperty/"

export abstract class VehiclePluginConfiguration{

    protected permissionUtil : VehiclePluginPermissionUtil;

    protected constructor(javaClassPath : string) {
        this.permissionUtil = new VehiclePluginPermissionUtil(PACKAGE_PATH + JAVA_CLASS_BASE_PATH + javaClassPath)
    }

    protected abstract getPermissions() : Set<string>
}
