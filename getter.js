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

module.exports = {
    getCurrentDate,
    getMomentObj,
    getPioneerObj,
    getSecretObj,
    getEntityObj,
    getNodeObj,
    getLinkObj,
    getPathObj,
    getLabelObj
};