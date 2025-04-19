const fs = require('fs');
const pb = require('protocol-buffers');
const getter = require('./getter');

/**
 * Changes a secret's state to used and associates it with a user.
 * @param {string} xsecret - The secret hash.
 * @param {string} [xauthor=''] - The author of the secret (optional).
 * @returns {Object|string} The updated secret object or an error message.
 */
function useSecret(xsecret, xauthor = '') {
    if (!xauthor) {
        xauthor = pioneer(getter.getCurrentDate(), 'MM DD YYYY HH:mm:SSS [GMT]Z');
    }

    const secretProto = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'));
    const filePath = `files/secrets/${xsecret}`;

    try {
        const fileContents = fs.readFileSync(filePath);
        const secretObj = secretProto.secret.decode(fileContents);

        if (!secretObj.used) {
            secretObj.used = true;
            secretObj.user = `entities/${xauthor}`;
            fs.writeFileSync(filePath, secretProto.secret.encode(secretObj));
        }

        return secretObj;
    } catch (err) {
        return err.code === 'ENOENT' ? `Secret '${xsecret}' not found` : err;
    }
}

/**
 * Updates the 'next' pointer of a link.
 * @param {string} xlink - The current link hash.
 * @param {string} xnextlink - The next link hash.
 * @returns {Object|string} The updated link object or an error message.
 */
function setLinkNext(xlink = '', xnextlink = '') {
    console.log('Setting link:', xnextlink);
    console.log('As NEXT link for:', xlink);

    const link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'));

    try {
        // Check if both links exist
        fs.readFileSync(`files/${xlink}`);
        fs.readFileSync(`files/${xnextlink}`);

        const fileContents = fs.readFileSync(`files/${xlink}`);
        const linkObj = link_pb.link.decode(fileContents);
        linkObj.next = xnextlink;
        fs.writeFileSync(`files/${xlink}`, link_pb.link.encode(linkObj));
        
    
        // Ensure the directory exists and overwrite the link buffer to a file
        // checker.checkDir(`files/${xlink}`);
        // fs.writeFileSync(`files/${xlink}`, buffer);
        
        return xlink;
    } catch (err) {
        return err.code === 'ENOENT' ? `Link '${err.path.split('/').pop()}' not found` : err;
    }
}

/**
 * Updates the 'previous' pointer of a link.
 * @param {string} xlink - The current link hash.
 * @param {string} xprevlink - The previous link hash.
 * @returns {Object|string} The updated link object or an error message.
 */
function setLinkPrev(xlink = '', xprevlink = '') {
    console.log('Setting link:', xprevlink);
    console.log('As PREV link for:', xlink);

    const link_pb = pb(fs.readFileSync('node_modules/pathchain/proto/link.proto'));

    try {
        fs.readFileSync(`files/${xlink}`);
        fs.readFileSync(`files/${xprevlink}`);

        const fileContents = fs.readFileSync(`files/${xlink}`);
        const linkObj = link_pb.link.decode(fileContents);
        linkObj.prev = xprevlink;
        fs.writeFileSync(`files/${xlink}`, link_pb.link.encode(linkObj));
        
        return xlink;

    } catch (err) {
        return err.code === 'ENOENT' ? `Link '${err.path.split('/').pop()}' not found` : err;
    }
}

module.exports = { useSecret, setLinkNext, setLinkPrev };