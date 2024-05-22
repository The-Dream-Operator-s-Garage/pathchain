var fs = require("fs");
var pb = require('protocol-buffers');
var dt = require('date-and-time');
// const { getLinkObj } = require(".");

/** getCurrentDate
 * [Function that returns current datetime string on "MMM DD YYYY HH:mm:ss [GMT]Z" format]
 * 
 * @return {string} current_datetime
 */
function getCurrentDate(format = 'MM DD YYYY HH:mm:SSS [GMT]Z'){
    var current_datetime = new Date()
    current_datetime = dt.format(current_datetime, dt.compile(format, true));

    return current_datetime;
}

/** getMomentObj
 * [Function that recieves a moment hash and returns the moment object]
 * 
 * @param {string} xmoment (required)
 * 
 * @return void
 */
function getMomentObj(xmoment) {
    // "moments/hash" FORMAT EXCEPTION
    if(xmoment.split("/").length > 1){ 
        xmoment = xmoment.split("/")[1]
    }

    // LOADING PB
    var moment_pb = pb(fs.readFileSync('node_modules/pathchain/proto/moment.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/moments/"+xmoment);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Moment buffer not found";
        } else {
            throw err;
        }
    }

    // DECODING MOMENT
    var moment_enc = fileContents
    var moment_obj = moment_pb.moment.decode(moment_enc)

    return moment_obj;
}

/** getPioneerObj
 * [Function that recieves a pioneer hash and returns the pioneer object]
 * 
 * @param {string} xpioneer (required)
 * 
 * @return void
 */
function getPioneerObj(xpioneer) {

    // LOADING PB
    var pioneer_pb = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/pioneer/"+xpioneer);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Pioneer not found";
        } else {
            throw err;
        }
    }


    // DECODING PIONEER
    var pioneer_enc = fileContents
    var pioneer_obj = pioneer_pb.entity.decode(pioneer_enc)

    return pioneer_obj;
}


/** getSecretObj
 * [Function that recieves a secret hash and returns the secret object]
 * 
 * @param {string} xsecret (required)
 * 
 * @return void
 */
function getSecretObj(xsecret, xauthor) {

    if(xauthor != ""){
        xauthor = xauthor + '/';
    }

    // LOADING PB
    var secret_pb = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/" + xauthor + "secrets/" + xsecret);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Secret not found";
        } else {
            throw err;
        }
    }

    // DECODING SECRET
    var secret_enc = fileContents
    var secret_obj = secret_pb.secret.decode(secret_enc)

    return secret_obj;
}


/** getEntityObj
 * [Function that recieves a entity hash and returns the entity object]
 * 
 * @param {string} xentity (required)
 * 
 * @return void
 */
function getEntityObj(xentity, xauthor) {
    if(xauthor != ""){
        xauthor = xauthor + '/';
    }

    // LOADING PB
    var entity_pb = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/" + xauthor + "entities/" + xentity);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Entity not found";
        } else {
            throw err;
        }
    }

    // DECODING ENTITY
    var entity_enc = fileContents
    var entity_obj = entity_pb.entity.decode(entity_enc)

    return entity_obj;
}

/** getNodeObj
 * [Function that recieves a node hash and returns the node object]
 * 
 * @param {string} xnode (required)
 * 
 * @return void
 */
function getNodeObj(xnode, xauthor) {

    if(xauthor != ""){
        xauthor = xauthor + '/';
    }

    // LOADING PB
    var node_pb = pb(fs.readFileSync('node_modules/pathchain/proto/node.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/" + xauthor + "nodes/" + xnode);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Node not found";
        } else {
            throw err;
        }
    }

    // DECODING NODE
    var node_enc = fileContents
    var node_obj = node_pb.node.decode(node_enc)

    return node_obj;
}


/** getLinkObj
 * [Function that recieves a link hash and returns the link object]
 * 
 * @param {string} xlink (required)
 * 
 * @return void
 */
function getLinkObj(xlink, xauthor) {

    if(xauthor != ""){
        xauthor = xauthor + '/';
    }

    // LOADING PB
    var link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/" + xauthor + "links/" + xlink);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Link not found";
        } else {
            throw err;
        }
    }

    // DECODING NODE
    var link_enc = fileContents
    var link_obj = link_pb.link.decode(link_enc)

    return link_obj;
}


/** getPathObj
 * [Function that recieves a path hash and returns the path object]
 * 
 * @param {string} xpath (required)
 * 
 * @return void
 */
function getPathObj(xpath, xauthor) {

    if(xauthor != ""){
        xauthor = xauthor + '/';
    }

    // LOADING PB
    var path_pb = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/" + xauthor + "paths/" + xpath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Path not found";
        } else {
            throw err;
        }
    }

    // DECODING PATH
    var path_enc = fileContents
    var path_obj = path_pb.path.decode(path_enc)

    return path_obj;
}



/** getLabelObj
 * [Function that recieves a label hash and returns the label object]
 * 
 * @param {string} xlabel (required)
 * 
 * @return void
 */
function getLabelObj(xlabel, xauthor) {

    if(xauthor != ""){
        xauthor = xauthor + '/';
    }

    // LOADING PB
    var label_pb = pb(fs.readFileSync('node_modules/pathchain/proto/label.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/" + xauthor + "labels/" + xlabel);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Label not found";
        } else {
            throw err;
        }
    }

    // DECODING LABEL
    var label_enc = fileContents
    var label_obj = label_pb.label.decode(label_enc)

    return label_obj;
}


module.exports = { getCurrentDate, getMomentObj, getPioneerObj, getSecretObj, getEntityObj, getNodeObj, getLinkObj, getPathObj, getLabelObj }