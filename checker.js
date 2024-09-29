const fs = require('fs');
const emptyDir = require('empty-dir');
const pb = require('protocol-buffers');

/**
 * Creates a directory if it does not exist.
 * @param {string} dir - The directory path to check and create.
 */
function checkDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Returns an array of files in the specified directory.
 * @param {string} dir - The directory path to check.
 * @returns {string[]} An array of file names in the directory.
 */
function checkFiles(dir) {
    return fs.readdirSync(dir);
}

/**
 * Checks if the specified directory is empty.
 * @param {string} dir - The directory path to check.
 * @returns {boolean} True if the directory is empty, false otherwise.
 */
function checkEmptyDir(dir) {
    return emptyDir.sync(dir);
}

/**
 * Checks if a file exists at the specified path.
 * @param {string} dir - The file path to check.
 * @returns {boolean} True if the file exists, false otherwise.
 */
function checkFile(dir) {
    try {
        return fs.existsSync(dir);
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Checks if a secret has been used.
 * @param {string} xsecret - The secret hash.
 * @param {string} [xauthor=''] - The author of the secret (optional).
 * @returns {boolean|string} True if the secret has been used, false if not, or an error message.
 */
function isSecretUsed(xsecret, xauthor = '') {
    const secretProto = pb(fs.readFileSync('node_modules/pathchain/proto/secret.proto'));
    const filePath = `files/${xauthor ? xauthor + '/' : ''}secrets/${xsecret}`;

    try {
        const fileContents = fs.readFileSync(filePath);
        const secretObj = secretProto.secret.decode(fileContents);
        return secretObj.used;
    } catch (err) {
        return err.code === 'ENOENT' ? 'Secret not found' : err;
    }
}

module.exports = {
    checkDir,
    checkFiles,
    checkFile,
    checkEmptyDir,
    isSecretUsed
};