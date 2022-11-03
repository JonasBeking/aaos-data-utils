import * as fs from "fs";

export class VehiclePluginPermissionUtil{
    private permissions : Set<string> | undefined
    private fileContent : string
    //private readonly nativePluginFilePath : string;

    constructor(nativePluginFilePath : string) {
        //this.nativePluginFilePath = nativePluginFilePath;
        this.fileContent = fs.readFileSync(nativePluginFilePath,'utf8')
    }

    public setPermissions(permissions : Set<string>) {
        this.permissions = permissions
    }

    private static generateSinglePermissionAnnotation(permission : string) : string {
        return `
                @Permission(
                    strings = {${permission}},
                    alias = ${permission}
                ),`
    }

    private static generateCummulativePermissionsAttribute(singlePermissionAnnotations : Array<string>) : string {

        let cummulatePermissions = ""

        for(let singlePermissionAnnotation of singlePermissionAnnotations) {
            cummulatePermissions += singlePermissionAnnotation
        }

        return `permissions = {${cummulatePermissions}}`
    }

    private clearPreviousPermissionAnnotation() {
        let deletePreviousPermissionMatches = this.fileContent.match(/@Permission\(([\s\S]*?)\),/g)
        if(!deletePreviousPermissionMatches) {
            console.error("Could not find permissions Tag in Plugin")
            return
        }
        for(let match of deletePreviousPermissionMatches) {
            this.fileContent = this.fileContent.replace(match,'')
        }

        let cleanUpMatches = this.fileContent.match(/{(\s*)}/g)
        if(!cleanUpMatches ) {
            console.error("Could not find clean up permissions due to unknown error")
            return
        }
        for(let match of cleanUpMatches) {
            this.fileContent = this.fileContent.replace(match,'{}')
        }
    }

    private replacePermissionAnnotation(replace : string) {
        this.clearPreviousPermissionAnnotation()
        let replaceMatches = this.fileContent.match(/permissions = {}/g)
        if(!replaceMatches) {
            console.error("Failed replacing the permissions in the plugin")
            return
        }
        if(replaceMatches.length == 1) {
            this.fileContent = this.fileContent.replace(replaceMatches[0],replace)
        }
    }

    public adjustPermissionAnnotation() {
        let singlePermissionAnnotations = []
        for(let permission in this.permissions) {
            singlePermissionAnnotations.push(VehiclePluginPermissionUtil.generateSinglePermissionAnnotation(permission))
        }
        let permissionsAnnotationAttribute = VehiclePluginPermissionUtil.generateCummulativePermissionsAttribute(singlePermissionAnnotations)
        console.log(permissionsAnnotationAttribute)
        this.replacePermissionAnnotation(permissionsAnnotationAttribute)
        console.log(this.fileContent)
        //fs.writeFileSync(this.nativePluginFilePath,this.fileContent)
    }
}
