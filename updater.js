var fs = require("fs");
var pb = require('protocol-buffers');
const getter = require("./getter");

/** useSecret
 * [Function that changes a secret state to used]
 * 
 * @param {string} xsecret
 * 
 * @return {string} xsecret
 */
function useSecret(xsecret, xauthor = "") {
    let author_folder = xauthor;
    if (xauthor == "") {
        xauthor = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
        author_folder = "";
    } else {
        author_folder = `${author_folder}/`;
    }

    // LOADING PB
    var secret_pb = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'))
    
    // NOT FOUND EXCEPTION
    var fileContents;
    try {
        fileContents = fs.readFileSync("files/secrets/" + xsecret);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Secret '" + xsecret + "' not found";
        } else {
            throw err;
        }
    }

    // DECODING SECRET
    var secret_enc = fileContents
    var secret_obj = secret_pb.secret.decode(secret_enc)

    if(secret_obj.used == false){
        // USING INVITE SECRET
        secret_obj.used = true;
        secret_obj.user = "entities/"+xauthor;

        // Public handling only >:c
        fs.writeFileSync("files/secrets/" + xsecret, secret_pb.secret.encode(secret_obj));
    }
    return secret_obj;
}


/** setLinkNext
 * [Function that updates the 'next' pointer of a link]
 * 
 * @param {string} xlink
 * @param {string} xnextlink
 * 
 * @return {string} xlink
 */
function setLinkNext(xlink = "", xnextlink = "") {
    console.log("Setting link: ", xnextlink);
    console.log("As NEXT link for: ", xlink);

    // LOADING PB
    var link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'))
    
    // EXCEPTIONS FOR NOT FOUND LINKS
    var fileContents;

    // NOT FOUND EXCEPTION FOR 'xlink'
    try {
        fileContents = fs.readFileSync("files/" + xlink);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Link '" + xlink + "' not found";
        } else {
            throw err;
        }
    }

    // NOT FOUND EXCEPTION FOR 'xnextlink'
    try {
        fileContents = fs.readFileSync("files/" + xnextlink);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Link '" + xnextlink + "' not found";
        } else {
            throw err;
        }
    }

    // DECODING LINK
    var link_enc = fileContents
    var link_obj = link_pb.link.decode(link_enc)

    link_obj.next = xnextlink;
    return link_obj;
}


/** setLinkPrev
 * [Function that updates the 'previous' pointer of a link]
 * 
 * @param {string} xlink
 * @param {string} xprevlink
 * 
 * @return {string} xlink
 */
function setLinkPrev(xlink = "", xprevlink = "") {
    console.log("Setting link: ", xprevlink);
    console.log("As PREV link for: ", xlink);

    // LOADING PB
    var link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'))
    
    // EXCEPTIONS FOR NOT FOUND LINKS
    var fileContents;

    // NOT FOUND EXCEPTION FOR 'xlink'
    try {
        fileContents = fs.readFileSync("files/" + xlink);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Link '" + xlink + "' not found";
        } else {
            throw err;
        }
    }

    // NOT FOUND EXCEPTION FOR 'xprevlink'
    try {
        fileContents = fs.readFileSync("files/" + xprevlink);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return "Link '" + xprevlink + "' not found";
        } else {
            throw err;
        }
    }

    // DECODING LINK
    var link_enc = fileContents
    var link_obj = link_pb.link.decode(link_enc)

    link_obj.prev = xprevlink;
    return link_obj;
}

module.exports = { useSecret, setLinkNext, setLinkPrev }