var fs = require("fs");
var pb = require('protocol-buffers');
var dt = require('date-and-time');
var sha256 = require("js-sha256");
const getter = require("./getter");
const checker = require("./checker");
const updater = require("./updater");

/** moment
 * [Moment Protocol Buffer Creation]
 * 
 * @param {string} datetime (optional)
 * @param {float}  lat      (optional)
 * @param {float}  lon      (optional)
 * @param {float}  x        (optional)
 * @param {float}  y        (optional)
 * @param {float}  z        (optional)
 * @param {string} format   (optional)
 * 
 * @return {string} moment_buffer
 */
function moment(datetime, lat, lon, x, y, z, format) {
    var moment_pb = pb(fs.readFileSync('node_modules/pathchain/proto/moment.proto'));
    
    var date_obj = dt.preparse(datetime, format);
    var moment_obj = {
        coordinates: {
            lat: lat,
            lon: lon,
            xyz: { x: x, y: y, z: z }
        },
        datetime: {
            Y: date_obj.Y,
            M: date_obj.M,
            D: date_obj.D,
            H: date_obj.H,
            A: date_obj.A,
            h: date_obj.h,
            m: date_obj.m,
            s: date_obj.s,
            S: date_obj.S,
            Z: date_obj.Z,
            _index: date_obj._index,
            _length: date_obj._length,
            _match: date_obj._match
        }
    }

    var buffer = moment_pb.moment.encode(moment_obj);
    
    var moment_hash = sha256(JSON.stringify(moment_pb.moment.decode(buffer)));

    checker.checkDir("files/moments/");
    fs.writeFileSync("files/moments/" + moment_hash, buffer);

    return moment_hash;
}

/** secret
 * [Pioneer Protocol Buffer Creation]
 * 
 * @param {string} author (optional, default=pioneer_hash)
 * @param {string} format   (required)
 * 
 * @return {string} secret_hash
 */
function secret(author, format) {
    checker.checkDir("files/entities/")

    // There is no pioneer
    if(checker.checkEmptyDir("files/entities/")){
        var secret_pb = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'))

        var register = new Date()
        register = dt.format(register, dt.compile(format, true));

        var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
        
        var secret_hash = sha256(register_moment_hash + "_" + author);
        
        var buffer = secret_pb.secret.encode({
            register: "moments/"+register_moment_hash,
            author: "entities/"+author,
            user: "entities/"+author,
            used: false,
            tag: "secrets/"+secret_hash,
        })

        checker.checkDir("files/secrets/") // checking
        checker.checkDir("files/"+ author +"/secrets/") // checking

        fs.writeFileSync("files/secrets/" + secret_hash, buffer);
        fs.writeFileSync("files/"+ author +"/secrets/" + secret_hash, buffer);
        
        return secret_hash;
    }
    // The pioneer already exists
    else{
        return "The pioneer has only one secret";
    }
}

/** pioneer
 * [Pioneer Protocol Buffer Creation]
 * 
 * @param {string} xbigbang (required) // The creation moment is the bigbang of the system
 * @param {string} format   (required)
 * 
 * @return {string} pioneer_buffer
 */
function pioneer(xbigbang, format) {
    checker.checkDir("files/entities/")

    // There is no pioneer
    if(checker.checkEmptyDir("files/entities/")){
        // CREATING PIONEER
        var entity = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'))
        
        var register = new Date()
        register = dt.format(register, dt.compile(format, true));

        var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)

        var birthday = dt.parse(xbigbang, format, true);
        birthday = dt.format(birthday, format, true);

        var birthday_moment = moment(birthday, 0, 0, 0, 0, 0, format)

        // console.log("PIONEER REGISTER MOMENT: ", register_moment_hash)
        // console.log("PIONEER BIRTHDAY MOMENT: ", birthday_moment)

        var pioneer_hash = sha256(register_moment_hash + "_" + birthday_moment);

        var buffer = entity.entity.encode({
            register: "moments/"+register_moment_hash,
            ancestor: "entities/"+pioneer_hash, // points to itself as ancestor entity in the chain
            tag: "entities/"+pioneer_hash,
        })

        const the_secret = secret(pioneer_hash, format);
        console.log("The pioneer secret buffer is: ", the_secret)

        // Save as active entity
        checker.checkDir("files/entities/")
        fs.writeFileSync("files/entities/" + pioneer_hash, buffer);

        // Save pioneer to look for it later
        checker.checkDir("files/pioneer/")
        fs.writeFileSync("files/pioneer/" + pioneer_hash, buffer);

        return pioneer_hash;
    }
    // There is a pioneer
    else{
        return checker.checkFiles('files/pioneer/')[0];
    }
}

/** entity
 * [Entity Protocol Buffer Creation]
 * 
 * @param {string} xsecret (required)
 * @param {string} format  (optional)
 * 
 * @return {string} secret_hash
 */
function entity(xsecret, format) {

    checker.checkDir("files/entities/");
    if(checker.checkEmptyDir("files/entities/")){
        return "A pioneer's secret is needed to create the first entity. There was no pioneer, but here is the one at 'files/pioneer/'" + pioneer();
    }
    else{
        if(checker.isSecretUsed(xsecret) == false){
            // CREATING entity
            var entity = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'))
            
            var register = new Date()
            register = dt.format(register, dt.compile(format, true));

            var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
            var ancestor_entity_hash = getter.getSecretObj(xsecret).author;
            // console.log("-> ancestor ENTITY HASH: ", ancestor_entity_hash);

            var entity_hash = sha256(register_moment_hash + "_" + ancestor_entity_hash);


            var buffer = entity.entity.encode({
                register: "moments/"+register_moment_hash,
                ancestor: "entities/"+ancestor_entity_hash,
                tag: "entities/"+entity_hash,
            })

            var updated_secret = updater.useSecret(xsecret, entity_hash);
            console.log("Updated secret: ", updated_secret);

            checker.checkDir("files/entities/") // checking
            fs.writeFileSync("files/entities/" + entity_hash, buffer);

            return entity_hash;
        }
        else{
            return "Secret has been already used or it was not found"
        }
    }
}


/** node
 * [Node Protocol Buffer Creation]
 * 
 * @param {string} author (optional, default=pioneer_hash)
 * @param {string} file   (optional)
 * @param {string} str    (optional)
 * @param {string} format (required)
 * 
 * @return {string} node_hash
 */
function node(text, author, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var node_pb = pb(fs.readFileSync('node_modules/pathchain/proto/node.proto'))

    var author_folder = author;
    if(author == ""){
        author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    }else{
        author_folder = author_folder + '/';
    }

    var register = new Date()
    register = dt.format(register, dt.compile(format, true));

    var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
    
    var node_hash = sha256(register_moment_hash + "_" + author);
    
    var buffer = node_pb.node.encode({
        register: "moments/" + register_moment_hash,
        author: "etities/" + author,
        text: text,
        tag: "nodes/" + node_hash
    })

    checker.checkDir("files/" + author_folder + "nodes/") // checking
    fs.writeFileSync("files/" + author_folder + "nodes/" + node_hash, buffer);
    
    return node_hash;
}


/** nodelink
 * [Label Protocol Buffer Creation]
 * 
 * @param {string} author (optional, default=pioneer_hash)
 * @param {string} file   (optional)
 * @param {string} str    (optional)
 * @param {string} format (required)
 * 
 * @return {string} nodelink_hash
 */
function nodelink(first, second, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var nodelink_pb = pb(fs.readFileSync('node_modules/pathchain/proto/nodelink.proto'))

    if(first == "" || second == "") return "Two nodes are required to create a nodelink";

    var author_folder = author; 
    if(author == ""){
        author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    }else{
        author_folder = author_folder + '/';
    }

    var register = new Date()
    register = dt.format(register, dt.compile(format, true));

    var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
    
    var nodelink_hash = sha256(register_moment_hash + "_" + author + "_" + first + "_" + second);

    if(ancestor == ""){
        ancestor = nodelink_hash;        
    }
    
    var buffer = nodelink_pb.nodelink.encode({
        register: "moments/" + register_moment_hash,
        author: "etities/" + author,
        first: "nodes/" + first,
        second: "nodes/" + second,
        ancestor: author_folder + "nodelinks/" + ancestor,
        tag: author_folder + "nodelinks/" + nodelink_hash
    })

    checker.checkDir("files/" + author_folder + "nodelinks/") // checking
    fs.writeFileSync("files/" + author_folder + "nodelinks/" + nodelink_hash, buffer);
    
    return nodelink_hash;
}


/** path
* [Pioneer Protocol Buffer Creation]
* 
* @param {string} author (optional, default=pioneer_hash)
* @param {string} text   (optional, default=path_hash)
* @param {string} head   (required)
* @param {string} ancestor (optional, default=path_hash)
* @param {string} format (required)
* 
* @return {string} path_hash
*/
function path(text, head, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
   var path_pb = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'))

   var author_folder = author;
   if(author == ""){
        author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
   }else{
        author_folder = author_folder + '/';
   }

   var register = new Date()
   register = dt.format(register, dt.compile(format, true));

   var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)

   var path_hash = sha256(register_moment_hash + "_" + author);
   
   if(text == ""){ text = path_hash; }
   if(head == ""){ return "Head node_link is required to create a path!" }
   if(ancestor == ""){ ancestor = path_hash; }

   var buffer = path_pb.path.encode({
       register: "moments/"+register_moment_hash,
       author: author,
       text: text,
       head: "nodelinks/" + head,
       ancestor: author_folder + "paths/" + ancestor,
       tag: author_folder + "paths/" + path_hash,
   })

   checker.checkDir("files/" + author_folder + "paths/") // checking
   fs.writeFileSync("files/" + author_folder + "paths/" + path_hash, buffer);
   
   return path_hash;
}


/** pathlink
 * [Label Protocol Buffer Creation]
 * 
 * @param {string} author (optional, default=pioneer_hash)
 * @param {string} file   (optional)
 * @param {string} str    (optional)
 * @param {string} format (required)
 * 
 * @return {string} pathlink_hash
 */
function pathlink(first, second, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var pathlink_pb = pb(fs.readFileSync('node_modules/pathchain/proto/pathlink.proto'))

    if(first == "" || second == "") return "Two paths are required to create a pathlink";

    var author_folder = author; 
    if(author == ""){
        author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    }else{
        author_folder = author_folder + '/';
    }

    var register = new Date()
    register = dt.format(register, dt.compile(format, true));

    var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
    
    var pathlink_hash = sha256(register_moment_hash + "_" + author);

    if(ancestor == ""){
        ancestor = pathlink_hash;        
    }
    
    var buffer = pathlink_pb.pathlink.encode({
        register: "moments/" + register_moment_hash,
        author: "etities/" + author,
        first: "paths/" + first,
        second: "paths/" + second,
        ancestor: author_folder + "pathlinks/" + ancestor,
        tag: author_folder + "pathlinks/" + pathlink_hash
    })

    checker.checkDir("files/" + author_folder + "pathlinks/") // checking
    fs.writeFileSync("files/" + author_folder + "pathlinks/" + pathlink_hash, buffer);
    
    return pathlink_hash;
}


/** tree
* [Pioneer Protocol Buffer Creation]
* 
* @param {string} author (optional, default=pioneer_hash)
* @param {string} text   (optional, default=tree_hash)
* @param {string} head   (required)
* @param {string} ancestor (optional, default=tree_hash)
* @param {string} format (required)
* 
* @return {string} tree_hash
*/
function tree(text, head, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var tree_pb = pb(fs.readFileSync('node_modules/pathchain/proto/tree.proto'))
 
    var author_folder = author;
    if(author == ""){
         author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
         author_folder = "";
    }else{
         author_folder = author_folder + '/';
    }
 
    var register = new Date()
    register = dt.format(register, dt.compile(format, true));
 
    var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
 
    var tree_hash = sha256(register_moment_hash + "_" + author);
    
    if(text == ""){ text = tree_hash; }
    if(head == ""){ return "Head node_link is required to create a tree!" }
    if(ancestor == ""){ ancestor = tree_hash; }
 
    var buffer = tree_pb.tree.encode({
        register: "moments/"+register_moment_hash,
        author: author,
        text: text,
        head: "nodelinks/" + head,
        ancestor: author_folder + "trees/" + ancestor,
        tag: author_folder + "trees/" + tree_hash,
    })
 
    checker.checkDir("files/" + author_folder + "trees/") // checking
    fs.writeFileSync("files/" + author_folder + "trees/" + tree_hash, buffer);
    
    return tree_hash;
}


/** treelink
 * [Label Protocol Buffer Creation]
 * 
 * @param {string} author (optional, default=pioneer_hash)
 * @param {string} file   (optional)
 * @param {string} str    (optional)
 * @param {string} format (required)
 * 
 * @return {string} treelink_hash
 */
function treelink(first, second, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var treelink_pb = pb(fs.readFileSync('node_modules/pathchain/proto/treelink.proto'))

    if(first == "" || second == "") return "Two trees are required to create a treelink";

    var author_folder = author; 
    if(author == ""){
        author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    }else{
        author_folder = author_folder + '/';
    }

    var register = new Date()
    register = dt.format(register, dt.compile(format, true));

    var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
    
    var treelink_hash = sha256(register_moment_hash + "_" + author);

    if(ancestor == ""){
        ancestor = treelink_hash;        
    }
    
    var buffer = treelink_pb.treelink.encode({
        register: "moments/" + register_moment_hash,
        author: "etities/" + author,
        first: "trees/" + first,
        second: "trees/" + second,
        ancestor: author_folder + "treelinks/" + ancestor,
        tag: author_folder + "treelinks/" + treelink_hash
    })

    checker.checkDir("files/" + author_folder + "treelinks/") // checking
    fs.writeFileSync("files/" + author_folder + "treelinks/" + treelink_hash, buffer);
    
    return treelink_hash;
}


/** label
 * [Label Protocol Buffer Creation]
 * 
 * @param {string} author (optional, default=pioneer_hash)
 * @param {string} file   (optional)
 * @param {string} str    (optional)
 * @param {string} format (required)
 * 
 * @return {string} label_hash
 */
function label(text, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var label_pb = pb(fs.readFileSync('node_modules/pathchain/proto/label.proto'))

    var author_folder = author; 
    if(author == ""){
        author = author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    }else{
        author_folder = author_folder + '/';
    }

    var register = new Date()
    register = dt.format(register, dt.compile(format, true));

    var register_moment_hash = moment(register, 0, 0, 0, 0, 0, format)
    
    var label_hash = sha256(register_moment_hash + "_" + author);

    if(ancestor == ""){
        ancestor = label_hash;        
    }
    
    var buffer = label_pb.label.encode({
        register: "moments/" + register_moment_hash,
        author: "etities/" + author,
        text: text,
        ancestor: author_folder + "labels/" + ancestor,
        tag: author_folder + "labels/" + label_hash
    })

    checker.checkDir("files/" + author_folder + "labels/") // checking
    fs.writeFileSync("files/" + author_folder + "labels/" + label_hash, buffer);
    
    return label_hash;
}


module.exports = { moment, pioneer, secret, entity, node, nodelink, path, pathlink, tree, treelink, label }