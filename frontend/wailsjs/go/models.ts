export namespace db {
	
	export class EnvVarInput {
	    key: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new EnvVarInput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.value = source["value"];
	    }
	}
	export class HookInput {
	    event: string;
	    matcher: string;
	    command: string;
	    blocking: boolean;
	    timeoutSeconds: number;
	
	    static createFrom(source: any = {}) {
	        return new HookInput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.event = source["event"];
	        this.matcher = source["matcher"];
	        this.command = source["command"];
	        this.blocking = source["blocking"];
	        this.timeoutSeconds = source["timeoutSeconds"];
	    }
	}
	export class PermissionInput {
	    type: string;
	    tool: string;
	
	    static createFrom(source: any = {}) {
	        return new PermissionInput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.tool = source["tool"];
	    }
	}
	export class CreateProfileRequest {
	    name: string;
	    description: string;
	    scope: string;
	    modelOverride: string;
	    permissions: PermissionInput[];
	    hooks: HookInput[];
	    envVars: EnvVarInput[];
	
	    static createFrom(source: any = {}) {
	        return new CreateProfileRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.scope = source["scope"];
	        this.modelOverride = source["modelOverride"];
	        this.permissions = this.convertValues(source["permissions"], PermissionInput);
	        this.hooks = this.convertValues(source["hooks"], HookInput);
	        this.envVars = this.convertValues(source["envVars"], EnvVarInput);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class HarnessEnvVar {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    profileId: number;
	    key: string;
	    value: string;
	    sortOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new HarnessEnvVar(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.profileId = source["profileId"];
	        this.key = source["key"];
	        this.value = source["value"];
	        this.sortOrder = source["sortOrder"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HarnessHook {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    profileId: number;
	    event: string;
	    matcher: string;
	    command: string;
	    blocking: boolean;
	    timeoutSeconds: number;
	    sortOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new HarnessHook(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.profileId = source["profileId"];
	        this.event = source["event"];
	        this.matcher = source["matcher"];
	        this.command = source["command"];
	        this.blocking = source["blocking"];
	        this.timeoutSeconds = source["timeoutSeconds"];
	        this.sortOrder = source["sortOrder"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HarnessPermission {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    profileId: number;
	    type: string;
	    tool: string;
	    sortOrder: number;
	
	    static createFrom(source: any = {}) {
	        return new HarnessPermission(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.profileId = source["profileId"];
	        this.type = source["type"];
	        this.tool = source["tool"];
	        this.sortOrder = source["sortOrder"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HarnessProfile {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    name: string;
	    description: string;
	    scope: string;
	    modelOverride: string;
	
	    static createFrom(source: any = {}) {
	        return new HarnessProfile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.scope = source["scope"];
	        this.modelOverride = source["modelOverride"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HarnessProfileFull {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    name: string;
	    description: string;
	    scope: string;
	    modelOverride: string;
	    permissions: HarnessPermission[];
	    hooks: HarnessHook[];
	    envVars: HarnessEnvVar[];
	
	    static createFrom(source: any = {}) {
	        return new HarnessProfileFull(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.scope = source["scope"];
	        this.modelOverride = source["modelOverride"];
	        this.permissions = this.convertValues(source["permissions"], HarnessPermission);
	        this.hooks = this.convertValues(source["hooks"], HarnessHook);
	        this.envVars = this.convertValues(source["envVars"], HarnessEnvVar);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class UpdateProfileRequest {
	    name: string;
	    description: string;
	    scope: string;
	    modelOverride: string;
	    permissions: PermissionInput[];
	    hooks: HookInput[];
	    envVars: EnvVarInput[];
	
	    static createFrom(source: any = {}) {
	        return new UpdateProfileRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.scope = source["scope"];
	        this.modelOverride = source["modelOverride"];
	        this.permissions = this.convertValues(source["permissions"], PermissionInput);
	        this.hooks = this.convertValues(source["hooks"], HookInput);
	        this.envVars = this.convertValues(source["envVars"], EnvVarInput);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace harness {
	
	export class Preset {
	    id: string;
	    name: string;
	    description: string;
	    icon: string;
	    permissions: db.PermissionInput[];
	    hooks: db.HookInput[];
	    envVars: db.EnvVarInput[];
	
	    static createFrom(source: any = {}) {
	        return new Preset(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.icon = source["icon"];
	        this.permissions = this.convertValues(source["permissions"], db.PermissionInput);
	        this.hooks = this.convertValues(source["hooks"], db.HookInput);
	        this.envVars = this.convertValues(source["envVars"], db.EnvVarInput);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

