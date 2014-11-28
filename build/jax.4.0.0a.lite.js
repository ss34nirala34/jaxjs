/**
 * jax javascript library (http://www.jaxjs.org/)
 *
 * @link       https://github.com/jaxjs/jaxjs4
 * @category   jax
 * @author     Nick Sagona, III <dev@nolainteractive.com>
 * @copyright  Copyright (c) 2009-2014 NOLA Interactive, LLC. (http://www.nolainteractive.com)
 * @license    http://www.jaxjs.org/license     New BSD License
 * @version    4.0.0a
 * @build      Nov 28, 2014 02:35:14
 */
(function(window){
    /**
     * Base jax constructor class
     * @constructor
     */
    var jax     = function(){};
    jax.version = '4.0.0a';

    /**
     * Method to extend the jax class prototype
     *
     * @param {Object}  prop
     * @param {Boolean} over
     */
    jax.extend = function(prop, over) {
        var override = ((over != undefined) && (over != null)) ? over : false;
        var prototype = this.prototype;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if ((typeof prototype[name] != "undefined") && (!override)) {
                throw "You are not allowed to override '" + name + "' property in jax.";
            } else {
                prototype[name] = prop[name];
            }
        }

        jax.prototype = prototype;
        jax.prototype.constructor = jax;
    };

    /** The main jax prototype */
    jax.prototype = {
        version    : jax.version,
        selector   : null,
        length     : 0,
        view       : {
            width  : 0,
            height : 0
        },
        /**
         * Main init/constructor function of the jax class
         *
         * @param   {Mixed} selector
         * @returns jax
         */
        init : function(selector) {
            this.selector = selector;

            // Start the selection process
            if (this.selector != undefined) {
                // If selector is the window object, document object or pre-selected object
                if ((this.selector == document) || (this.selector == window) || ((this.selector.constructor != Array) && (this.selector.constructor != String))) {
                    this.push(this.selector);
                // Else, make selection
                } else {
                    try {
                        // Special case for the :button selector
                        if (this.selector.indexOf(':button') != -1) {
                            var oldSel = this.selector;
                            this.selector = this.selector.replace(':button', '[type=button]');
                            if (oldSel.substring(0, 1) == ':') {
                                this.selector = this.selector + oldSel.replace(':button', ', button');
                            } else {
                                oldSel = oldSel.replace(':button', ' button');
                                this.selector = this.selector + ', ' + oldSel;
                            }
                        }

                        // Special cases for other type selectors
                        var typeSelectors = [
                            ':checkbox', ':file', ':image', ':password',
                            ':radio', ':reset', ':submit', ':text'
                        ];

                        for (var i = 0; i < typeSelectors.length; i++) {
                            if (this.selector.indexOf(typeSelectors[i]) != -1) {
                                this.selector = this.selector.replace(typeSelectors[i], '[type=' + typeSelectors[i].substring(1) + ']');
                            }
                        }

                        // Special case for the :selected pseudo selector
                        var selected = false;
                        if (this.selector.indexOf(':selected') != -1) {
                            selected = true;
                            this.selector = this.selector.replace(':selected', '');
                        }

                        var elems = document.querySelectorAll(this.selector);
                        for (var i = 0; i < elems.length; i++) {
                            if ((!selected) || ((selected) && (elems[i].selected))) {
                                this.push(elems[i]);
                            }
                        }
                    } catch (error) {
                        console.log(error.message + ' (' + this.selector + ').');
                    }
                }
            }

            // Get the viewport dimensions
            this.view.width = window.innerWidth;
            this.view.height = window.innerHeight;

            return this;
        },
        /**
         * Basic concat() function to uphold the array-like functionality of a jax object
         *
         * @return {Array}
         */
        concat : function() {
            return Array.prototype.concat.apply(this, arguments);
        },
        /**
         * Basic push() function to uphold the array-like functionality of a jax object
         *
         * @param   {Mixed} arg
         * @returns {jax}
         */
        push : function(arg) {
            Array.prototype.push.call(this, arg);
            return this;
        },
        /**
         * Basic pop() function to uphold the array-like functionality of a jax object
         *
         * @returns {jax}
         */
        pop : function() {
            Array.prototype.pop.call(this);
            return this;
        },
        /**
         * Basic reverse() function to uphold the array-like functionality of a jax object
         *
         * @returns {jax}
         */
        reverse : function() {
            Array.prototype.reverse.call(this);
            return this;
        },
        /**
         * Basic shift() function to uphold the array-like functionality of a jax object
         *
         * @returns {jax}
         */
        shift : function() {
            Array.prototype.shift.call(this);
            return this;
        },
        /**
         * Basic slice() function to uphold the array-like functionality of a jax object
         *
         * @returns {Array}
         */
        slice : function() {
            return Array.prototype.slice.apply(this, arguments);
        },
        /**
         * Basic splice() function to uphold the array-like functionality of a jax object
         *
         * @returns {jax}
         */
        splice : function() {
            Array.prototype.splice.apply(this, arguments);
            return this;
        },
        /**
         * Basic unshift() function to uphold the array-like functionality of a jax object
         *
         * @returns {jax}
         */
        unshift : function() {
            Array.prototype.unshift.apply(this, arguments);
            return this;
        },
        /** Function to empty out the selected collection array */
        clear  : function() {
            while (this.length > 0) {
                this.pop();
            }
        },
        /**
         * Function to convert the jax object into a pure array
         *
         * @returns {Array}
         */
        toArray : function() {
            var ary = []
            for (var i = 0; i < this.length; i++) {
                ary.push(this[i]);
            }
            return ary;
        }
    };

    /**
     * Main jax object for the global space
     *
     * @param   {Mixed} selector
     * @returns {jax}
     */
    window.jax = function(selector) {
        return new jax().init(selector);
    };

    window.jax.prototype = jax.prototype;
    window.jax.version   = jax.version;

    /** The "no conflict" function under the main jax object */
    window.jax.noConflict = function() {
        delete window.$;
        return window.jax;
    };

    /**
     * Function to extend the jax class prototype in the global space
     *
     * @param {Object}  prop
     * @param {boolean} over
     */
    window.jax.extend = function(prop, over) {
        var override = ((over != undefined) && (over != null)) ? over : false;
        var prototype = window.jax.prototype;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if ((typeof prototype[name] != "undefined") && (!override)) {
                throw "You are not allowed to override '" + name + "' property in jax.";
            } else {
                prototype[name] = prop[name];
            }
        }

        window.jax.prototype = prototype;
        window.jax.prototype.constructor = window.jax;
        window.$ = window.jax;
    };

    /** Assign the $ alias object */
    window.$ = window.jax;
})(window);

/**
 * core/query.js
 */
(function(window){
    /**
     * Function to get a variable or variables from the query string
     *
     * @param   {String} key
     * @param   {String} u
     * @returns {Mixed}
     */
    window.jax.query = function(key, u) {
        var vars = [];
        var url = (u != null) ? u : location.href;

        if (url.indexOf('?') != -1) {
            var varString = url.substring(url.indexOf('?') + 1);
            if (varString.indexOf('#') != -1) {
                varString = varString.substring(0, varString.indexOf('#'));
            }
            var varsAry = varString.split('&');
            for (var i = 0; i < varsAry.length; i++) {
                var gV = varsAry[i].split('=');
                vars[gV[0]] = decodeURIComponent(gV[1]);
            }
        }

        // If key was passed
        if ((key != undefined) && (key != null)) {
            return (vars[key] != undefined) ? vars[key] : undefined;
            // Else, return entire array
        } else {
            return vars;
        }
    };

    /**
     * Function to build a query
     *
     * @param   {Mixed} data
     * @returns {String}
     */
    window.jax.buildQuery = function(data) {
        var query    = '';
        var chkCount = [];

        // Loop through the elements to assemble the qery string.
        // If it's a form element object
        if (data.elements != undefined) {
            for (var i = 0; i < data.elements.length; i++) {
                if (data.elements[i].value != undefined) {
                    var name = (data.elements[i].name.indexOf('[') != -1) ?
                        data.elements[i].name.substring(0, data.elements[i].name.indexOf('[')) : data.elements[i].name;

                    // If the element is a checkbox or radio element that's checked
                    if ((data.elements[i].type == 'checkbox') || (data.elements[i].type == 'radio')) {
                        if (data.elements[i].checked) {
                            if (chkCount[name] != undefined) {
                                chkCount[name]++;
                            } else {
                                chkCount[name] = 0;
                            }
                            if (i != 0) {
                                query += '&';
                            }
                            if (data.elements[i].type == 'checkbox') {
                                query += encodeURIComponent(name + '[' + chkCount[name] + ']') + '=' + encodeURIComponent(data.elements[i].value);
                            } else {
                                query += encodeURIComponent(name) + '=' + encodeURIComponent(data.elements[i].value);
                            }
                        }
                    // Else, if the element is a multiple select element
                    } else if ((data.elements[i].type.indexOf('select') != -1) && (data.elements[i].multiple)) {
                        for (var j = 0; j < data.elements[i].options.length; j++) {
                            if (data.elements[i].options[j].selected) {
                                if (chkCount[name] != undefined) {
                                    chkCount[name]++;
                                } else {
                                    chkCount[name] = 0;
                                }
                                if (i != 0) {
                                    query += '&';
                                }
                                query += encodeURIComponent(name + '[' + chkCount[name] + ']') + '=' + encodeURIComponent(data.elements[i].options[j].value);
                            }
                        }
                    // Else a normal element
                    } else {
                        if (i != 0) {
                            query += '&';
                        }
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(data.elements[i].value);
                    }
                }
            }
        // If it's an object
        } else if (data.constructor == Object) {
            var i = 0;
            for (var name in data) {
                if (i != 0) {
                    query += '&';
                }
                if (data[name].constructor == Array) {
                    var aryVals = '';
                    for (var j = 0; j < data[name].length; j++) {
                        if (j != 0) {
                            aryVals += '&';
                        }
                        aryVals += encodeURIComponent(name + '[' + j + ']') + '=' + encodeURIComponent(data[name][j]);
                    }
                    query += aryVals;
                } else {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(data[name]);
                }
                i++;
            }
        // If it's a basic array with a set of arrays with name/value pairs
        } else if (data.constructor == Array) {
            for (var i = 0; i < data.length; i++) {
                if (i != 0) {
                    query += '&';
                }
                if (data[i][1].constructor == Array) {
                    var aryVals = '';
                    for (var j = 0; j < data[i][1].length; j++) {
                        if (j != 0) {
                            aryVals += '&';
                        }
                        aryVals += encodeURIComponent(data[i][0] + '[' + j + ']') + '=' + encodeURIComponent(data[i][1][j]);
                    }
                    query += aryVals;
                } else {
                    query += encodeURIComponent(data[i][0]) + '=' + encodeURIComponent(data[i][1]);
                }
            }
        }

        return query;
    };
})(window);

/**
 * core/ready.js
 */
jax.extend({
    /**
     * Function to trigger a function when the document object (implied) is loaded & ready.
     *
     * @param {Function} func
     */
    ready : function(func) {
        document.addEventListener('DOMContentLoaded', func, false);
    }
});
/**
 * core/remove.js
 */
jax.extend({
    /**
     * Function to remove the selected element(s)
     *
     * @returns {jax}
     */
    remove : function() {
        if (this.length > 0) {
            for (var i = 0; i < this.length; i++) {
                var child = this[i] && this[i].parentNode;
                if ((child) && (this[i].parentNode != undefined)) {
                    this[i].parentNode.removeChild(this[i]);
                }
            }
        }
        return this;
    },
    /**
     * Function to remove the child contents of the selected elements
     *
     * @returns {jax}
     */
    empty : function() {
        if (this.length > 0) {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = '';
            }
        }
        return this;
    }
});
/**
 * ajax.js
 */
(function(window){
    window.jax.requests = [];

    /**
     * Function to perform AJAX requests
     *
     * @param   {String} url
     * @param   {Object} opts
     * @returns {Mixed}
     */
    window.jax.ajax = function(url, opts) {
        // Create a new request object.
        var index = window.jax.random(100000, 999999);
        window.jax.requests[index] = (window.XMLHttpRequest) ? new XMLHttpRequest() : false;

        // Get options
        var method  = ((opts != undefined) && (opts.method != undefined))  ? opts.method.toLowerCase() : 'get';
        var async   = ((opts != undefined) && (opts.async != undefined))   ? opts.async : false;
        var fields  = ((opts != undefined) && (opts.fields != undefined))  ? opts.fields : true;
        var data    = ((opts != undefined) && (opts.data != undefined))    ? window.jax.buildQuery(opts.data) : null;
        var type    = ((opts != undefined) && (opts.type != undefined))    ? opts.type : null;
        var delim   = ((opts != undefined) && (opts.delim != undefined))   ? opts.delim : null;
        var headers = ((opts != undefined) && (opts.headers != undefined)) ? opts.headers : null;
        var status  = ((opts != undefined) && (opts.status != undefined))  ? opts.status : null;
        var trace   = ((opts != undefined) && (opts.trace != undefined))   ? opts.trace : null;

        // If method is GET
        if (method == 'get') {
            if (data != null) {
                url += '?' + data;
            }
            window.jax.requests[index].open('GET', url, async);
            // Else, if method is POST
        } else if (method == 'post') {
            // Set and send the request, setting the function to execute on the return of a response.
            window.jax.requests[index].open('POST', url, async);
            window.jax.requests[index].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            window.jax.requests[index].setRequestHeader('Content-Length', data.length.toString());
            window.jax.requests[index].setRequestHeader('Connection', 'close');
        }

        // If additional headers are set, send them
        if (headers != null) {
            for (var header in headers) {
                window.jax.requests[index].setRequestHeader(header, headers[header]);
            }
        }

        // If status function handlers have been set, the set the onreadystatechange
        if (status != null) {
            window.jax.requests[index].onreadystatechange = function() {
                if (window.jax.requests[index].readyState == 4) {
                    var response = window.jax.getResponse(index);
                    // If they exist, execute normal status return function handlers

                    if (status[window.jax.requests[index].status]) {
                        if (typeof status[window.jax.requests[index].status] == 'function') {
                            status[window.jax.requests[index].status](response);
                        } else if (status[window.jax.requests[index].status].constructor == Array) {
                            for (var i = 0; i < status[window.jax.requests[index].status].length; i++) {
                                if (typeof status[window.jax.requests[index].status][i] == 'function') {
                                    status[window.jax.requests[index].status][i](response);
                                }
                            }
                        }
                        // Else, if generic error handler(s) exist, execute error handler(s)
                    } else if (status['error']) {
                        if (typeof status['error'] == 'function') {
                            status['error'](response);
                        } else if (status['error'].constructor == Array) {
                            for (var i = 0; i < status['error'].length; i++) {
                                if (typeof status['error'][i] == 'function') {
                                    status['error'][i](response);
                                }
                            }
                        }
                    }
                    if (trace != null) {
                        trace.apply(undefined, [response]);
                    }
                }
            };

            window.jax.requests[index].send(data);
            return this;
            // Else, rely on the built in response parser
        } else {
            window.jax.requests[index].send(data);
            return window.jax.parseResponse(window.jax.getResponse(index), type, fields, delim, async, trace);
        }
    };
})(window);

/**
 * ajax/get.js
 */
(function(window){
    /**
     * Alias function to perform a GET AJAX request
     *
     * @param   {String} url
     * @param   {Object} opts
     * @returns {Mixed}
     */
    window.jax.get = function(url, opts) {
        if (opts == undefined) {
            opts = {method : 'get'};
        } else if ((opts.method == undefined) || ((opts.method != undefined) && (opts.method.toLowerCase() != 'get'))) {
            opts.method = 'get';
        }
        return window.jax.ajax(url, opts);
    };
})(window);

/**
 * ajax/http.js
 */
(function(window){
    window.jax.http = {
        /**
         * Function to get the HTTP request status of a URL
         *
         * @param   {String} url
         * @returns {Number}
         */
        getStatus : function(url) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status;
        },
        /**
         * Function to determine if the HTTP request is successful
         *
         * @param   {String} url
         * @returns {boolean}
         */
        isSuccess : function(url) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            var type = Math.floor(http.status / 100);
            return ((type == 3) || (type == 2) || (type == 1));
        },
        /**
         * Function to determine if the HTTP request is a redirect
         *
         * @param   {String} url
         * @returns {boolean}
         */
        isRedirect : function(url) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            var type = Math.floor(http.status / 100);
            return (type == 3);
        },
        /**
         * Function to determine if the HTTP request is an error
         *
         * @param   {String} url
         * @returns {boolean}
         */
        isError : function(url) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            var type = Math.floor(http.status / 100);
            return ((type == 5) || (type == 4));
        }
    };
})(window);

/**
 * ajax/response.js
 */
(function(window){
    /**
     * Function to parse a response
     *
     * @param   {Object}   response
     * @param   {String}   type
     * @param   {Boolean}  fields
     * @param   {String}   delim
     * @param   {Boolean}  async
     * @param   {Function} trace
     * @returns {Object}
     */
    window.jax.parseResponse = function(response, type, fields, delim, async, trace) {
        var obj;
        var msie = (navigator.userAgent.toLowerCase().indexOf('msie') != -1);

        // Detect application type
        if (type == null) {
            if (response.headers['Content-Type'].toLowerCase().indexOf('json') != -1) {
                type = 'json';
            } else if (response.headers['Content-Type'].toLowerCase().indexOf('xml') != -1) {
                type = 'xml';
            } else if (response.headers['Content-Type'].toLowerCase().indexOf('csv') != -1) {
                type = 'csv';
                if (delim == null) {
                    delim = ',';
                }
            } else if (response.headers['Content-Type'].toLowerCase().indexOf('tsv') != -1) {
                type = 'csv';
                if (delim == null) {
                    delim = "\t";
                }
            }
        }

        switch (type) {
            // Parse JSON response
            case 'json':
                obj = JSON.parse(decodeURIComponent(response.text));
                break;

            // Parse XML response
            case 'xml':
                // Get XML doc from string if doesn't exist
                if (!response.xml) {
                    var str = (response.text != undefined) ? response.text : response.toString();
                    if (msie) {
                        var xDoc = new ActiveXObject('Microsoft.XMLDOM');
                        xDoc.async = (async != undefined) ? async : true;
                        xDoc.loadXML(str);
                    } else {
                        var parser = new DOMParser();
                        var xDoc = parser.parseFromString(str, 'text/xml');
                    }
                    // Else, get XML doc
                } else {
                    var xDoc = response.xml;
                }

                var docObj = 'var xml = ';

            function traverse(tree, objStr) {
                var attribs = [];
                var attribStr = '';
                if (tree.attributes != undefined) {
                    for (var j = 0; j < tree.attributes.length; j++) {
                        attribs.push(tree.attributes[j].nodeName + ' : "' + new window.jax.String(tree.attributes[j].nodeValue).html(null, true).addslashes('double').replace(/\n/g, '\\n') + '"');
                    }
                }
                if (tree.hasChildNodes()) {
                    var regex = /^\s*$/;
                    var nValue = '';
                    for (var i = 0; i < tree.childNodes.length; i++) {
                        if ((tree.childNodes[i].nodeType == 3) && (!regex.test(tree.childNodes[i].nodeValue))) {
                            nValue += tree.childNodes[i].nodeValue;
                        }
                    }
                    attribs.push('nodeValue : "' + new window.jax.String(nValue).html(null, true).addslashes('double').replace(/\n/g, '\\n') + '"');
                    if (attribs.length > 0) {
                        attribStr = '{' + attribs.join(', ');
                    }
                    objStr += '{' + tree.tagName + ' : ' + attribStr + ', nodes : [';
                    for (var i = 0; i < tree.childNodes.length; i++) {
                        objStr += traverse(tree.childNodes[i], '');
                    }
                    objStr += ']}},';
                } else {
                    if (tree.nodeValue == null) {
                        attribs.push('nodeValue : ""');
                        if (attribs.length > 0) {
                            attribStr = '{' + attribs.join(', ') + '}';
                        }
                        objStr += '{' + tree.tagName + ' : ' + attribStr + '}';
                    }
                }
                return objStr;
            }

                if (xDoc.childNodes.length > 0) {
                    if (msie) {
                        docObj += traverse(xDoc.documentElement, '');
                    } else {
                        if (xDoc.childNodes[0].nodeType == 10) {
                            docObj += traverse(xDoc.childNodes[1], '');
                        } else {
                            docObj += traverse(xDoc.childNodes[0], '');
                        }
                    }
                } else {
                    docObj += '{}';
                }

                // Some clean up on the docObj string.
                if (docObj.charAt(docObj.length - 1) == ',') {
                    docObj = docObj.substring(0, (docObj.length - 1));
                }

                eval(docObj);
                obj = xml;
                break;

            // Parse CSV or TSV response
            case 'csv':
                var start = 0;
                var csvDoc = (response.text != undefined) ? response.text : response.toString();
                var csvObj = 'var csv = ';
                var csvRows = [];

                var csvAry = csvDoc.replace(/\r/g, "").split("\n");

                if (fields) {
                    var csvFields = csvAry[0].split(delim);
                    var start = 1;
                }

                var csvAryLen = csvAry.length;
                for (var k = start; k < csvAryLen; k++) {
                    if (csvAry[k] != '') {
                        if (csvAry[k].indexOf('"') != -1) {
                            var matches = csvAry[k].match(/"([^"]*)"/g);
                            var filtered = [];
                            if (matches.length > 0) {
                                var matlen = matches.length;
                                for (var m = 0; m < matlen; m++) {
                                    var filt = matches[m].replace(/,/g, '[{c}]');
                                    filt = filt.replace(/"/g, '');
                                    filtered.push(filt);
                                    csvAry[k] = csvAry[k].replace(matches[m], filtered[m]);
                                }
                            }
                            var csvRowFiltered = csvAry[k];
                        } else {
                            var csvRowFiltered = csvAry[k];
                        }

                        var csvRow = csvRowFiltered.split(delim);
                        var cRw = [];

                        var csvRowLen = csvRow.length;
                        for (var l = 0; l < csvRowLen; l++) {
                            if (csvRow[l].indexOf('[{c}]') != -1) {
                                csvRow[l] = csvRow[l].replace(/\[{c}\]/g, ',');
                            }
                            if (fields) {
                                cRw.push(csvFields[l] + ' : "' + csvRow[l] + '"');
                            } else {
                                cRw.push('"' + csvRow[l] + '"');
                            }
                        }

                        if (fields) {
                            csvRows.push('{' + cRw.join(', ') + '}');
                        } else {
                            csvRows.push('[' + cRw.join(', ') + ']');
                        }
                    }
                }

                if (fields) {
                    csvObj += '[' + csvRows.join(', ') + ']';
                } else {
                    csvObj += '[' + csvRows.join(', ') + ']';
                }

                eval(csvObj);
                obj = csv;
                break;

            // Else just return plain text response
            default:
                obj = response.text;
        }

        if (trace != null) {
            trace.apply(undefined, [response]);
        }
        return obj;
    };

    /**
     * Function to get a response
     *
     * @param   {Number} index
     * @returns {Object}
     */
    window.jax.getResponse = function(index) {
        var response = {};

        if (window.jax.requests[index] != undefined) {
            var response = {
                request    : window.jax.requests[index],
                headers    : {},
                status     : 0,
                statusText : '',
                body       : '',
                text       : '',
                xml        : ''
            };
            var h = window.jax.requests[index].getAllResponseHeaders();
            if ((h != null) && (h != '')) {
                h = h.split("\n");
                for (var i = 0; i < h.length; i++) {
                    var head = h[i].substring(0, h[i].indexOf(':')).trim();
                    var val  = h[i].substring(h[i].indexOf(':') + 1).trim();
                    if (head != '') {
                        response.headers[head] = val;
                    }
                }
            }
            response.status     = window.jax.requests[index].status;
            response.statusText = window.jax.requests[index].statusText;
            response.body       = (typeof window.jax.requests[index].response != 'undefined')     ? window.jax.requests[index].response : '';
            response.text       = (typeof window.jax.requests[index].responseText != 'undefined') ? window.jax.requests[index].responseText : '';
            response.xml        = (typeof window.jax.requests[index].responseXML != 'undefined')  ? window.jax.requests[index].responseXML : '';
        }

        return response;
    };
})(window);

/**
 * ajax/get.js
 */
(function(window){
    /**
     * Alias function to perform a POST AJAX request
     *
     * @param   {String} url
     * @param   {Object} opts
     * @returns {Mixed}
     */
    window.jax.post = function(url, opts) {
        if (opts == undefined) {
            opts = {method : 'post'};
        } else if ((opts.method == undefined) || ((opts.method != undefined) && (opts.method.toLowerCase() != 'post'))) {
            opts.method = 'post';
        }
        return window.jax.ajax(url, opts);
    };
})(window);
/**
 * append.js
 */
jax.extend({
    /**
     * Function to append an new element to the current element
     *
     * @param   {String}  type
     * @param   {Object}  attribs
     * @param   {String}  value
     * @param   {Boolean} pre
     * @returns {jax}
     */
    append : function(type, attribs, value, pre) {
        if (this[0] == undefined) {
            throw 'An object must be selected in which to append.';
        }

        // Create the child element.
        var objChild = document.createElement(type);

        // Set any element attributes.
        if ((attribs != undefined) && (attribs != null)) {
            for (var attrib in attribs) {
                objChild.setAttribute(attrib, attribs[attrib]);
            }
        }

        // If the element type is a textarea
        if (type == 'textarea') {
            if (window.jax.browser.msie) {
                objChild.innerText = (value != null) ? value : '';
            } else {
                objChild.innerHTML = (value != null) ? new window.jax.String(value).html(true) : '';
            }
            // Else, set any value within the element.
        } else {
            if ((value != undefined) && (value != null)) {
                objChild.innerHTML = value;
            }
        }

        // Prepend or append the child element to the parent element.
        if ((pre != undefined) && (pre) && (this[0].childNodes[0] != undefined)) {
            this[0].insertBefore(objChild, this[0].childNodes[0]);
        } else {
            this[0].appendChild(objChild);
        }

        return this;
    },
    /**
     * Alias function to prepend a new element to the current element
     *
     * @param   {String} type
     * @param   {Object} attribs
     * @param   {String} value
     * @returns {jax}
     */
    prepend : function(type, attribs, value) {
        return this.append(type, attribs, value, true)
    }
});
/**
 * append/select.js
 */
jax.extend({
    /**
     * Function to append a new select element to the current element
     *
     * @param   {Array}   values
     * @param   {Object}  attribs
     * @param   {Mixed}   marked
     * @param   {String}  optionsFile
     * @param   {Boolean} pre
     * @returns {jax}
     */
    appendSelect : function(values, attribs, marked, optionsFile, pre) {
        // Set the parent element and define the properties.
        var objChild = document.createElement('select');
        var objValues = [];
        var objMarked = (marked != undefined) ? marked : null;

        // Set any element attributes.
        if ((attribs != undefined) && (attribs != null)) {
            for (var attrib in attribs) {
                objChild.setAttribute(attrib, attribs[attrib]);
            }
        }

        // If value passed was a YEAR flag, calculate the year range and set the values
        if (values.indexOf('YEAR') != -1) {
            var years = ['----'];
            var yearAry = values.split('_');

            if ((yearAry[1] != undefined) && (yearAry[2] != undefined)) {
                if (yearAry[1] < yearAry[2]) {
                    for (var i = yearAry[1]; i <= yearAry[2]; i++) {
                        years.push(i);
                    }
                } else {
                    for (var i = yearAry[1]; i >= yearAry[2]; i--) {
                        years.push(i);
                    }
                }
            } else if (yearAry[1] != undefined) {
                var d = new Date();
                var year = d.getFullYear();
                if (year < yearAry[1]) {
                    for (var i = year; i <= yearAry[1]; i++) {
                        years.push(i);
                    }
                } else {
                    for (var i = year; i >= yearAry[1]; i--) {
                        years.push(i);
                    }
                }
            } else {
                var d = new Date();
                var year = d.getFullYear();
                for (var i = year; i <= (year + 10); i++) {
                    years.push(i);
                }
            }
            vl = years;
            // Else, set the values based of a pre-defined flag, or the an array of values passed.
        } else {
            var vl = null;
            switch (values) {
                // Months, numeric short values.
                case 'MONTHS_SHORT':
                    vl = [
                        ['--', '--'], ['01', '01'], ['02', '02'], ['03', '03'], ['04', '04'], ['05', '05'],
                        ['06', '06'], ['07', '07'], ['08', '08'], ['09', '09'], ['10', '10'], ['11', '11'],
                        ['12', '12']
                    ];
                    break;
                // Months, long name values.
                case 'MONTHS_LONG':
                    vl = [
                        ['--', '------'], ['01', 'January'], ['02', 'February'], ['03', 'March'], ['04', 'April'],
                        ['05', 'May'], ['06', 'June'], ['07', 'July'], ['08', 'August'], ['09', 'September'],
                        ['10', 'October'], ['11', 'November'], ['12', 'December']
                    ];
                    break;
                // Days of Month, numeric short values.
                case 'DAYS_OF_MONTH':
                    vl = [
                        ['--', '--'], ['01', '01'], ['02', '02'], ['03', '03'], ['04', '04'], ['05', '05'],
                        ['06', '06'], ['07', '07'], ['08', '08'], ['09', '09'], ['10', '10'], ['11', '11'],
                        ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'],
                        ['18', '18'], ['19', '19'], ['20', '20'], ['21', '21'], ['22', '22'], ['23', '23'],
                        ['24', '24'], ['25', '25'], ['26', '26'], ['27', '27'], ['28', '28'], ['29', '29'],
                        ['30', '30'], ['31', '31']
                    ];
                    break;
                // Days of Week, long name values.
                case 'DAYS_OF_WEEK':
                    vl = [
                        ['--', '------'], ['Sunday', 'Sunday'], ['Monday', 'Monday'], ['Tuesday', 'Tuesday'],
                        ['Wednesday', 'Wednesday'], ['Thursday', 'Thursday'], ['Friday', 'Friday'],
                        ['Saturday', 'Saturday']
                    ];
                    break;
                // Hours, 12-hour values.
                case 'HOURS_12':
                    vl = [
                        ['--', '--'], ['01', '01'], ['02', '02'], ['03', '03'], ['04', '04'], ['05', '05'],
                        ['06', '06'], ['07', '07'], ['08', '08'], ['09', '09'], ['10', '10'], ['11', '11'],
                        ['12', '12']];
                    break;
                // Hours, 24-hour values.
                case 'HOURS_24':
                    vl = [
                        ['--', '--'], ['00', '00'], ['01', '01'], ['02', '02'], ['03', '03'], ['04', '04'],
                        ['05', '05'], ['06', '06'], ['07', '07'], ['08', '08'], ['09', '09'], ['10', '10'],
                        ['11', '11'], ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'],
                        ['17', '17'], ['18', '18'], ['19', '19'], ['20', '20'], ['21', '21'], ['22', '22'],
                        ['23', '23']
                    ];
                    break;
                // Minutes, incremental by 1 minute.
                case 'MINUTES':
                    vl = [
                        ['--', '--'], ['00', '00'], ['01', '01'], ['02', '02'], ['03', '03'], ['04', '04'],
                        ['05', '05'], ['06', '06'], ['07', '07'], ['08', '08'], ['09', '09'], ['10', '10'],
                        ['11', '11'], ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'],
                        ['17', '17'], ['18', '18'], ['19', '19'], ['20', '20'], ['21', '21'], ['22', '22'],
                        ['23', '23'], ['24', '24'], ['25', '25'], ['26', '26'], ['27', '27'], ['28', '28'],
                        ['29', '29'], ['30', '30'], ['31', '31'], ['32', '32'], ['33', '33'], ['34', '34'],
                        ['35', '35'], ['36', '36'], ['37', '37'], ['38', '38'], ['39', '39'], ['40', '40'],
                        ['41', '41'], ['42', '42'], ['43', '43'], ['44', '44'], ['45', '45'], ['46', '46'],
                        ['47', '47'], ['48', '48'], ['49', '49'], ['50', '50'], ['51', '51'], ['52', '52'],
                        ['53', '53'], ['54', '54'], ['55', '55'], ['56', '56'], ['57', '57'], ['58', '58'],
                        ['59', '59']
                    ];
                    break;
                // Minutes, incremental by 5 minutes.
                case 'MINUTES_5':
                    vl = [
                        ['--', '--'], ['00', '00'], ['05', '05'], ['10', '10'], ['15', '15'], ['20', '20'],
                        ['25', '25'], ['30', '30'], ['35', '35'], ['40', '40'], ['45', '45'], ['50', '50'],
                        ['55', '55']
                    ];
                    break;
                // Minutes, incremental by 10 minutes.
                case 'MINUTES_10':
                    vl = [['--', '--'], ['00', '00'], ['10', '10'], ['20', '20'], ['30', '30'], ['40', '40'], ['50', '50']];
                    break;
                // Minutes, incremental by 15 minutes.
                case 'MINUTES_15':
                    vl = [['--', '--'], ['00', '00'], ['15', '15'], ['30', '30'], ['45', '45']];
                    break;
                default:
                    // If an array is passed, set the values to the array.
                    if (values.constructor == Array) {
                        vl = values;
                        // Else, if a string is passed, check for any option sets in the options XML file in the data folder, based on the string passed.
                    } else if (optionsFile != null) {
                        vl = window.jax.parseOptionsFile(optionsFile, values);
                    }
            }
        }

        if (vl.constructor == Array) {
            for (var i = 0; i < vl.length; i++) {
                objValues.push(vl[i]);
            }
        } else {
            objValues.push(vl);
        }

        // Create the option elements.
        for (var i = 0; i < objValues.length; i++) {
            var newOpt = document.createElement('option');
            var valuesAry = (objValues[i].constructor != Array) ? [objValues[i], objValues[i]] : objValues[i];
            newOpt.setAttribute('value', valuesAry[0]);
            if (objMarked != null) {
                if (objMarked.constructor != Array) {
                    newOpt.selected = !!((objMarked == valuesAry[1]));
                } else {
                    newOpt.selected = !!((objMarked.indexOf(valuesAry[1]) != -1));
                }
            }
            newOpt.innerHTML = valuesAry[1];
            objChild.appendChild(newOpt);
        }

        // Prepend or append the child element to the parent element.
        if ((pre != undefined) && (pre) && (this[0].childNodes[0] != undefined)) {
            this[0].insertBefore(objChild, this[0].childNodes[0]);
        } else {
            this[0].appendChild(objChild);
        }

        return this;
    },
    /**
     * Alias function to prepend a new select element to the current element
     *
     * @param   {Array}  values
     * @param   {Object} attribs
     * @param   {Mixed}  marked
     * @param   {String} optionsFile
     * @returns {jax}
     */
    prependSelect : function(values, attribs, marked, optionsFile) {
        return this.appendSelect(values, attribs, marked, optionsFile, true);
    }
});

(function(window){
    /**
     * Function to parse an options XML file
     *
     * @param   {String} file
     * @param   {Array}  values
     * @returns {Array}
     */
    window.jax.parseOptionsFile = function(file, values) {
        var xml = window.jax.ajax(file);
        var optionNames = [];
        if (xml.options.nodes != undefined) {
            for (var i = 0; i < xml.options.nodes.length; i++) {
                if ((xml.options.nodes[i] != undefined) && (xml.options.nodes[i].set.name != undefined)) {
                    optionNames.push(xml.options.nodes[i].set.name);
                }
            }
        }
        // If found, construct the values array based on the values found.
        if (optionNames.indexOf(values) != -1) {
            var vl = [];
            for (var i = 0; i < xml.options.nodes.length; i++) {
                if ((xml.options.nodes[i] != undefined) && (xml.options.nodes[i].set.name == values)) {
                    for (var j = 0; j < xml.options.nodes[i].set.nodes.length; j++) {
                        if (xml.options.nodes[i].set.nodes[j] != undefined) {
                            vl.push([xml.options.nodes[i].set.nodes[j].opt.value, xml.options.nodes[i].set.nodes[j].opt.nodeValue]);
                        }
                    }
                }
            }
            // Else, just set the values array to the original parameter passed.
        } else {
            var vl = values;
        }

        return vl;
    };
})(window);
/**
 * append/textarea.js
 */
jax.extend({
    /**
     * Alias function to append a new textarea element to the current element
     *
     * @param   {Object}  attribs
     * @param   {String}  value
     * @param   {Boolean} pre
     * @returns {jax}
     */
    appendTextarea : function(attribs, value, pre) {
        return this.append('textarea', attribs, value, pre);
    },
    /**
     * Alias function to prepend a new textarea element to the current element
     *
     * @param   {Object} attribs
     * @param   {String} value
     * @returns {jax}
     */
    prependTextarea : function(attribs, value) {
        return this.append('textarea', attribs, value, true);
    }
});
/**
 * append/input.js
 */
jax.extend({
    /**
     * Alias function to append a new input element to the current element
     *
     * @param   {Object}  attribs
     * @param   {Boolean} pre
     * @returns {jax}
     */
    appendInput : function(attribs, pre) {
        return this.append('input', attribs, null, pre);
    },
    /**
     * Alias function to prepend a new input element to the current element
     *
     * @param   {Object} attribs
     * @returns {jax}
     */
    prependInput : function(attribs) {
        return this.append('input', attribs, null, true);
    }
});
/**
 * append/checkbox.js
 */
jax.extend({
    /**
     * Function to append a new set of checkbox elements to the current element
     *
     * @param   {Array}   values
     * @param   {Object}  attribs
     * @param   {Mixed}   marked
     * @param   {Boolean} pre
     * @returns {jax}
     */
    appendCheckbox : function(values, attribs, marked, pre) {
        if (this[0] == undefined) {
            throw 'An object must be selected in which to append.';
        }

        // Set the main child element.
        var objValues = [];
        var objMarked = [];
        var objChild = document.createElement('fieldset');
        objChild.setAttribute('class', 'check-box-fieldset');

        // Set the elements' values.
        if (values.constructor == Array) {
            for (var i = 0; i < values.length; i++) {
                objValues.push(values[i]);
            }
        } else {
            objValues.push(values);
        }

        // Set the elements that are marked/checked.
        if ((marked != undefined) && (marked != null)) {
            if (marked.constructor == Array) {
                for (var i = 0; i < marked.length; i++) {
                    objMarked.push(marked[i]);
                }
            } else {
                objMarked.push(marked);
            }
        }

        // Create the child checkbox elements.
        for (var i = 0; i < objValues.length; i++) {
            var newElem = document.createElement('input');
            newElem.setAttribute('type', 'checkbox');
            newElem.setAttribute('class', 'check-box');

            // Set any element attributes.
            if ((attribs != undefined) && (attribs != null)) {
                for (var attrib in attribs) {
                    var att = ((attrib == 'id') && (i > 0)) ? attribs[attrib] + i : attribs[attrib];
                    // Account for IE7 style property issue.
                    newElem.setAttribute(attrib, att);
                }
            }

            // Set elements' values and append them to the parent element.
            var valuesAry = (objValues[i].constructor != Array) ? [objValues[i], objValues[i]] : objValues[i];
            newElem.setAttribute('value', valuesAry[0]);
            newElem.checked = (objMarked.indexOf(valuesAry[1]) != -1);
            objChild.appendChild(newElem);

            var spanElem = document.createElement('span');
            spanElem.setAttribute('class', 'check-span');
            spanElem.innerHTML = valuesAry[1];

            objChild.appendChild(spanElem);
        }

        // Prepend or append the child element to the parent element.
        if ((pre != undefined) && (pre) && (this[0].childNodes[0] != undefined)) {
            this[0].insertBefore(objChild, this[0].childNodes[0]);
        } else {
            this[0].appendChild(objChild);
        }

        return this;
    },
    /**
     * Alias function to prepend a new set of checkbox elements to the current element
     *
     * @param   {Array}  values
     * @param   {Object} attribs
     * @param   {Mixed}  marked
     * @returns {jax}
     */
    prependCheckbox : function(values, attribs, marked) {
        return this.appendCheckbox(values, attribs, marked, true);
    }
});
/**
 * append/radio.js
 */
jax.extend({
    /**
     * Function to append a new set of radio elements to the current element
     *
     * @param   {Array}   values
     * @param   {Object}  attribs
     * @param   {String}  marked
     * @param   {Boolean} pre
     * @returns {jax}
     */
    appendRadio : function(values, attribs, marked, pre) {
        if (this[0] == undefined) {
            throw 'An object must be selected in which to append.';
        }

        // Set the main child element.
        var objValues = [];
        var objMarked = (marked != undefined) ? marked : null;
        var objChild = document.createElement('fieldset');
        objChild.setAttribute('class', 'radio-btn-fieldset');

        // Set the elements' values.
        if (values.constructor == Array) {
            for (var i = 0; i < values.length; i++) {
                objValues.push(values[i]);
            }
        } else {
            objValues.push(values);
        }

        // Create the child elements.
        for (var i = 0; i < objValues.length; i++) {
            var newElem = document.createElement('input');
            newElem.setAttribute('type', 'radio');
            newElem.setAttribute('class', 'radio-btn');

            // Set any element attributes.
            if ((attribs != undefined) && (attribs != null)) {
                for (var attrib in attribs) {
                    var att = ((attrib == 'id') && (i > 0)) ? attribs[attrib] + i : attribs[attrib];
                    newElem.setAttribute(attrib, att);
                }
            }

            // Set elements' values and append them to the parent element.
            var valuesAry = (objValues[i].constructor != Array) ? [objValues[i], objValues[i]] : objValues[i];
            newElem.setAttribute('value', valuesAry[0]);

            if (objMarked != null) {
                newElem.checked = (objMarked == valuesAry[1]);
            }
            objChild.appendChild(newElem);

            var spanElem = document.createElement('span');
            spanElem.setAttribute('class', 'radio-span');
            spanElem.innerHTML = valuesAry[1];

            objChild.appendChild(spanElem);
        }

        // Prepend or append the child element to the parent element.
        if ((pre != undefined) && (pre) && (this[0].childNodes[0] != undefined)) {
            this[0].insertBefore(objChild, this[0].childNodes[0]);
        } else {
            this[0].appendChild(objChild);
        }

        return this;
    },
    /**
     * Alias function to prepend a new set of radio elements to the current element
     *
     * @param   {Array}  values
     * @param   {Object} attribs
     * @param   {Mixed}  marked
     * @returns {jax}
     */
    prependRadio : function(values, attribs, marked) {
        return this.appendRadio(values, attribs, marked, true);
    }
});
/**
 * attrib.js
 */
jax.extend({
    /**
     * Function to get or set element attributes
     *
     * @param   {String} name
     * @param   {String} value
     * @returns {Mixed}
     */
    attrib : function(name, value) {
        if (this.length > 0) {
            // Set attribute(s)
            if ((name != null) && (name.constructor == Object) || (value != null)) {
                for (var i = 0; i < this.length; i++) {
                    // If multiple attributes to set
                    if (name.constructor == Object) {
                        for (var prop in name) {
                            this[i].setAttribute(prop, name[prop]);
                        }
                        // Else, set single attributes
                    } else {
                        this[i].setAttribute(name, value);
                    }
                }
                return this;
                // Get attribute(s)
            } else if (this[0] != undefined) {
                // If no name is passed, get all object attributes
                if (name == null) {
                    var atts = {};
                    for (var i = 0; i < this[0].attributes.length; i++) {
                        if ((this[0].attributes[i].nodeValue != null) &&
                            (this[0].attributes[i].nodeValue != undefined) &&
                            (this[0].attributes[i].nodeValue != '')) {
                            atts[this[0].attributes[i].nodeName] = this[0].attributes[i].nodeValue;
                        }
                    }
                    return atts;
                    // Else, just get the single attribute value
                } else {
                    return this[0].getAttribute(name);
                }
            }
        }
    },
    /**
     * Function to get or set data-* attributes of an element
     *
     * @param   {String} name
     * @param   {String} value
     * @returns {Mixed}
     */
    data : function(name, value) {
        if (this.length > 0) {
            if ((name.constructor == Object) || (value != null)) {
                for (var i = 0; i < this.length; i++) {
                    if (name.constructor == Object) {
                        for (var prop in name) {
                            this[i].setAttribute('data-' + prop, name[prop]);
                        }
                    } else {
                        this[i].setAttribute('data-' + name, value);
                    }
                }
                return this;
            } else if (this[0] != undefined) {
                return this[0].getAttribute('data-' + name);
            }
        }
    }
});
/**
 * browser.js
 */
(function(window){
    /** Initial browser object and detection */
    var browser = {
        ua      : navigator.userAgent,
        os      : null,  name    : null,  version : null,
        webkit  : false, mozilla : false, msie    : false,
        chrome  : false, safari  : false, opera   : false,

        // Define mobile browser properties
        mobile     : false, tablet     : false,
        android    : false, apple      : false, windows    : false,
        blackberry : false, pre        : false, device     : null,
        geo        : false,
        /**
         * Function to open a browser window
         *
         * @param {String} url
         * @param {String} name
         * @param {Object} opts
         */
        open : function(url, name, opts) {
            var wid  = (opts.width != undefined)    ? opts.width    : 640;
            var hgt  = (opts.height != undefined)   ? opts.height   : 480;
            var scr  = (opts.scroll != undefined)   ? opts.scroll   : 'no';
            var res  = (opts.resize != undefined)   ? opts.resize   : 'no';
            var stat = (opts.status != undefined)   ? opts.status   : 'no';
            var loc  = (opts.location != undefined) ? opts.location : 'no';
            var mnu  = (opts.menu != undefined)     ? opts.menu     : 'no';
            var tool = (opts.tool != undefined)     ? opts.tool     : 'no';
            var x    = (opts.x != undefined)        ? opts.x        : (screen.width / 2) - (wid / 2);
            var y    = (opts.y != undefined)        ? opts.y        : (screen.height / 2) - (hgt / 2);

            var windowOpts = 'width=' + wid + ',height=' + hgt + ',scrollbars=' + scr + ',resizable=' + res +
                ',status=' + stat + ',location=' + loc + ',menubar=' + mnu + ',toolbar=' + tool +
                ',left=' + x + ',top=' + y;
            window.open(url, name, windowOpts);
        },
        /**
         * Function to route browser to a specific device
         *
         * @param {Object} opts
         */
        route : function(options) {
            if (options == undefined) {
                throw 'The options were not defined.';
            } else if (options.mobile == undefined) {
                throw 'The mobile URL was not defined.';
            }
            var mobile = options.mobile;
            var desktop = (options.desktop != undefined) ? options.desktop : location.href;

            // Route based on force property
            if (options.force != undefined) {
                if ((options.force.toLowerCase() == 'desktop') && (location.href.indexOf(desktop) == -1)) {
                    window.location = desktop;
                } else if ((options.force.toLowerCase() == 'mobile') && (location.href.indexOf(mobile) == -1)) {
                    window.location = mobile;
                }
                // Else, just route to mobile, if mobile
            } else {
                if ((this.mobile) && (location.href.indexOf(mobile) == -1)) {
                    window.location = mobile;
                }
            }
        }
    };

    /** Calculate browser properties */
    var os  = browser.ua.toLowerCase().match(/(windows|macintosh|linux|freebsd|openbsd|netbsd|sunos)/i);
    var brw = browser.ua.toLowerCase().match(/(chrome|firefox|msie|trident|konqueror|navigator|opera|safari)/i);
    var dev = browser.ua.toLowerCase().match(/(android|blackberry|windows ce|windows phone|opera mini|pre|presto|ipod|iphone|ipad|nokia|symbian|palm|treo|hiptop|avantgo|plucker|xiino|blazer|elaine|teleca|up.browser|up.link|mmp|smartphone|midp|wap|vodafone|o2|pocket|kindle|mobile|pda|psp)/i);

    /** Get platform OS */
    if ((os != null) && (os[0] != undefined)) {
        browser.os = os[0].charAt(0).toUpperCase() + os[0].substring(1).replace('bsd', 'BSD').replace('os', 'OS');
    }

    /** Get browser name */
    if ((brw != null) && (brw[0] != undefined)) {
        if ((brw[0] == 'msie') || (brw[0] == 'trident')) {
            browser.name = 'MSIE';
        } else {
            browser.name = brw[0].charAt(0).toUpperCase() + brw[0].substring(1);
        }
    }

    /** Is it webkit */
    browser.webkit = (browser.ua.toLowerCase().indexOf('webkit') != -1) ;

    /** Has geolocation */
    browser.geo = (navigator.geolocation) ? navigator.geolocation : false;

    /** Get browser and version */
    switch (browser.name) {
        case 'Chrome':
            browser.chrome = true;
            browser.version = browser.ua.substring(browser.ua.indexOf('Chrome/') + 7);
            browser.version = browser.version.substring(0, browser.version.indexOf(' '));
            break;
        case 'Firefox':
            browser.mozilla = true;
            browser.version = browser.ua.substring(browser.ua.indexOf('Firefox/') + 8);
            break;
        case 'MSIE':
            browser.msie = true;
            if (browser.ua.indexOf('MSIE ') != -1) {
                browser.version = browser.ua.substring(browser.ua.indexOf('MSIE ') + 5);
                browser.version = browser.version.substring(0, browser.version.indexOf(';'));
            } else {
                browser.version = browser.ua.substring(browser.ua.indexOf('rv:') + 3);
                browser.version = browser.version.substring(0, browser.version.indexOf(')'));
            }
            break;
        case 'Konqueror':
            browser.version = browser.ua.substring(browser.ua.indexOf('Konqueror/') + 10);
            browser.version = browser.version.substring(0, browser.version.indexOf(';'));
            break;
        case 'Navigator':
            browser.mozilla = true;
            browser.version = browser.ua.substring(browser.ua.indexOf('Navigator/') + 10);
            break;
        case 'Opera':
            browser.opera = true;
            browser.version = browser.ua.substring(browser.ua.indexOf('Opera/') + 6);
            browser.version = browser.version.substring(0, browser.version.indexOf(' '));
            break;
        case 'Safari':
            browser.safari = true;
            browser.version = browser.ua.substring(browser.ua.indexOf('Version/') + 8);
            browser.version = browser.version.substring(0, browser.version.indexOf(' '));
            break;
    }

    /** If mobile, get device */
    if ((dev != null) && (dev[0] != undefined)) {
        browser.device = dev[0];
        browser.mobile = true;
        browser.tablet = (browser.device == 'ipad') ? true : !(browser.ua.indexOf('Mobile') != -1);

        switch (browser.device) {
            case 'android':
                browser.android = true;
                break;
            case 'blackberry':
                browser.blackberry = true;
                break;
            case 'ipod':
            case 'ipad':
            case 'iphone':
                browser.apple = true;
                break;
            case 'windows ce':
            case 'windows phone':
                browser.windows = true;
                break;
            case 'pre':
            case 'presto':
                browser.pre = true;
                break;
        }
    }

    window.jax.browser = browser;
})(window);

/**
 * children/child.js
 */
jax.extend({
    childIndex : 0,
    /**
     * Function to return the child nodes of an element
     *
     * @returns {Boolean}
     */
    hasChildren : function() {
        return ((this[0] != undefined) && (this[0].hasChildNodes()));
    },
    /**
     * Function to return the child nodes of an element
     *
     * @returns {Array}
     */
    children : function() {
        return ((this[0] != undefined) && (this[0].hasChildNodes())) ? this[0].childNodes : [];
    },
    /**
     * Function to get a child element of the current element
     *
     * @returns {Mixed}
     */
    child : function(i) {
        if ((this[0] != undefined) && (this[0].hasChildNodes())) {
            this.childIndex = i;
            return this[0].childNodes[this.childIndex];
        } else {
            return undefined;
        }
    },
    /**
     * Function to return the first child node of an element
     *
     * @returns {Mixed}
     */
    first : function() {
        if ((this[0] != undefined) && (this[0].hasChildNodes())) {
            this.childIndex = 0;
            return this[0].childNodes[this.childIndex];
        } else {
            return undefined;
        }
    },
    /**
     * Function to return the last child node of an element
     *
     * @returns {Mixed}
     */
    last : function() {
        if ((this[0] != undefined) && (this[0].hasChildNodes())) {
            this.childIndex = this[0].childNodes.length - 1;
            return this[0].childNodes[this.childIndex];
        } else {
            return undefined;
        }
    },
    /**
     * Function to return the next child node of an element
     *
     * @returns {Mixed}
     */
    next : function() {
        if ((this[0] != undefined) && (this[0].hasChildNodes())) {
            if (this.childIndex == (this[0].childNodes.length - 1)) {
                this.childIndex = 0;
            } else {
                this.childIndex++;
            }
            return this[0].childNodes[this.childIndex];
        } else {
            return undefined;
        }
    },
    /**
     * Function to return the previous child node of an element
     *
     * @returns {Mixed}
     */
    prev : function() {
        if ((this[0] != undefined) && (this[0].hasChildNodes())) {
            if (this.childIndex == 0) {
                this.childIndex = this[0].childNodes.length - 1;
            } else {
                this.childIndex--;
            }
            return this[0].childNodes[this.childIndex];
        } else {
            return undefined;
        }
    }
});
/**
 * children/contains.js
 */
(function(window){
    /**
     * Function to check if the container contains the contained
     *
     * @param   {Object}  container
     * @param   {Object}  contained
     * @returns {Boolean}
     */
    window.jax.contains = function(container, contained) {
        // Function to traverse a node
        var traverse = function(parent, child) {
            var contains = false;
            if (parent.hasChildNodes()) {
                for (var i = 0; i < parent.childNodes.length; i++) {
                    if (parent.childNodes[i] == child) {
                        contains = true;
                    } else if (!contains) {
                        contains = traverse(parent.childNodes[i], child);
                    }
                }
            }
            return contains;
        };

        return traverse(container, contained);
    };
})(window);
/**
 * children/parent.js
 */
jax.extend({
    /**
     * Function to determine if there is a parent node
     *
     * @returns {Boolean}
     */
    hasParent : function() {
        return ((this[0] != undefined) && (this[0].parentNode != undefined));
    },
    /**
     * Function to get the parent element of the current element
     *
     * @returns {Mixed}
     */
    parent : function() {
        return ((this[0] != undefined) && (this[0].parentNode != undefined)) ? this[0].parentNode : undefined;
    }
});
/**
 * clone.js
 */
jax.extend({
    cloned : null,
    /**
     * Function to clone an element
     *
     * @param   {Object}  attribs
     * @param   {Boolean} deep
     * @param   {Boolean} events
     * @returns {jax}
     */
    clone  : function(attribs, deep, events) {
        if (this[0] == undefined) {
            throw 'An object must be selected to clone.';
        }

        var d = (deep != undefined)   ? deep : true;
        var e = (events != undefined) ? events : false;
        var c = this[0].cloneNode(d);

        // Define the events to check for
        var evts = [
            'onblur', 'onchange', 'onclick', 'onfocus', 'onkeydown',
            'onkeyup', 'onkeypress', 'onmousedown', 'onmouseenter',
            'onmouseleave', 'onmousemove', 'onmouseover', 'onmouseout',
            'onmouseup', 'onscroll', 'onselect', 'onsubmit'
        ];

        // Function to recursively crawl through the
        // child nodes to check for and assign events
        var crawl = function(par, cloned) {
            if (par.hasChildNodes()) {
                for (var j = 0; j < par.childNodes.length; j++) {
                    for (var k = 0; k < evts.length; k++) {
                        if (par.childNodes[j][evts[k]] != undefined) {
                            cloned.childNodes[j][evts[k]] = par.childNodes[j][evts[k]];
                        }
                    }
                    if (par.childNodes[j].hasChildNodes()) {
                        crawl(par.childNodes[j], cloned.childNodes[j]);
                    }
                }
            }
        };

        // Set any element override attributes.
        if ((attribs != undefined) && (attribs != null)) {
            for (var attrib in attribs) {
                c.setAttribute(attrib, attribs[attrib]);
            }
        }

        // If the events flag is set
        if (e) {
            for (var i = 0; i < evts.length; i++) {
                if (this[0][evts[i]] != undefined) {
                    c[evts[i]] = this[0][evts[i]];
                }
            }
            // If the deep flag is set, crawl for child events
            if (d) {
                crawl(this[0], c);
            }
        }

        this.cloned = c;
        return this;
    },
    /**
     * Function to append an newly cloned element to another one
     *
     * @param   {Mixed}  selector
     * @param   {Object} cloned
     * @returns {jax}
     */
    appendTo : function(selector, cloned) {
        if ((cloned == undefined) && (this.cloned != undefined)) {
            cloned = this.cloned;
            this.cloned = null;
        } else {
            throw 'The child object to append was not defined.';
        }
        window.jax(selector)[0].appendChild(cloned);
        return this;
    },
    /**
     * Function to prepend an newly cloned element to another one
     *
     * @param   {Mixed}  selector
     * @param   {Object} cloned
     * @returns {jax}
     */
    prependTo : function(selector, cloned) {
        if ((cloned == undefined) && (this.cloned != undefined)) {
            cloned = this.cloned;
            this.cloned = null;
        } else {
            throw 'The child object to prepend was not defined.';
        }
        var obj = window.jax(selector)[0];
        if (obj.childNodes[0] != undefined) {
            obj.insertBefore(cloned, obj.childNodes[0]);
        }
        return this;
    }
});
/**
 * cookie.js
 */
(function(window){
    window.jax.cookie = {
        /**
         * Function to save a cookie
         *
         * @param   {String} name
         * @param   {String} value
         * @param   {Object} options
         * @returns {Object}
         */
        save : function(name, value, options) {
            if (typeof value != 'string') {
                if (typeof value == 'number') {
                    value = value.toString();
                } else {
                    value = JSON.stringify(value);
                }
            }
            var cookie = name + '=' + encodeURI(value);

            // Parse options
            if (options != undefined) {
                cookie += (options.domain != undefined) ? ';domain=' + options.domain : '';
                cookie += (options.path != undefined) ? ';path=' + options.path : '';
                if (options.expire != undefined) {
                    var expdate = new Date();
                    expdate.setDate(expdate.getDate() + options.expire);
                    cookie += ';expires=' + expdate.toGMTString();
                }
            }

            // Set the cookie.
            document.cookie = cookie;

            return this;
        },
        /**
         * Function to load a cookie value
         *
         * @param   {String} name
         * @returns {Mixed}
         */
        load : function(name) {
            var value = '';

            // If the cookie is set, parse the value.
            if (document.cookie.length > 0) {
                if (name == null) {
                    value = {};
                    var ary = document.cookie.split(';');
                    for (var i = 0; i < ary.length; i++) {
                        var a = ary[i].trim().split('=');
                        var n = a[0];
                        var v = decodeURI(a[1]);
                        if ((v.indexOf('{') != -1) || (v.indexOf('[') != -1)) {
                            v = JSON.parse(decodeURIComponent(v));
                        }
                        value[n] = v;
                    }
                } else {
                    var start = document.cookie.indexOf(name + '=');

                    if (start != -1) {
                        start = start + name.length + 1;
                        var end = document.cookie.indexOf(';', start);
                        if (end == -1) {
                            end = document.cookie.length;
                        }

                        value = decodeURI(document.cookie.substring(start, end));
                        if ((value.indexOf('{') != -1) || (value.indexOf('[') != -1)) {
                            value = JSON.parse(decodeURIComponent(value));
                        }
                    }
                }
            }

            return value;
        },
        /**
         * Function to remove a cookie or all cookies
         *
         * @param   {String} name
         * @returns {Object}
         */
        remove : function(name) {
            if (name == null) {
                var c = this.load();
                for (var n in c) {
                    this.save(n, '', {"expire" : -1});
                }
            } else {
                this.save(name, '', {"expire" : -1});
            }

            return this
        }
    };
})(window);

/**
 * css.js
 */
jax.extend({
    /** Function to determine whether or not current object is hidden */
    isHidden : function() {
        return (this[0] != null) ? (this[0].style.display == 'none') : -1;
    },
    /** Function to see if an element is within the view port */
    inView : function() {
        if (this[0] != undefined) {
            var wid = this.width();
            var hgt = this.height();

            if (window.jax.browser.msie) {
                var xPos = (document.documentElement.scrollLeft) ? document.documentElement.scrollLeft : document.body.scrollLeft;
                var yPos = (document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;
            } else {
                var xPos = window.scrollX;
                var yPos = window.scrollY;
            }

            return (
                ((this.view.height + yPos) > this[0].offsetTop) && ((hgt + this[0].offsetTop) > yPos) &&
                    ((this.view.width + xPos) > this[0].offsetLeft) && ((wid + this[0].offsetLeft) > xPos)
                );
        }
    },
    /**
     * Function to get or set CSS properties
     *
     * @param  {Mixed} props
     * @param  {Mixed} val
     * @return {Mixed}
     */
    css : function(props, val) {
        // Get the CSS value
        if ((props.constructor == String) && (val == null)) {
            return this.getCss(props);
            // Else, set the CSS values
        } else {
            for (var i = 0; i < this.length; i++) {
                this.setCss(this[i], props, val);
            }
            return this;
        }
    }
});
/**
 * css/dimensions.js
 */
jax.extend({
    /**
     * Function to get the height of either an object or the viewport directly.
     *
     * @param  {String|Number} hgt
     * @return {Number}
     */
    height : function(hgt) {
        if (this[0] != undefined) {
            if (hgt != null) {
                this.css('height', hgt);
            }
            var h =  parseInt(this.css('height'));
            return ((!isNaN(h)) ? h : 0);
        } else {
            return parseInt(this.view.height);
        }
    },
    /**
     * Function to get the inner height of either an object (no padding.)
     *
     * @return {Number}
     */
    innerHeight : function() {
        if (this[0] == undefined) {
            throw 'An object must be selected.';
        }

        var h  = parseInt(this.css('height'));
        var pt = parseInt(this.css('padding-top'));
        var pb = parseInt(this.css('padding-bottom'));

        return (((!isNaN(h)) ? h : 0) -
            ((!isNaN(pt)) ? pt : 0) -
            ((!isNaN(pb)) ? pb : 0));
    },
    /**
     * Function to get the outer height of either an object (margin included.)
     *
     * @return {Number}
     */
    outerHeight : function() {
        if (this[0] == undefined) {
            throw 'An object must be selected.';
        }

        var mt  = parseInt(this.css('margin-top'));
        var btw = parseInt(this.css('border-top-width'));
        var h   = parseInt(this.css('height'));
        var bbw = parseInt(this.css('border-bottom-width'));
        var mb  = parseInt(this.css('margin-bottom'));

        return (((!isNaN(mt)) ? mt : 0) +
            ((!isNaN(btw)) ? btw : 0) +
            ((!isNaN(h)) ? h : 0) +
            ((!isNaN(bbw)) ? bbw : 0) +
            ((!isNaN(mb)) ? mb : 0));
    },
    /**
     * Function to get the width of either an object or the viewport directly.
     *
     * @param  {String|Number} hgt
     * @return {Number}
     */
    width : function(wid) {
        if (this[0] != undefined) {
            if (wid != null) {
                this.css('width', wid);
            }
            var w =  parseInt(this.css('width'));
            return ((!isNaN(w)) ? w : 0);
        } else {
            return parseInt(this.view.width);
        }
    },
    /**
     * Function to get the inner width of either an object (no padding.)
     *
     * @return {Number}
     */
    innerWidth : function() {
        if (this[0] == undefined) {
            throw 'An object must be selected.';
        }

        var w  = parseInt(this.css('width'));
        var pl = parseInt(this.css('padding-left'));
        var pr = parseInt(this.css('padding-right'));

        return (((!isNaN(w)) ? w : 0) -
            ((!isNaN(pl)) ? pl : 0) -
            ((!isNaN(pr)) ? pr : 0));
    },
    /**
     * Function to get the outer width of either an object (margin included.)
     *
     * @return {Number}
     */
    outerWidth : function() {
        if (this[0] == undefined) {
            throw 'An object must be selected.';
        }

        var blw = parseInt(this.css('border-left-width'));
        var ml  = parseInt(this.css('margin-left'));
        var w   = parseInt(this.css('width'));
        var brw = parseInt(this.css('border-right-width'));
        var mr  = parseInt(this.css('margin-right'));

        return (((!isNaN(blw)) ? blw : 0) +
            ((!isNaN(ml)) ? ml : 0) +
            ((!isNaN(w)) ? w : 0) +
            ((!isNaN(brw)) ? brw : 0) +
            ((!isNaN(mr)) ? mr : 0));
    }
});
/**
 * css/position.js
 */
jax.extend({
    /** Function to get the element's offset top position */
    top : function() {
        return ((this[0] != undefined) && (this[0].offsetTop != undefined)) ? this[0].offsetTop : undefined;
    },
    /** Function to get the element's offset left position */
    left : function() {
        return ((this[0] != undefined) && (this[0].offsetLeft != undefined)) ? this[0].offsetLeft : undefined;
    }
});
/**
 * css/get.js
 */
jax.extend({
    /**
     * Function to get value of CSS property passed.
     *
     * @param  {Mixed} props
     * @return {Mixed}
     */
    getCss : function(props) {
        var sty = null;
        var styY = null;
        var opac = false;
        var formattedProp = null;
        var formattedPropY = null;

        if (this[0] != undefined) {
            switch(props) {
                // Handle the opacity/filter issue.
                case 'opacity':
                    formattedProp = ((window.jax.browser.msie) && (parseInt(window.jax.browser.version) < 10)) ? 'filter' : 'opacity';
                    opac = true;
                    break;
                // Handle the styleFloat/cssFloat issue.
                case 'float':
                    formattedProp = (window.jax.browser.msie) ? 'styleFloat' : 'cssFloat';
                    break;
                // Handle the backgroundPosition issue.
                case 'background-position':
                    if (window.jax.browser.msie) {
                        formattedProp  = 'backgroundPositionX';
                        formattedPropY = 'backgroundPositionY';
                    } else {
                        formattedProp  = 'backgroundPosition';
                    }
                    break;
                // Handle all other CSS properties.
                default:
                    // Create properly formatted property, converting a dashed property to a camelCase property if applicable.
                    if (props.indexOf('-') != -1) {
                        var propAry = props.split('-');
                        formattedProp = propAry[0].toLowerCase()
                        for (var i = 1; i < propAry.length; i++) {
                            formattedProp += propAry[i].substring(0, 1).toUpperCase() + propAry[i].substring(1);
                        }
                    } else {
                        formattedProp = props;
                    }
            }

            // Attempt to get the style if assigned via JavaScript, else attempt to get the style is computed/rendered via CSS.
            var assignedStyle = eval("this[0].style." + formattedProp + ";");
            var computedStyle = (window.jax.browser.msie) ? eval('this[0].currentStyle.' + formattedProp) : window.getComputedStyle(this[0], null).getPropertyValue(props);
            sty = (assignedStyle != '') ? assignedStyle : computedStyle;
            if (sty == '0%') {
                sty = '0px';
            }

            // If there's a formattedPropY value
            if (formattedPropY != null) {
                var assignedStyleY = eval("this[0].style." + formattedPropY + ";");
                var computedStyleY = (window.jax.browser.msie) ? eval('this[0].currentStyle.' + formattedPropY) : window.getComputedStyle(this[0], null).getPropertyValue(props);
                styY = (assignedStyleY != '') ? assignedStyleY : computedStyleY;
                if (styY == '0%') {
                    styY = '0px';
                }
                sty += ' ' + styY;
            }

            if (opac) {
                if ((window.jax.browser.msie) && (parseInt(window.jax.browser.version) < 10)) {
                    sty = sty.substring((sty.indexOf('=') + 1));
                    sty = sty.substring(0, sty.indexOf(')'));
                } else {
                    sty = Math.round(sty * 100);
                }
                if (sty.toString() == '') {
                    sty = (window.jax(this[0]).css('display') != 'none') ? 100 : 0;
                }
            }

            if ((sty == undefined) || (sty == 'auto') || ((sty.constructor == String) && (sty.indexOf('%') != -1))) {
                if (props == 'width') {
                    sty = this[0].offsetWidth;
                } else if (props == 'height') {
                    sty = this[0].offsetHeight;
                }
            }

            if ((sty != undefined) && (sty.constructor == String)) {
                var pxCount = sty.match(/px/g);
                if ((pxCount != null) && (pxCount.length <= 1)) {
                    sty = parseFloat(sty);
                }
            }

            if (props == 'width') {
                sty += this.css('padding-left');
                sty += this.css('padding-right');
            } else if (props == 'height') {
                sty += this.css('padding-top');
                sty += this.css('padding-bottom');
            }
        }

        return sty;
    }
});
/**
 * css/set.js
 */
jax.extend({
    /**
     * Function to set the CSS properties of the object passed.
     *
     * @param {Object} obj
     * @param {Mixed}  props
     * @param {Mixed}  val
     */
    setCss : function(obj, props, val) {
        if ((props.constructor == String) && (val != null)) {
            var properties = {};
            properties[props] = val;
        } else {
            var properties = props;
        }

        for (var prop in properties) {
            switch(prop) {
                // Handle the opacity/filter issue.
                case 'opacity':
                    if ((window.jax.browser.msie) && (parseInt(window.jax.browser.version) < 10)) {
                        obj.style.filter = 'alpha(opacity=' + properties[prop] + ')';
                    } else {
                        obj.style.opacity = properties[prop] / 100;
                    }
                    break;
                // Handle the styleFloat/cssFloat issue.
                case 'float':
                    if (window.jax.browser.msie) {
                        eval("obj.style.styleFloat = '" + properties[prop] + "';");
                    } else {
                        eval("obj.style.cssFloat = '" + properties[prop] + "';");
                    }
                    break;
                // Handle all other CSS properties.
                default:
                    // Create properly formatted property, converting a dashed property to a camelCase property if applicable.
                    if (prop.indexOf('-') != -1) {
                        var propAry = prop.split('-');
                        var prp = propAry[0].toLowerCase() + propAry[1].substring(0, 1).toUpperCase() + propAry[1].substring(1);
                    } else {
                        var prp = prop;
                    }
                    eval("obj.style." + prp + " = '" + properties[prop] + "';");
            }
        }
    }
});
/**
 * each.js
 */
jax.extend({
    /**
     * Function to iterate over the collection with a function
     *
     * @param   {Function} func
     * @param   {Array}    args
     * @returns {jax}
     */
    each : function(func, args) {
        if (args != null) {
            for (var i = 0; i < this.length;) {
                if (func.apply(this[i++], args) === false) {
                    break;
                }
            }
        } else {
            for (var i = 0; i < this.length;) {
                if (func.call(this[i], i, this[i++]) === false) {
                    break;
                }
            }
        }

        return this;
    }
});

(function(window){
    /**
     * Function to iterate over an object or array of items with a function
     *
     * @param {Object}   obj
     * @param {Function} func
     * @param {Array}    args
     */
    window.jax.each = function(obj, func, args) {
        if (args != null) {
            for (var name in obj) {
                if (func.apply(obj[name], args) === false) {
                    break;
                }
            }
        } else {
            for (var name in obj) {
                if (func.call(obj[name], name, obj[name]) === false) {
                    break;
                }
            }
        }
    };
})(window);
/**
 * effects.js
 */
jax.extend({
    /**
     * Function to show all current elements
     *
     * @returns {jax}
     */
    show : function() {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'block';
        }
        return this;
    },
    /**
     * Function to hide all current elements
     *
     * @returns {jax}
     */
    hide : function() {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'none';
        }
        return this;
    },
    /**
     * Function to toggle display of selected elements
     *
     * @param   {String} disp
     * @returns {jax}
     */
    toggle : function(disp) {
        if (disp == null) {
            disp = 'block';
        }
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = (this[i].style.display == 'none') ? disp : 'none';
        }
        return this;
    }
});
/**
 * event.js
 */
jax.extend({
    /**
     * Function to attach a custom event handler to an object
     *
     * @param   {String}   evt
     * @param   {Function} func
     * @param   {Boolean}  cap
     * @returns {jax}
     */
    on : function(evt, func, cap) {
        var cp = (cap) ? cap : false;
        // If nothing has been selected, attach event to either the window or document object
        if (this.length == 0) {
            var obj = ((evt == 'scroll') || (evt == 'resize')) ? window : document;
            obj.addEventListener(evt, func, cp);
            // Else, attach event to the selected object(s)
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener(evt, func, cp);
            }
        }
        return this;
    },
    /**
     * Function to detach a custom event handler to an object
     *
     * @param   {String}   evt
     * @param   {Function} func
     * @param   {Boolean}  cap
     * @returns {jax}
     */
    off : function(evt, func, cap) {
        var cp = (cap) ? cap : false;
        // If nothing has been selected, detach event to either the window or document object
        if (this.length == 0) {
            var obj = ((evt == 'scroll') || (evt == 'resize')) ? window : document;
            obj.removeEventListener(evt, func, cp);
            // Else, detach event to the selected object(s)
        } else {
            for (var i = 0; i < this.length; i++) {
                this[i].removeEventListener(evt, func, cp);
            }
        }
        return this;
    },
    /**
     * Function to trigger a custom event handler to an object
     *
     * @param   {String}  evt
     * @param   {Boolean} bubbles
     * @param   {Boolean} cancelable
     * @returns {jax}
     */
    trigger : function(evt, bubbles, cancelable) {
        var bub = (bubbles != null)    ? bubbles    : true;
        var can = (cancelable != null) ? cancelable : true;
        var e = ((window.jax.browser.msie) && (window.jax.browser.version >= 9)) ?
            document.createEvent('Event') : new CustomEvent('Event', {"bubbles" : bub, "cancelable" : can});

        // Check the event type and the obj accordingly.
        if (this.length == 0) {
            var obj = ((evt == 'scroll') || (evt == 'resize')) ? window : document;

            e.initEvent(evt, bub, can);
            obj.dispatchEvent(e);
        } else {
            for (var i = 0; i < this.length; i++) {
                e.initEvent(evt, bub, can);
                this[i].dispatchEvent(e);
            }
        }
        return this;
    }
});
/**
 * val.js
 */
jax.extend({
    /**
     * Function to get or set element value(s)
     *
     * @param   {Mixed} value
     * @returns {Mixed}
     */
    val : function(value) {
        // If getting value(s)
        if (value == null) {
            var v = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i].nodeName == 'SELECT') {
                    for (var j = 0; j < this[i].options.length; j++) {
                        if (this[i].options[j].selected) {
                            v.push(this[i].options[j].value);
                        }
                    }
                } else if (((this[i].type == 'checkbox') || (this[i].type == 'radio')) && (this[i].checked)) {
                    v.push(this[i].value);
                } else if (this[i].value != undefined) {
                    v.push(this[i].value);
                } else if (this[i].getAttribute('value') != undefined) {
                    v.push(this[i].getAttribute('value'));
                } else if (this[i].innerHTML != undefined) {
                    v.push(this[i].innerHTML);
                } else if (this[i].innerText != undefined) {
                    v.push(this[i].innerText);
                } else if (this[i].nodeValue != undefined) {
                    v.push(this[i].nodeValue);
                }
            }
            return (v.length == 1) ? v[0] : v;
            // If setting value(s)
        } else {
            for (var i = 0; i < this.length; i++) {
                if ((this[i].type == 'checkbox') || (this[i].type == 'radio')) {
                    if (value.constructor == Array) {
                        for (var k = 0; k < value.length; k++) {
                            if (this[i].value == value[k]) {
                                this[i].checked = true;
                            }
                        }
                    } else if (this[i].value == value) {
                        this[i].checked = true;
                    }
                } else if (this[i].nodeName == 'SELECT') {
                    for (var j = 0; j < this[i].options.length; j++) {
                        if (value.constructor == Array) {
                            for (var k = 0; k < value.length; k++) {
                                if (this[i].options[j].value == value[k]) {
                                    this[i].options[j].selected = true;
                                }
                            }
                        } else if (this[i].options[j].value == value) {
                            this[i].options[j].selected = true;
                        }
                    }
                } else {
                    if (this[i].value != undefined) {
                        this[i].value = value;
                    } else if (this[i].getAttribute('value') != undefined) {
                        this[i].setAttribute('value', value);
                    } else if (this[i].innerHTML != undefined) {
                        this[i].innerHTML = value;
                    } else if (this[i].innerText != undefined) {
                        this[i].innerText = value;
                    } else if (this[i].nodeValue != undefined) {
                        this[i].nodeValue = value;
                    }
                }
            }
        }
    },
    /**
     * Function to get the HTML value of the first element
     *
     * @returns {String}
     */
    html : function() {
        return (this[0] != undefined) ? this[0].innerHTML : null;
    },
    /**
     * Function to get the text content of the first element
     *
     * @returns {String}
     */
    text : function() {
        return (this[0] != undefined) ? (this[0].innerText || this[0].textContent) : null;
    }
});