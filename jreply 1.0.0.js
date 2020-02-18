// Add objects to objects
Object.prototype.update = function(objargs={}) {
    for(const key of Object.keys(objargs)) {
        this[key] = objargs[key]
    }
    try {
        return JSON.parse(JSON.stringify(this))
    } catch {
        return this
    }
}

// Grab elements from objects
Object.prototype.grab = function(index) {
    index = Math.floor(Number(index)) || Math.floor(parseInt(index)) || 0
    return this[Object.keys(this)[index]]
}

// Get properties from objects
Object.prototype.property = function(name) {
    return this[name] || this.prototype[name]
}

// on('event', function) for HTMLElements
HTMLElement.prototype.on = function(event,fun=null) {
    if(event && typeof event === "string") {
        const eventReference = "on"+event
        if(this[eventReference] !== undefined) {
            this[eventReference] = fun
            return true
        }
    }
    return false
}

// Remove specific elements from an array
Array.prototype.remove = function(...indexlist) {
    const refarr = []
    let indx = 0
    for(const el of this) {
        if(!indexlist.includes(indx)) {
            refarr.push(el)
        }
        indx++
    }
    return refarr
}

// Get an index from array
Array.prototype.index = function(index) {
    const len = this.length
    const underflow = function(n) {
        n = len - n
        n = (n < 0 ? underflow(n) : n)
        return n
    }
    return this[underflow(index)]
}

// Repeat an array
Array.prototype.repeat = function(times) {
    if((Number(times) || parseInt(times)) !== NaN) {
        let result = []
        let cnct = Number(times) || parseInt(times)
        while(cnct > 0) {
            result = result.concat(this)
            cnct--
        }
        return result
    } else {
        return []
    }
}

// Translate an array
Array.prototype.translate = function(multiple) {
    if((Number(multiple) || parseInt(multiple)) !== NaN) {
        const mul = Number(multiple) || parseInt(multiple)
        let indx = 0
        for(const e of this) {
            if(typeof e === "number") this[indx] = e*mul
            if(typeof e === "string") this[indx] = e.repeat(mul)
            if(typeof e === "object") if(Array.isArray(e)) this[indx] = e.repeat(mul)
            indx++
        }
        return this
    } else {
        return null
    }
}

// Get elements by an ID
const _ = function(id) {
    return document.getElementById(id)
}

// Fetch things
_.fetch = function(str) {
    try {
        return fetch(String(str))
    } catch {
        return undefined
    }
}

// Variables
_.variables = {}

// Make variables
_.define = function(name,value=undefined,statictype=null) {
    const jstypes = ["string","number","boolean","function","object","bigint","undefined"]
    if(!name || typeof name !== "string") {
        return false
    } else {
        if(typeof statictype === "string" && statictype && jstypes.includes(statictype)) {
            if(typeof value === statictype) {
                const repr = {}
                repr[name] = value
                _.variables[name] = value
                window[name] = value
                if(!window[name]) {
                    window.update(repr)
                }
                return true
            }
        } else {
            const repr = {}
            repr[name] = value
            _.variables[name] = value
            window[name] = value
            if(!window[name]) {
                window.update(repr)
            }
            return true
        }
    }
    return false
}

// Get made variable
_.getVariable = function(name) {
    name = String(name)
    return window[name] || _.variables[name]
}

// Make elements for DOM
_.create = function(tag,attrs={}) {
    const elem = document.createElement(String(tag))
    for(const attr of Object.keys(attrs)) {
        elem[attr] = attrs[attr]
    }
    return elem
}

// Remove elements from DOM
_.remove = function(id) {
    let couldremove = false
    if(document.getElementById(id)) {
        couldremove = true
    }
    document.getElementById(id).parentNode.removeChild(id)
    return couldremove
}

// Append elements to DOM
_.append = function(elem,parent=document.body) {
    try {
        parent.appendChild(elem)
        return true
    } catch(err) {
        _.append.catch(err)
        return false
    }
}

// Add styling to the webpage
_.appendStyle = function(css) {
    document.head.innerHTML += "<style>"+css+"</style>"
    return document.head
}

// Remove all styling from a page
_.stripStyle = function() {
    document.body.parentNode.removeChild(document.head)
}

// Catch append error
_.append.catch = function() {}

// Element id if
_.if = function(id,success=undefined) {
    if(id && typeof id === "string" && document.getElementById && document.getElementById(id)) {
        let v = _.then(success || _.if.success)
        return v || Boolean(v)
    }
    return false
}

// Element id if (success)
_.if.success = function() {}

// If something needs to be done
_.then = function(fun,...args) {
    if(typeof fun !== "function") {
        return false
    } else {
        return fun(_(args[0]))
    }
}

// Log something
_.log = function(...args) {
    console.log(...args)
    return args.join(" ")
}

// Log something and alert it
_.shout = function(...args) {
    alert(args.join(" "))
    console.log(...args)
    return args.join(" ")
}

// Get entire html
_.html = function() {
    try {
        return "<html><head>"+document.head.innerHTML+"</head><body>"+document.body.innerHTML+"</body></html>"
    } catch(err) {
        console.error(err)
        return "<html></html>"
    }
}

// Get html in a better way
_.fastHTML = function() {
    return document.head.parentNode.innerHTML
}

// Get all text of a webpage
_.text = function() {
    return document.head.parentNode.innerText || document.head.parentNode.textContent || ""
}

// Get elements by ID
_.byId = function(id) {
    return document.getElementById(id)
}

// Get elements by tagname
_.byTag = function(tag) {
    return document.getElementsByTagName(String(tag))
}

// Get elements by class(es)
_.byClass = function(classname) {
    return document.getElementsByClassName(String(classname))
}

// Get scripts
_.scripts = function() {
    return [...document.getElementsByTagName("script")]
}

// Get embedded scripts
_.embeddedScripts = function() {
    const scripts = []
    for(const script of _.scripts()) {
        if(!script.text && !script.innerText && script.src) {
            scripts.push(script)
        }
    }
    return scripts
}

// Timer
_.in = function(time,fun,...args) {
    setTimeout(function() {
        fun(...args)
    },time)
}

// Get inline scripts
_.inlineScripts = function() {
    const scripts = []
    for(const script of _.scripts()) {
        if(script.text || script.innerText && !script.src) {
            scripts.push(script)
        }
    }
    return scripts
}

// Get the title of the webpage
_.getTitle = function() {
    try {
        return document.head.getElementsByTagName("title")[0].innerText || document.head.getElementsByTagName("title")[0].textContent
    } catch {
        return ""
    }
}

// Set the title of a webpage
_.setTitle = function(title) {
    const unacceptedValues = [null,undefined]
    const unacceptedTypes = ["object","function","bigint"]
    if(unacceptedTypes.includes(typeof title) || unacceptedValues.includes(title)) title = ""
    title = String(title)
    const oldTitle = _.getTitle()
    if(document.head.getElementsByTagName("title")[0] && document.head.getElementsByTagName("title")) {
        document.head.getElementsByTagName("title")[0].innerText = title
    } else {
        document.head.appendChild(_.create("title",{innerText: title}))
    }
    return oldTitle
}

// Get the name of the browser
_.executer = function() {
    return navigator.appName
}

// Get the name of the file
_.file = function() {
    const path = window.location.pathname
    let patharr = path.split("/")
    let filename = ""
    patharr = patharr.reverse()
    for(const fname of patharr) {
        if(fname && typeof fname === "string") {
            filename = fname
            break
        }
    }
    return filename
}

// Get the path array
_.file.path = Object.freeze(function() {
    const path = window.location.pathname
    const patharr = path.split("/")
    const removethese = []
    let indx = 0
    for(const fname of patharr) {
        if(!fname || typeof fname !== "string") {
            removethese.push(indx)
        }
        indx++
    }
    return patharr.remove(...removethese)
})

// Get server data of the file
_.file.server = Object.freeze({
    // Get server status
    status: function() {
        const loch = window.location.href
        if(loch.includes("file://")) {
            return "local"
        } else if(loch.includes("chrome")) {
            return "chrome"
        } else if(loch.includes("http://") || loch.includes("https://")) {
            return "public"
        }
    }
})

// Make real-ish classes
_.template = Object.freeze(function(proto={}) {
    const template = function template(...args) {
        const properties = Object.keys(template.ref)
        let indx = 0
        for(const arg of args) {
            const prop = properties[indx]
            if(!prop && typeof prop === "undefined" && prop === undefined) break
            else {
                template.ref[prop] = arg
            }
            indx++
        }
        const objrepr = {}
        for(const k of properties) {
            objrepr[k] = template.ref[k]
        }
        return Object.freeze(objrepr)
    }
    template.ref = {}
    for(const k of Object.keys(proto)) {
        template.ref[k] = proto[k]
    }
    Object.seal(template.ref)
    return Object.seal(template)
})