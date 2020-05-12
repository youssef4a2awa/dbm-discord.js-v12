const path = require("path");

const WrexMODS= {};

WrexMODS.API = {};

WrexMODS.DBM = null;

WrexMODS.Version = "2.0.5";

WrexMODS.latest_changes = "The module installer WORKS NOW";

WrexMODS.modules = [];
WrexMODS.MaxInstallAttemptsPerModule = 3;
WrexMODS.CheckAndInstallNodeModule = function(moduleName, isGlobal = false){
	return new Promise((resolve, reject) => {

		let module = this.modules.find(x => x.name == moduleName);

		const botPath = path.dirname(process.argv[1]);
		const modulePath = path.join(botPath, "node_modules", moduleName);

		try {
			
			require.resolve(modulePath)
		
			if(!module){
				module = { name: moduleName, attempts:1, installed: true, errored: false  };	
				WrexMODS.modules.push(module);		
			}else{
				module.installed = true;
			}
			
			resolve(module);

		} catch (e) {

			if(module){
				module.attempts += 1;				
			}else{
				module = { name: moduleName, attempts:1, installed: false, errored: false };
				WrexMODS.modules.push(module);
			}

			if(module.errored){
				module.errored = true;
				reject(module);
			}

			if(module.attempts >= this.MaxInstallAttemptsPerModule){
				console.error("DBM MODS (Node Module Installer v2.5): Could not automatically install " + moduleName + ". \n\n (Install attempt limit reached) \n Please try to run your bot CMD/Terminal (Ctrl + Shift + Right Click [In Windows] To Open a CMD Window) and do 'node bot.js' at least once to allow the installer to run. \n If that still fails please do 'npm install --save " + moduleName + "' and restart your bot before you continue.");
				module.errored = true;
				reject(module);
			}else{

				try {			
					console.log("DBM MODS (Node Module Installer v2.5) Attempting To Install Node Module: '" + moduleName + "'. Please wait...\n");	

					const child = require('child_process');
					let cliCommand = 'npm install ' + moduleName + " --loglevel=error " + (isGlobal ? "-g" : "--save");
					child.execSync(cliCommand,{cwd: require('path').dirname(process.argv[1]),stdio:[0,1,2]});

					try {
						require.resolve(modulePath);
						module.installed = true;

						console.log("DBM MODS (Node Module Installer v2.5) Node Module '" + moduleName + "' has been Installed. You MAY need to restart your bot if theres errors.");	
						resolve(module)	;	

					} catch (error) {
						console.error("DBM MODS (Node Module Installer v2.5): Node Module  '" + moduleName + "' failed to install. Attempt Number: " + module.attempts + " out of " + this.MaxInstallAttemptsPerModule);
						if(module) WrexMODS.CheckAndInstallNodeModule(module.name);
					}
	
				} catch (error) {

					module.errored = true;

					if(error.message.includes("Command failed") || error.message.includes("Not found")|| error.message.includes("Not Found")){
						console.log("DBM MODS (Node Module Installer v2.5): Node Module  '" + moduleName + "' does not exist!");
						console.error(error.message);
					}else{
						console.error("DBM MODS (Node Module Installer v2.5): MAIN ERROR. Report the information below to DBM Mods Support!");
						console.dir(this.modules);
						console.error(error.message);
						console.log("----------------------------------------");
					}
					
				}
				
			}		
		}
	});
}



WrexMODS.require = function(moduleName){
	this.CheckAndInstallNodeModule(moduleName);	
	
	const botPath = path.dirname(process.argv[1]);
	const modulePath = path.join(botPath, "node_modules", moduleName);

	return require.main.require(modulePath);
}

WrexMODS.checkURL = function (url){ 
  
	if(!url){
		return false;
	}

    if (this.validUrl().isUri(url)){
        return true;
    } 
    else {
        return false;
    }
};

WrexMODS.validUrl = function() {
    'use strict';
	
    var module = {};
	module.exports = {};
	
    module.exports.is_uri = is_iri;
    module.exports.is_http_uri = is_http_iri;
    module.exports.is_https_uri = is_https_iri;
    module.exports.is_web_uri = is_web_iri;
    module.exports.isUri = is_iri;
    module.exports.isHttpUri = is_http_iri;
    module.exports.isHttpsUri = is_https_iri;
    module.exports.isWebUri = is_web_iri;

    var splitUri = function(uri) {
        var splitted = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
        return splitted;
    };

    function is_iri(value) {
        if (!value) {
            return;
        }

        if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return;

        if (/%[^0-9a-f]/i.test(value)) return;
        if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;

        var splitted = [];
        var scheme = '';
        var authority = '';
        var path = '';
        var query = '';
        var fragment = '';
        var out = '';

        splitted = splitUri(value);
        scheme = splitted[1]; 
        authority = splitted[2];
        path = splitted[3];
        query = splitted[4];
        fragment = splitted[5];

        if (!(scheme && scheme.length && path.length >= 0)) return;

        if (authority && authority.length) {
            if (!(path.length === 0 || /^\//.test(path))) return;
        } else {
            if (/^\/\//.test(path)) return;
        }

        if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase()))  return;

        out += scheme + ':';
        if (authority && authority.length) {
            out += '//' + authority;
        }

        out += path;

        if (query && query.length) {
            out += '?' + query;
        }

        if (fragment && fragment.length) {
            out += '#' + fragment;
        }

        return out;
    }

    function is_http_iri(value, allowHttps) {
        if (!is_iri(value)) {
            return;
        }

        var splitted = [];
        var scheme = '';
        var authority = '';
        var path = '';
        var port = '';
        var query = '';
        var fragment = '';
        var out = '';

        splitted = splitUri(value);
        scheme = splitted[1]; 
        authority = splitted[2];
        path = splitted[3];
        query = splitted[4];
        fragment = splitted[5];

        if (!scheme)  return;

        if(allowHttps) {
            if (scheme.toLowerCase() != 'https') return;
        } else {
            if (scheme.toLowerCase() != 'http') return;
        }

        if (!authority) {
            return;
        }

        if (/:(\d+)$/.test(authority)) {
            port = authority.match(/:(\d+)$/)[0];
            authority = authority.replace(/:\d+$/, '');
        }

        out += scheme + ':';
        out += '//' + authority;
        
        if (port) {
            out += port;
        }
        
        out += path;
        
        if(query && query.length){
            out += '?' + query;
        }

        if(fragment && fragment.length){
            out += '#' + fragment;
        }
        
        return out;
    }

    function is_https_iri(value) {
        return is_http_iri(value, true);
    }

    function is_web_iri(value) {
        return (is_http_iri(value) || is_https_iri(value));
    }
   return module.exports
};


WrexMODS.getWebhook = function(type, varName, cache) {
    const server = cache.server;
    switch(type) {
        case 1:
            return cache.temp[varName];
            break;
        case 2:
            if(server && this.server[server.id]) {
                return this.server[server.id][varName];
            }
            break;
        case 3:
            return this.global[varName];
            break;
        default:
            break;
    }
    return false;
};

WrexMODS.getReaction = function(type, varName, cache) {
    const server = cache.server;
    switch(type) {
        case 1:
            return cache.temp[varName];
            break;
        case 2:
            if(server && this.server[server.id]) {
                return this.server[server.id][varName];
            }
            break;
        case 3:
            return this.global[varName];
            break;
        default:
            break;
    }
    return false;
};

WrexMODS.getEmoji = function(type, varName, cache) {
    const server = cache.server;
    switch(type) {
        case 1:
            return cache.temp[varName];
            break;
        case 2:
            if(server && this.server[server.id]) {
                return this.server[server.id][varName];
            }
            break;
        case 3:
            return this.global[varName];
            break;
        default:
            break;
    }
    return false;
};

var customaction = {};
customaction.name = "WrexMODS";
customaction.section = "JSON Things";
customaction.author = "General Wrex";
customaction.version = "1.8.3";
customaction.short_description = "Required for some mods. Does nothing";

customaction.html = function() { 
	return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
     <p>
		<u>Wrexmods Dependencies:</u><br><br>
		This isn't an action, but it is required for the actions under this category. <br><br> 
		<b> Create action wont do anything </b>
	</p>
</div>`	
};

customaction.getWrexMods = function(){
	return WrexMODS;
}


customaction.mod = function(DBM) {

	WrexMODS.DBM = DBM
	DBM.Actions.getWrexMods = function(){		
		return WrexMODS;
	}
};		
module.exports = customaction;