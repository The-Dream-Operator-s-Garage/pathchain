const maker = require("./maker");
const getter = require("./getter");
const checker = require("./checker");

///////////////
///  HELLO  ///
///////////////

/** hello
 * [Function that greets someone who is calling the function]
 * 
 * @param {string} name (optional, default="nameless entity")
 * 
 * @return {string} result
 */
exports.hello = (name = "nameless entity") => {
    var result = "Hello from the Dream Operator's Garage, " + name;
    return result;
}


////////////////
///  MOMENT  ///
////////////////

/** makeMoment
 * [Moment maker]
 * 
 * @param {string} datetime (optional, default=*current datetime*)
 * @param {float}  lat      (optional, default=0)
 * @param {float}  lon      (optional, default=0)
 * @param {float}  x        (optional, default=0)
 * @param {float}  y        (optional, default=0)
 * @param {float}  z        (optional, default=0)
 *  * @param {string} format   (optional, default="ddd MMM DD YYYY HH:mm:ss [GMT]Z")
 * 
 * @return {string} moment_buffer
 */
exports.makeMoment = (datetime = getter.getCurrentDate(), lat = 0, lon = 0, x = 0, y = 0, z = 0, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const moment_buffer = maker.moment(datetime, lat, lon, x, y, z, format);
    return moment_buffer;
}

/** getMomentObj
 * [Function that recieves a moment hash and returns the moment object]
 * 
 * @param {string} xmoment (required)
 * 
 * @return {obj} moment_object
 */
exports.getMomentObj = (xmoment) => {
    const moment_object = getter.getMomentObj(xmoment);
    return moment_object;
}


/////////////////
///  PIONEER  ///
/////////////////

/** makePioneer
 * [Pioneer maker]
 * 
 * @return {string} entity_buffer
 */
exports.makePioneer = (datetime = getter.getCurrentDate(), format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const pioneer_buffer = maker.pioneer(datetime, format);
    return pioneer_buffer;
}

/** getPioneerObj
 * [Function that recieves a pioneer hash and returns the pioneer object]
 * 
 * @param {string} xpioneer (required)
 * 
 * @return {obj} pioneer_object (entity object)
 */
exports.getPioneerObj = (xpioneer = this.makePioneer()) => {
    const pioneer_object = getter.getPioneerObj(xpioneer);
    return pioneer_object;
}


//////////////////
///   ENTITY   ///
//////////////////

/** makeEntity
 * [Entity maker]
 * 
 * @return {string} entity_buffer
 */
exports.makeEntity = (xsecret, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const entity_buffer = maker.entity(xsecret, format);
    return entity_buffer;
}

/** getEntityObj
 * [Function that recieves a entity hash and returns the entity object]
 * 
 * @param {string} xentity (required)
 * 
 * @return {obj} entity_object (entity object)
 */
exports.getEntityObj = (xentity, xauthor="") => {
    const entity_object = getter.getEntityObj(xentity, xauthor);
    return entity_object;
}


////////////////
///  SECRET  ///
////////////////

/** makeSecret
 * [Secret maker]
 * 
 * @return {string} secret_buffer
 */
exports.makeSecret = (author = maker.pioneer(), format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const secret_buffer = maker.secret(author, format);
    return secret_buffer;
}

/** useSecret
 * [Secret using]
 * 
 * @return {string} secret_buffer
 */
exports.useSecret = (xsecret) => {
    const secret_buffer = updater.useSecret(xsecret);
    return secret_buffer;
}

/** isSecretUsed
 * [Check secret availability]
 * 
 * @return {bool} true/false
 */
exports.isSecretUsed = (xsecret) => {
    const is_secret_used = checker.isSecretUsed(xsecret);
    return is_secret_used;
}

/** getSecretObj
 * [Function that recieves a moment hash and returns the moment object]
 * 
 * @param {string} xsecret (required)
 * @param {string} xauthor (optional)
 * 
 * @return {obj} secret_object (entity object)
 */
exports.getSecretObj = (xsecret, xauthor = "") => {
    const secret_object = getter.getSecretObj(xsecret, xauthor);
    return secret_object;
}


//////////////////
///    NODE    ///
//////////////////

/** makeNode
 * [Node maker]
 * 
 * @return {string} node_buffer
 */
exports.makeNode = (text ="", xauthor = "", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const node_buffer = maker.node(text, xauthor, format);
    return node_buffer;
}

/** getNodeObj
 * [Function that recieves a node hash and returns the node object]
 * 
 * @param {string} xnode (required)
 * 
 * @return {obj} node_object (node object)
 */
exports.getNodeObj = (xnode, xauthor="") => {
    const node_object = getter.getNodeObj(xnode, xauthor);
    return node_object;
}


///////////////////////
///     NODELINK    ///
///////////////////////

/** makeNodelink
 * [Nodelink maker]
 * 
 * @return {string} nodelink_buffer
 */
exports.makeNodelink = (first="", second="", xauthor = "", ancestor = "", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const nodelink_buffer = maker.nodelink(first, second, xauthor, ancestor, format);
    return nodelink_buffer;
}

/** getNodelinkObj
 * [Function that recieves a nodelink hash and returns the nodelink object]
 * 
 * @param {string} xnodelink (required)
 * 
 * @return {obj} nodelink_object (nodelink object)
 */
exports.getNodelinkObj = (xnodelink, xauthor="") => {
    const nodelink_object = getter.getNodelinkObj(xnodelink, xauthor);
    return nodelink_object;
}


//////////////////
///    PATH    ///
//////////////////

/** makePath
 * [Path maker]
 * 
 * @return {string} path_buffer
 */
exports.makePath = (text ="", head="", xauthor = "", ancestor="", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const path_buffer = maker.path(text, head, xauthor, ancestor, format);
    return path_buffer;
}

/** getPathObj
 * [Function that recieves a path hash and returns the path object]
 * 
 * @param {string} xpath (required)
 * 
 * @return {obj} path_object (path object)
 */
exports.getPathObj = (xpath, xauthor="") => {
    const path_object = getter.getPathObj(xpath, xauthor);
    return path_object;
}


///////////////////////
///     PATHLINK    ///
///////////////////////

/** makePathlink
 * [Pathlink maker]
 * 
 * @return {string} pathlink_buffer
 */
exports.makePathlink = (first="", second="", xauthor = "", ancestor = "", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const pathlink_buffer = maker.pathlink(first, second, xauthor, ancestor, format);
    return pathlink_buffer;
}

/** getPathlinkObj
 * [Function that recieves a pathlink hash and returns the pathlink object]
 * 
 * @param {string} xpathlink (required)
 * 
 * @return {obj} pathlink_object (pathlink object)
 */
exports.getPathlinkObj = (xpathlink, xauthor="") => {
    const pathlink_object = getter.getPathlinkObj(xpathlink, xauthor);
    return pathlink_object;
}


//////////////////
///    TREE    ///
//////////////////

/** makeTree
 * [Tree maker]
 * 
 * @return {string} tree_buffer
 */
exports.makeTree = (text ="", head="", xauthor = "", ancestor="", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const tree_buffer = maker.tree(text, head, xauthor, ancestor, format);
    return tree_buffer;
}

/** getTreeObj
 * [Function that recieves a tree hash and returns the tree object]
 * 
 * @param {string} xtree (required)
 * 
 * @return {obj} tree_object (tree object)
 */
exports.getTreeObj = (xtree, xauthor="") => {
    const tree_object = getter.getTreeObj(xtree, xauthor);
    return tree_object;
}


///////////////////////
///     TREELINK    ///
///////////////////////

/** makeTreelink
 * [Treelink maker]
 * 
 * @return {string} treelink_buffer
 */
exports.makeTreelink = (first="", second="", xauthor = "", ancestor = "", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const treelink_buffer = maker.treelink(first, second, xauthor, ancestor, format);
    return treelink_buffer;
}

/** getTreelinkObj
 * [Function that recieves a treelink hash and returns the treelink object]
 * 
 * @param {string} xtreelink (required)
 * 
 * @return {obj} treelink_object (treelink object)
 */
exports.getTreelinkObj = (xtreelink, xauthor="") => {
    const treelink_object = getter.getTreelinkObj(xtreelink, xauthor);
    return treelink_object;
}


////////////////////
///     LABEL    ///
////////////////////

/** makeLabel
 * [Label maker]
 * 
 * @return {string} label_buffer
 */
exports.makeLabel = (text ="", xauthor = "", ancestor = "", format = 'MM DD YYYY HH:mm:SSS [GMT]Z') => {
    const label_buffer = maker.label(text, xauthor, ancestor, format);
    return label_buffer;
}

/** getLabelObj
 * [Function that recieves a label hash and returns the label object]
 * 
 * @param {string} xlabel (required)
 * 
 * @return {obj} label_object (label object)
 */
exports.getLabelObj = (xlabel, xauthor="") => {
    const label_object = getter.getLabelObj(xlabel, xauthor);
    return label_object;
}

