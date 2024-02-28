var fs = require("fs");
var pb = require('protocol-buffers');

/** useSecret
 * [Function that changes a secret state to used]
 * 
 * @param {string} xsecret
 * 
 * @return {string} xsecret
 */
function useSecret(xsecret, xauthor = "") {
    if(xauthor != ""){
        xauthor = xauthor + '/';
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

module.exports = { useSecret }