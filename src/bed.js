/*! bed.js v1.0 | (c) 2014, Kimerran.com (https://github.com/kimerran/bed.js)
*/

var bed = {
    config: function (config) {
        bed = new Bed(config);
    }
}

function Bed(config) {

    // HELPER METHODS
    this.__capitalize = function (s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    this.__pathPreparePost = function (path, params) {
        var reg = /(:\w*)/mg;
        var match;
        while ((match = reg.exec(path)) != null) {
            path = path.replace(match[0], params[match[0].slice(1)]);
        }
        return path;
    }

    this.__pathPrepareGet = function (path, params) {

        path += "?";
        for (var prop in params) {
            path += prop + "=" + params[prop] + "&";
        }
        return path.slice(0,-1);
    }

    this.__createRequest = function (method, path, callback) {

        var req = new XMLHttpRequest();
   
        path = config.host + path;

        req.open(method, path, true);
       
        if (method == "POST") {
            req.setRequestHeader("Content-type", "application/json");
        }

        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                var res = {
                    content: JSON.parse(req.responseText),
                    req: req,
                    status: req.status,
                };
                callback(res);
            }
        };
        return req;
    }
    
    this.__createMethodName = function (ctrl, action) {

        var name;
        var cfg = config;

        var sep = cfg.separator || "";

        switch (cfg.convention || "") {
            case "CamelCase":
                name = ctrl + sep + p.__capitalize(action);
                break;
            case "PascalCase":
                name = p.__capitalize(ctrl) + sep + p.__capitalize(action);
                break;
            default:
                name = ctrl + sep + action;

        }

        return name;
    }
    this.__error = function(msg) {
        throw new Error(msg);
    }

    var p = this;
    //if (!config) { p.__error("MISSING config") }

 
    // [GET]
    p.$g = function (path, params, callback) {

        path = p.__pathPrepareGet(path, params);
        var req = p.__createRequest("GET", path, callback);
        req.send();
    };

    // [POST]
    p.$p = function (path, params, callback) {

        path = p.__pathPreparePost(path, params);
        var req = p.__createRequest("POST", path, callback);       
        req.send(JSON.stringify(params));
    };

    // [TODO] Delete method functions
    p.$d = function (path, params, callback) {

    };

    // REST as JavaScript functions
    p.cfg = config;

    if (!p.cfg.host) p.__error("MISSING bedcfg.host");
      
    var host = p.cfg.host;
   
    var ctrls = this.cfg.controllers || [];

    ctrls.forEach(function (element, index, array) {

        var ctrl = element.name;

        element.actions.forEach(function (action) {
            var method = p.__createMethodName(ctrl,action);

            // Create $g (GET) functions based on config
            p.$g[method] = function (param, callback) {
                var path = host + "/" + ctrl + "/" + action;
                path = p.__pathPrepareGet(path, param);
                var req = p.__createRequest("GET", path, callback);
                req.send();
            };

            // Create $p (POST) functions based on config
            p.$p[method] = function (param, callback) {
                var path = host + "/" + ctrl + "/" + action;
                var req = p.__createRequest("POST", path, callback);              
                req.send(JSON.stringify(param));
            };


        });
    });

    
}

window.bed = bed;