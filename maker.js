// Required modules
const fs = require("fs");
const pb = require('protocol-buffers');
const dt = require('date-and-time');
const sha256 = require("js-sha256");
const getter = require("./getter");
const checker = require("./checker");
const updater = require("./updater");

/**
 * Creates a moment Protocol Buffer
 * @param {string} datetime - Timestamp (optional)
 * @param {number} lat - Latitude (optional)
 * @param {number} lon - Longitude (optional)
 * @param {number} x - X coordinate (optional)
 * @param {number} y - Y coordinate (optional)
 * @param {number} z - Z coordinate (optional)
 * @param {string} format - Date format (optional)
 * @returns {string} moment_hash - Hash of the created moment
 */
function moment(datetime, lat, lon, x, y, z, format) {
    const moment_pb = pb(fs.readFileSync('node_modules/pathchain/proto/moment.proto'));
    
    const date_obj = dt.preparse(datetime, format);
    const moment_obj = {
        coordinates: {
            lat: lat,
            lon: lon,
            xyz: { x: x, y: y, z: z }
        },
        datetime: {
            Y: date_obj.Y, M: date_obj.M, D: date_obj.D,
            H: date_obj.H, A: date_obj.A, h: date_obj.h,
            m: date_obj.m, s: date_obj.s, S: date_obj.S,
            Z: date_obj.Z, _index: date_obj._index,
            _length: date_obj._length, _match: date_obj._match
        }
    };

    const buffer = moment_pb.moment.encode(moment_obj);
    const moment_hash = sha256(JSON.stringify(moment_pb.moment.decode(buffer)));

    checker.checkDir("files/moments/");
    fs.writeFileSync(`files/moments/${moment_hash}`, buffer);

    return moment_hash;
}

/**
 * Creates a secret Protocol Buffer
 * @param {string} author - Author of the secret (optional, default=pioneer_hash)
 * @param {string} format - Date format (required)
 * @returns {string} secret_hash - Hash of the created secret
 */
function secret(author, format) {
    checker.checkDir("files/entities/");

    // Create secret only if there's no pioneer yet
    if (checker.checkEmptyDir("files/entities/")) {
        const secret_pb = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'));

        const register = dt.format(new Date(), dt.compile(format, true));
        const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);
        
        const secret_hash = sha256(`${register_moment_hash}_${author}`);
        
        const buffer = secret_pb.secret.encode({
            register: `moments/${register_moment_hash}`,
            author: `entities/${author}`,
            user: `entities/${author}`,
            used: false,
            tag: `secrets/${secret_hash}`,
        });

        checker.checkDir("files/secrets/");
        checker.checkDir(`files/${author}/secrets/`);

        fs.writeFileSync(`files/secrets/${secret_hash}`, buffer);
        fs.writeFileSync(`files/${author}/secrets/${secret_hash}`, buffer);
        
        return secret_hash;
    } else {
        return "The pioneer has only one secret";
    }
}

/**
 * Creates the pioneer (first entity) Protocol Buffer
 * @param {string} xbigbang - The creation moment (required)
 * @param {string} format - Date format (required)
 * @returns {string} pioneer_hash - Hash of the created pioneer
 */
function pioneer(xbigbang, format) {
    checker.checkDir("files/entities/");

    // Create pioneer only if there's no pioneer yet
    if (checker.checkEmptyDir("files/entities/")) {
        const entity = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'));
        
        const register = dt.format(new Date(), dt.compile(format, true));
        const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);

        const birthday = dt.format(dt.parse(xbigbang, format, true), format, true);
        const birthday_moment = moment(birthday, 0, 0, 0, 0, 0, format);

        const pioneer_hash = sha256(`${register_moment_hash}_${birthday_moment}`);

        const buffer = entity.entity.encode({
            register: `moments/${register_moment_hash}`,
            ancestor: `entities/${pioneer_hash}`, // points to itself as ancestor
            tag: `entities/${pioneer_hash}`,
        });

        const the_secret = secret(pioneer_hash, format);
        console.log("The pioneer secret buffer is: ", the_secret);

        checker.checkDir("files/entities/");
        fs.writeFileSync(`files/entities/${pioneer_hash}`, buffer);

        checker.checkDir("files/pioneer/");
        fs.writeFileSync(`files/pioneer/${pioneer_hash}`, buffer);

        return pioneer_hash;
    } else {
        return checker.checkFiles('files/pioneer/')[0];
    }
}

/**
 * Creates an entity Protocol Buffer
 * @param {string} xsecret - Secret used for entity creation (required)
 * @param {string} format - Date format (optional)
 * @returns {string} entity_hash - Hash of the created entity
 */
function entity(xsecret, format) {
    checker.checkDir("files/entities/");
    if (checker.checkEmptyDir("files/entities/")) {
        return "A pioneer's secret is needed to create the first entity. The pioneer can be found at 'files/pioneer/'" + pioneer();
    } else {
        if (checker.isSecretUsed(xsecret) == false) {
            const entity = pb(fs.readFileSync('node_modules/pathchain/proto/entity.proto'));
            
            const register = dt.format(new Date(), dt.compile(format, true));
            const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);
            const ancestor_entity_hash = getter.getSecretObj(xsecret, "").author;

            const entity_hash = sha256(`${register_moment_hash}_${ancestor_entity_hash}`);

            const buffer = entity.entity.encode({
                register: `moments/${register_moment_hash}`,
                ancestor: `${ancestor_entity_hash}`,
                tag: `entities/${entity_hash}`,
            });

            const updated_secret = updater.useSecret(xsecret, entity_hash);
            console.log("Updated secret: ", updated_secret);

            checker.checkDir("files/entities/");
            fs.writeFileSync(`files/entities/${entity_hash}`, buffer);

            return entity_hash;
        } else {
            return "Secret has been already used or it was not found";
        }
    }
}

/**
 * Creates a node Protocol Buffer
 * @param {string} text - Node content (required)
 * @param {string} author - Author of the node (optional, default=pioneer_hash)
 * @param {string} format - Date format (optional)
 * @returns {string} node_hash - Hash of the created node
 */
function node(text, author, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    const node_pb = pb(fs.readFileSync('node_modules/pathchain/proto/node.proto'));

    let author_folder = author;
    if (author == "") {
        author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    } else {
        author_folder = `${author_folder}/`;
    }

    const register = dt.format(new Date(), dt.compile(format, true));
    const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);
    
    const node_hash = sha256(`${register_moment_hash}_${author}`);
    
    const buffer = node_pb.node.encode({
        register: `moments/${register_moment_hash}`,
        author: `entities/${author}`,
        text: text,
        tag: `nodes/${node_hash}`
    });

    checker.checkDir(`files/${author_folder}nodes/`);
    fs.writeFileSync(`files/${author_folder}nodes/${node_hash}`, buffer);
    
    return node_hash;
}

/**
 * Creates a path Protocol Buffer
 * @param {string} text - Path description (optional, default=path_hash)
 * @param {Array} elements - Array of elements in the path (required)
 * @param {string} author - Author of the path (optional, default=pioneer_hash)
 * @param {string} ancestor - Ancestor path (optional, default=path_hash)
 * @param {string} format - Date format (optional)
 * @returns {string} path_hash - Hash of the created path
 */
function path(text, elements, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    const path_pb = pb(fs.readFileSync('node_modules/pathchain/proto/path.proto'));

    let author_folder = author;
    if (author == "") {
        author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    } else {
        author_folder = `${author_folder}/`;
    }

    const register = dt.format(new Date(), dt.compile(format, true));
    const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);

    const path_hash = sha256(`${register_moment_hash}_${author}`);
   
    if (text == "") { text = path_hash; }
 
    let prev_link = "";
    let head_link = "";

    // Building target chain
    for (let i = 0; i < elements.length; i++) {
        // link with no next and no prev is set with its target as the current element
        const current_link = link(elements[i], "", "", author, "");
        // only if this is not the first element
        if (i > 0) {
            // For the previous element, set the current element as its next element
            updater.setLinkNext(prev_link, current_link);
            // For the current element, set the previous element as its previous element
            updater.setLinkPrev(current_link, prev_link);
        }
        head_link = current_link;
        // for the next iteration, the previous link is set as the current link
        prev_link = current_link;
    }

    if (ancestor == "") { ancestor = path_hash; }

    const buffer = path_pb.path.encode({
        register: `moments/${register_moment_hash}`,
        author: author,
        text: text,
        head: `${head_link}`,
        ancestor: `${author_folder}paths/${ancestor}`,
        tag: `${author_folder}paths/${path_hash}`,
    });

    checker.checkDir(`files/${author_folder}paths/`);
    fs.writeFileSync(`files/${author_folder}paths/${path_hash}`, buffer);
   
    return path_hash;
}

/**
 * Creates a label Protocol Buffer
 * @param {string} text - Label text (required)
 * @param {string} author - Author of the label (optional, default=pioneer_hash)
 * @param {string} ancestor - Ancestor label (optional, default=label_hash)
 * @param {string} format - Date format (optional)
 * @returns {string} label_hash - Hash of the created label
 */
function label(text, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    const label_pb = pb(fs.readFileSync('node_modules/pathchain/proto/label.proto'));

    let author_folder = author; 
    if (author == "") {
        author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    } else {
        author_folder = `${author_folder}/`;
    }

    const register = dt.format(new Date(), dt.compile(format, true));
    const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);
    
    const label_hash = sha256(`${register_moment_hash}_${author}`);

    if (ancestor == "") {
        ancestor = label_hash;        
    }
    
    const buffer = label_pb.label.encode({
        register: `moments/${register_moment_hash}`,
        author: `entities/${author}`,
        text: text,
        ancestor: `${author_folder}labels/${ancestor}`,
        tag: `${author_folder}labels/${label_hash}`
    });

    checker.checkDir(`files/${author_folder}labels/`);
    fs.writeFileSync(`files/${author_folder}labels/${label_hash}`, buffer);
    
    return label_hash;
}

/**
 * Creates a link Protocol Buffer
 * @param {string} target - Target of the link (required)
 * @param {string} prev - Previous link in chain (optional, default=link_hash)
 * @param {string} next - Next link in chain (optional, default=link_hash)
 * @param {string} author - Author of the link (optional, default=pioneer_hash)
 * @param {string} ancestor - Ancestor link (optional, default=link_hash)
 * @param {string} format - Date format (optional)
 * @returns {string} link_hash - Hash of the created link
 */
function link(target, prev, next, author, ancestor, format = 'MM DD YYYY HH:mm:SSS [GMT]Z') {
    // Load the link protocol buffer definition
    const link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'));
    var target_type = "";

    // Handle author and author folder
    let author_folder = author; 
    if (author === "") {
        author = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    } else {
        author_folder = `${author_folder}/`;
    }

    // Validate target
    if (target === "") {
        return "The link must be linking something. The target cannot be null.";
    }
    else{
        var splitted_target = target.split("/");
        console.log("Splitted target: ", splitted_target);
        if(splitted_target.length>1){
            target_type = splitted_target[splitted_target.length - 2];
            console.log("Target type: ", target_type);
        }
        else{
            // Determine the nature of the target (node, path, or label)
            if (checker.checkFile(`files/${author_folder}nodes/${target}`)) {
                target_type = "nodes";
                target = `${author_folder}nodes/${target}`;
            } else if (checker.checkFile(`files/${author_folder}paths/${target}`)) {
                target_type = "paths";
                target = `${author_folder}paths/${target}`;
            } else if (checker.checkFile(`files/${author_folder}labels/${target}`)) {
                target_type = "labels";
                target = `${author_folder}labels/${target}`;
            }
            console.log("Target type determined for single buffer: ", target_type);
        }
    }

    // Checking target existance
    if (!checker.checkFile(`files/${target}`)) {
        return "Target was not found!";
    }

    // Homogenize the author.
    // Break down the target address
    // Make a copy of it inside *author* address if it is not public or if the original author is different than *author*
    // What the fuck 

    // Create a moment for this link
    const register = dt.format(new Date(), dt.compile(format, true));
    const register_moment_hash = moment(register, 0, 0, 0, 0, 0, format);
    
    // Generate a unique hash for this link
    const link_hash = sha256(`${register_moment_hash}_${author}_${prev}_${next}`);
    
    // Set default values if not provided
    if (ancestor === "") { ancestor = link_hash; }
    if (prev === "") { prev = link_hash; }
    if (next === "") { next = link_hash; }

    // Encode the link data into a protocol buffer
    const buffer = link_pb.link.encode({
        register: `moments/${register_moment_hash}`,
        author: `entities/${author}`,
        prev: `${author_folder}links/${prev}`,
        next: `${author_folder}links/${next}`,
        target: target,
        ancestor: `${author_folder}links/${ancestor}`,
        tag: `${author_folder}links/${link_hash}`
    });

    // Ensure the directory exists and write the link buffer to a file
    checker.checkDir(`files/${author_folder}links/`);
    fs.writeFileSync(`files/${author_folder}links/${link_hash}`, buffer);
    
    return `${author_folder}links/${link_hash}`;
}

module.exports = { moment, pioneer, secret, entity, node, path, label, link };