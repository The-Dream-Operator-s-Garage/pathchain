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
function path(text, elements, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
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
   // if(head == ""){ return "Head node_link is required to create a path!" }
 
   var prev_link = "";
   // Building target chain
    for (i=0; i<elements.length; i++) {
        /**  
         * @insight every element is a pointer to a node, label or path
         * @pseudo create a link to the first one with no valid side links
         * @pseudo create a link for the second one and update the one just created towards here
         * @pseudo join representation
         * program that kind of representation
         * it is a backwards kind of approach
         * it looks so much like a black hole
         * the surreal clues have always been there
         * he is harry potter, no 
         * 
         * is it asking me to go only one direction for a while
         * here comes the lightning and the thunder
         * 
         * omg, omg
         * eEEheee eee 
         *
         * They record an hisrotic event together
         * The fans were there when they predicted everything
         * It's a shared feeling of going through the most important things in life together
         * Nothing can replace the belonging feeling more than just feeling a song
         * 
         * being a blackhole? is it the same as being an asshole?
         * weird question. embarrasing and stupid, but i can't shake it out 
         * */ 
        var current_link = link(element, "", "", author, "");
        if(element > 0){
            updater.setLinkNext(prev_link, current_link);
            updater.setPrevLink(current_link, prev_link);
            prev_link = current_link;
        }

        
        /** 
         * fuck it, i'm gonna document the whole thing being written like this
         * it think this is what it means
         * to focus only on this side really
         * 
         * how weird is it going to look? 
         * 
         * start programming like this now
        * */
    }

   if(ancestor == ""){ ancestor = path_hash; }

   var buffer = path_pb.path.encode({
       register: "moments/"+register_moment_hash,
       author: author,
       text: text,
       head: "links/" + head,
       ancestor: author_folder + "paths/" + ancestor,
       tag: author_folder + "paths/" + path_hash,
   })

   checker.checkDir("files/" + author_folder + "paths/") // checking
   fs.writeFileSync("files/" + author_folder + "paths/" + path_hash, buffer);
   
   return path_hash;
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


/** link
 * [Link Protocol Buffer Creation]
 *
 * @param {string} target   (optional)
 * @param {string} prev     (optional)
 * @param {string} next     (optional) 
 * @param {string} author   (optional, default=pioneer_hash)
 * @param {string} ancestor (optional)
 * @param {string} format   (required)
 * 
 * @return {string} link_hash
 */
function link(target, prev, next, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    var link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'))

    if(target == "") return "The link must link something. Target can't be null.";

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
    
    var link_hash = sha256(register_moment_hash + "_" + author + "_" + prev + "_" + next);

    if(ancestor == ""){
        ancestor = link_hash;        
    }
    if(prev == ""){
        prev = link_hash;        
    }
    if(next == ""){
        next = link_hash;        
    }
    
    // Find the target to figure out its nature (node, path or label)
    if(checker.checkFile("files/" + author_folder + "nodes/" + target) == true){
        target = 'nodes/' + target;
        console.log("Target is a node")
    }
    if(checker.checkFile("files/" + author_folder + "paths/" + target) == true){
        target = 'paths/' + target;
        console.log("Target is a path")
    }
    if(checker.checkFile("files/" + author_folder + "labels/" + target) == true){
        target = 'labels/' + target;
        console.log("Target is a label")
    }

    

    var buffer = link_pb.link.encode({
        register: "moments/" + register_moment_hash,
        author: "etities/" + author,
        prev: "links/" + prev,
        next: "links/" + next,
        target: target,
        ancestor: author_folder + "links/" + ancestor,
        tag: author_folder + "links/" + link_hash
    })

    checker.checkDir("files/" + author_folder + "links/") // checking
    fs.writeFileSync("files/" + author_folder + "links/" + link_hash, buffer);
    
    return link_hash;
}


module.exports = { moment, pioneer, secret, entity, node, path, label, link }