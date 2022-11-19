import type {CapacitorConfig} from "@capacitor/cli";

class PermissionAnnotation{

    private readonly permission : ApplicationPermission

    constructor(permission : ApplicationPermission) {
        this.permission = permission
    }

    toString() : string {
        return `@Permission(strings = {"${this.permission}"},alias = "${this.permission}")`
    }
}



class AutomotiveDataAnnotation{

    private readonly allowedDataIds : number[] = []
    constructor(dataIds : number[]) {
        this.allowedDataIds.push(...dataIds);
    }

    toString() : string{
        return `@AutomotiveData(allowedIds = {${this.allowedDataIds.toString()}})`
    }
}

class CapacitorPluginAnnotation{
    private readonly permissions : ApplicationPermission[] = []
    private readonly name : string = ""
    constructor(name : string, permissions : ApplicationPermission[]) {
        this.permissions.push(...permissions)
        this.name = name
    }

    toString() : string {

        const permissionsList = []

        for(const permission of this.permissions) {
            permissionsList.push(new PermissionAnnotation(permission))
        }

        return `@CapacitorPlugin(name = "${this.name}",permissions = {${permissionsList}})`
    }
}

export class ApplicationMetaData {
    private readonly name : string;
    private readonly value : string

    constructor(name : string, value : string) {
        this.name = name
        this.value = value
    }

    toManifestString() : string {
        return `<meta-data android:name="${this.name}" android:value="${this.value}"/>`
    }
}

export class ApplicationPermission{
    private readonly permission : string
    constructor(permission : string) {
        this.permission = permission
    }

    toString() : string{
        return this.permission
    }

    toManifestString() : string {
        return `<uses-permission android:name="${this.permission}" />`
    }
}

export class ApplicationFeature{
    private readonly feature : string
    private readonly required : boolean
    constructor(feature : string,required : boolean) {
        this.feature = feature
        this.required = required
    }

    toString() : string {
        return this.feature
    }

    toManifestString() : string {
        return `<uses-feature android:name="${this.feature}" android:required="${this.required}"/>`
    }
}


export abstract class AutomotiveDataPluginConfiguration{

    protected readonly name : string = "DataPlugin"
    protected readonly package : string = "@capacitor-community/aaos-data-utils"
    protected readonly javaPackage : string = "io.ionic.plugins.aaosdatautils"
    protected readonly minCarApiLevel : number = 1
    protected readonly automotiveCapacitorConfig : AutomotiveCapacitorConfig
    protected readonly allowedDataIds : number[]

    protected constructor(automotiveCapacitorConfig : AutomotiveCapacitorConfig) {
        this.automotiveCapacitorConfig = automotiveCapacitorConfig
        this.allowedDataIds = []
    }

    abstract getRequiredPermissions() : Set<ApplicationPermission>

    abstract getRequiredFeatures() : Set<ApplicationFeature>

    getAllowedDataIds() : number[] {
        return this.allowedDataIds
    }

    getName() : string {
        return this.name
    }

    getMinCarApiLevel() : number {
        return this.minCarApiLevel
    }

    /**
     * Can be used to add allowed Properties that are not supposed to be discovered during runtime by checking the
     * capacitor config
     * @param allowedDataIds The data IDs the Plugin is allowed to access from the system
     */
    addAllowedDataIds(allowedDataIds : number[]) : AutomotiveDataPluginConfiguration {
        this.getAllowedDataIds().push(...allowedDataIds)
        return this
    }

    private getAnnotation() : string{
        const automotiveDataAnnotation = new AutomotiveDataAnnotation(this.getAllowedDataIds())
        const capacitorPluginAnnotation = new CapacitorPluginAnnotation(this.name,Array.from(this.getRequiredPermissions()))
        return `${automotiveDataAnnotation}\n${capacitorPluginAnnotation}`
    }

    private getPackagePath() : string{
        return `./node_modules/${this.package}`
    }

    private getPluginPath() : string {
        return `${this.getPackagePath()}/android/src/main/java/${this.javaPackage.replaceAll(".","/")}/${this.name}.java`
    }

    public updateAnnotation(filereader : (path : string) => string, filewriter : (path : string,content : string) => void) : void{
        let fileContent : string = filereader(this.getPluginPath())
        const previousAnnotation = fileContent.match(/@AutomotiveData([\s\S]*?)public class/g)
        if(previousAnnotation == null || previousAnnotation.length == 0 || previousAnnotation.length > 1) {
            console.error(`Annotations of Plugin: ${this.name} are malformed`)
            return
        }
        fileContent = fileContent.replace(previousAnnotation[0],this.getAnnotation()+ "\npublic class")
        filewriter(this.getPluginPath(),fileContent)
    }
}

export class ConfigurationError {
    event = -1
    reason = "unknown reason"
    constructor(reason : string) {
        this.reason = reason
    }

}

export interface AutomotiveCapacitorConfig extends CapacitorConfig{
    plugins : {
        VehiclePropertyPlugin? : {
            allowedVehicleProperties : number[]
        },
        VehicleUxRestrictionsPlugin? : {
        },
        VehicleVolumePlugin? : {
        },
        VehicleSensorPlugin? : {
            allowedSensorTypes: number[]
        }
    },
    includePlugins : string []
    automotive : {
        distractionOptimized : boolean
    }
}


