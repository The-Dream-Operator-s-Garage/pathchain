const fs = require('fs');
const pb = require('protocol-buffers');
const dt = require('date-and-time');

/**
 * Returns the current datetime string in the specified format.
 * @param {string} [format='MM DD YYYY HH:mm:SSS [GMT]Z'] - The desired date format.
 * @returns {string} The formatted current datetime.
 */
function getCurrentDate(format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    const currentDatetime = new Date();
    return dt.format(currentDatetime, dt.compile(format, true));
}

/**
 * Retrieves and decodes a moment object from a file.
 * @param {string} xmoment - The moment hash or path.
 * @returns {Object|string} The decoded moment object or an error message.
 */
function getMomentObj(xmoment) {
    // Handle "moments/hash" format
    const momentHash = xmoment.includes('/') ? xmoment.split('/')[1] : xmoment;
    
    const momentProto = pb(fs.readFileSync('node_modules/pathchain/proto/moment.proto'));
    
    try {
        const fileContents = fs.readFileSync(`files/moments/${momentHash}`);
        return momentProto.moment.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Moment buffer not found" : err;
    }
}

/**
 * Retrieves and decodes a pioneer object from a file.
 * @param {string} xpioneer - The pioneer hash.
 * @returns {Object|string} The decoded pioneer object or an error message.
 */
function getPioneerObj(xpioneer) {
    const pioneerProto = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'));
    
    try {
        const fileContents = fs.readFileSync(`files/pioneer/${xpioneer}`);
        return pioneerProto.entity.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Pioneer not found" : err;
    }
}

/**
 * Retrieves and decodes a secret object from a file.
 * @param {string} xsecret - The secret hash.
 * @param {string} xauthor - The author of the secret (optional).
 * @returns {Object|string} The decoded secret object or an error message.
 */
function getSecretObj(xsecret, xauthor = '') {
    const secretProto = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}secrets/${xsecret}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        return secretProto.secret.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Secret not found" : err;
    }
}

/**
 * Retrieves and decodes an entity object from a file.
 * @param {string} xentity - The entity hash.
 * @param {string} xauthor - The author of the entity (optional).
 * @returns {Object|string} The decoded entity object or an error message.
 */
function getEntityObj(xentity, xauthor = '') {
    const entityProto = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}entities/${xentity}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        return entityProto.entity.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Entity not found" : err;
    }
}

/**
 * Retrieves and decodes a node object from a file.
 * @param {string} xnode - The node hash.
 * @param {string} xauthor - The author of the node (optional).
 * @returns {Object|string} The decoded node object or an error message.
 */
function getNodeObj(xnode, xauthor = '') {
    const nodeProto = pb(fs.readFileSync('node_modules/pathchain/proto/node.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}nodes/${xnode}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        return nodeProto.node.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Node not found" : err;
    }
}

/**
 * Retrieves and decodes a link object from a file.
 * @param {string} xlink - The link hash.
 * @param {string} xauthor - The author of the link (optional).
 * @returns {Object|string} The decoded link object or an error message.
 */
function getLinkObj(xlink, xauthor = '') {
    const linkProto = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}links/${xlink}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        return linkProto.link.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Link not found" : err;
    }
}

/**
 * Retrieves and decodes a path object from a file.
 * @param {string} xpath - The path hash.
 * @param {string} xauthor - The author of the path (optional).
 * @returns {Object|string} The decoded path object or an error message.
 */
function getPathObj(xpath, xauthor = '') {
    const pathProto = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}paths/${xpath}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        return pathProto.path.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Path not found" : err;
    }
}

/**
 * Retrieves and decodes a label object from a file.
 * @param {string} xlabel - The label hash.
 * @param {string} xauthor - The author of the label (optional).
 * @returns {Object|string} The decoded label object or an error message.
 */
function getLabelObj(xlabel, xauthor = '') {
    const labelProto = pb(fs.readFileSync('node_modules/pathchain/proto/label.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}labels/${xlabel}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        return labelProto.label.decode(fileContents);
    } catch (err) {
        return err.code === 'ENOENT' ? "Label not found" : err;
    }
}


/**
 * Retrieves and decodes a address object from a file.
 * @param {string} xaddress - The address string.
 * @returns {Object|string} The decoded object or an error message.
 */
function getObj(xaddress) {
    // const labelProto = pb(fs.readFileSync('node_modules/pathchain/proto/label.proto'));
    const filePath = `files/${xaddress}`;
    
    var splitted_address = xaddress.split("/");
    // console.log("Splitted address: ", splitted_address);
    var obj_type = splitted_address[splitted_address.length - 2];
    console.log("Retrieving object of type: ", obj_type);

    try {
        const fileContents = fs.readFileSync(filePath);
        switch (obj_type) {
            case "entities":
                const entityProto = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'));
                return entityProto.entity.decode(fileContents);
            case "labels":
                const labelProto = pb(fs.readFileSync('node_modules/pathchain/proto/label.proto'));
                return labelProto.label.decode(fileContents);
            case "links":
                const linkProto = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'));
                return linkProto.link.decode(fileContents);
            case "moments":
                const momentProto = pb(fs.readFileSync('node_modules/pathchain/proto/moment.proto'));
                return momentProto.moment.decode(fileContents);
            case "nodes":
                const nodeProto = pb(fs.readFileSync('node_modules/pathchain/proto/node.proto'));
                return nodeProto.node.decode(fileContents);
            case "paths":
                const pathProto = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'));
                return pathProto.path.decode(fileContents);
            case "secrets":
                const secretProto = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'));
                return secretProto.secret.decode(fileContents);
        }        
    }
    catch (err) {
        return err.code === 'ENOENT' ? "Element not found" : err;
    }
}

/**
 * Retrieves and returns the proto type that belongs the address object from a file.
 * @param {string} xaddress - The address string.
 * @returns {Object|string} The decoded object or an error message.
 */
function getType(xaddress) {
    var splitted_address = xaddress.split("/");
    console.log("Splitted address: ", splitted_address);
    var obj_type = splitted_address[splitted_address.length - 2];
    console.log("Retrieving object of type: ", obj_type);

    try {
        switch (obj_type) {
            case "entities":
                return "entity";
            case "labels":
                return "label";
            case "links":
                return "link";
            case "moments":
                return "moment";
            case "nodes":
                return "node";
            case "paths":
                return "path";
            case "secrets":
                return "secret";
        }        
    }
    catch (err) {
        return err.code === 'ENOENT' ? "Element not found" : err;
    }
}

/**
 * Retrieves and decodes a path object from a file.
 * @param {string} xpath - The path hash.
 * @param {string} xauthor - The author of the path (optional).
 * @returns {Object|string} The decoded path object or an error message.
 */
function getPatheadObj(xpath, xauthor = '') {
    const pathProto = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}paths/${xpath}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        var pathObj =  pathProto.path.decode(fileContents);

        var current_link = this.getObj(pathObj.head);
        console.log("Head link", current_link);
        var current_obj = this.getObj(current_link.target);
        console.log("First object", current_obj);
        // Get link -> get link.target
        return pathObj;
    } catch (err) {
        return err.code === 'ENOENT' ? "Path not found" : err;
    }
}

/**
 * Retrieves and decodes a path object from a file.
 * @param {string} xpath - The path hash.
 * @param {string} xauthor - The author of the path (optional).
 * @returns {Object|string} The decoded path object or an error message.
 */
function getPathchainObj(xpath, xauthor = '') {
    const pathProto = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}paths/${xpath}`;
    
    try {
        const fileContents = fs.readFileSync(filePath);
        var pathObj =  pathProto.path.decode(fileContents);

        var head_link = this.getObj(pathObj.head);
        // console.log("Head link", head_link);
       
        var obj_list = [];
        var current_link = head_link;
        
        // As the head is the last inserted element, we go backwards till there's no more linked elements
        while (current_link.prev !== current_link.tag) {
            // console.log("Current link: ", current_link);
            // console.log("Trying to retrieve object from: ", current_link.target);
            const current_obj = this.getObj(current_link.target);
            console.log("Pushing object: ", current_obj);
            obj_list.push(current_obj);
            current_link = this.getObj(current_link.prev);
        }
        console.log("Pushing last element (current link target): ", current_link.target);
        var current_link_target_obj = this.getObj(current_link.target);
        console.log("Last element target object: ", current_link_target_obj);
        obj_list.push(current_link_target_obj);

        return obj_list;
    } catch (err) {
        return err.code === 'ENOENT' ? "Path not found" : err;
    }
}

module.exports = {
    getCurrentDate,
    getMomentObj,
    getPioneerObj,
    getSecretObj,
    getEntityObj,
    getNodeObj,
    getLinkObj,
    getPathObj,
    getLabelObj,
    getObj,
    getType,
    getPatheadObj,
    getPathchainObj
};