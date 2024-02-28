# pathchain [![npm version](https://badge.fury.io/js/pathchain.svg)](https://badge.fury.io/js/pathchain) [![open source](https://img.shields.io/badge/open%20source-pathchain-grey?labelColor=purple&style=flat&logo=Github&logoColor=white&link=http://github.com/rockstarallegue/pathchain.git)](http://github.com/rockstarallegue/pathchain.git)
![image](https://user-images.githubusercontent.com/104391124/282268780-cbbc1ee6-8d97-4d80-b896-66ae3eb723dd.png)


Pathchain is a tool to build path-shaped data structures that are chained one to another from the very moment the tool is initialized. The data behaves like a data tree where you can track the very origin of anything by tracking the origin file hashnames that created any hashname of any file in the chain. Pathchain uses Google's Protocol Buffers to encode and decode the data structures optimally and SHA-256 to build the hashname chain.

---
# Pathchain documentation



# Makers
Maker functions recieve new data to encode into the chain.

| Function                      | Parameters                              |
| ----------------------------- | --------------------------------------- |
| [`makeMoment()`](#Moment)     | datetime, lat, lon, x, y, z, format     |
| [`makePioneer()`](#Pioneer)   | format                                  |
| [`makeSecret()`](#Secret)     | author, format                          |
| [`makeEntity()`](#Entity)     | xsecret, format                         |
| [`makeNode()`](#Node)         | text, xauthor, format                   |
| [`makeNodelink()`](#Nodelink) | first, second, author, ancestor, format |
| [`makePath()`](#Path)         | xauthor, text, head, ancestor, format   |
| [`makePathlink()`](#Pathlink) | first, second, author, ancestor, format |
| [`makeTree()`](#Tree)         | xauthor, text, head, ancestor, format   |


---
# Getters
Getter functions retrieve objects given a hashname and author information

| Function                     | Parameters                               |
| ---------------------------- | ---------------------------------------- |
| [`getMoment()`](#Moment)     | xmoment                                  |
| [`getPioneer()`](#Pioneer)   | (none)                                   |
| [`getSecret()`](#Secret)     | xsecret, xauthor                         |
| [`getEntity()`](#Entity)     | xentity, xauthor                         |
| [`getNode()`](#Node)         | xnode, xauthor                           |
| [`getNodelink()`](#Nodelink) | xnodelink, xauthor                       |
| [`getPath()`](#Path)         | xpath, xauthor                           |
| [`getPathlink()`](#Pathlink) | xpathlink, xauthor                       |
| [`getTree()`](#Tree)         | xtree, xauthor                           |
| [`getTreelink()`](#Treelink) | xtreelink, xauthor                       |


---
## Moment

A moment is the mimimum representation of the pathchain data structures. Moments are the trunk of every path . They're represented by default with a `MM DD YYYY HH:mm:SSS [GMT]Z` datetime format for `time` and a planet earth representation (0, 0, 0) in general as `space`.

`<moment>` :: space and time data ::= { `<“moments/”>` + sha256(`<moment>`) }

#### Protocol Buffer file:

``` proto
syntax = "proto3";

message moment {
    message space {
        message position {
            optional double x = 1;
            optional double y = 2;
            optional double z = 3;
        }

        optional float lat = 1;
        optional float lon = 2;
        optional position xyz = 3;
    }

    message time {
        optional int32 Y = 1;
        optional int32 M = 2;
        optional int32 D = 3;
        optional int32 H = 4;
        optional int32 A = 5;
        optional int32 h = 6;
        optional int32 m = 7;
        optional int32 s = 8;
        optional int32 S = 9;
        optional int32 Z = 10;
        optional int32 _index = 11;
        optional int32 _length = 12;
        optional int32 _match = 13;
    }

    optional space coordinates = 1;
    optional time datetime = 2;
}
```

#### Moment maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} datetime        |(optional)|
|{float}  lat             |(optional)|
|{float}  lon             |(optional)|
|{float}  x               |(optional)|
|{float}  y               |(optional)|
|{float}  z               |(optional)|
|{string} format          |(optional)|


---
Summoning `makeMoment(datetime, lat, lon, x, y, z, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

const moment_pb = pathchain.makeMoment(); // Making moment
console.log("Moment buffer: ", moment); // Printing
```

Console: 
``` bash
Moment buffer:  c0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```

#### Moment getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xauthor  |(optional)|
|{string} xmoment  |(required)|


---
Summoning `getMomentObj(xauthor, xmoment)`
```
const pathchain = require("pathchain"); // Summoning pathchain

const moment_pb = pathchain.makeMoment(); // Moment creation
var moment_obj = pathchain.getMomentObj(moment_buff); // Printing
```

Console: 
``` bash
Moment object:  {
  coordinates: { lat: 0, lon: 0, xyz: { x: 0, y: 0, z: 0 } },
  datetime: {
    Y: 2023,
    M: 11,
    D: 8,
    H: 3,
    A: 0,
    h: 0,
    m: 17,
    s: 0,
    S: 175,
    Z: 360,
    _index: 29,
    _length: 29,
    _match: 7
  }
}
```

## Secret

A secret is an OTP (One Time Password) generated by an entity. The moment it is used, it becomes useless. Secrets are represented as SHA-256 hashes, like everything on pathchain.

`<secret>` :: secret hash generated by an entity ::= { `<“secrets/”>` + sha256(`<moment>` + `<entity>`) }

#### Protocol Buffer file:

``` proto
syntax = "proto3";

message secret {
    required string register = 1;
    required string author = 2;
    required bool used = 3;
    required string tag = 4;
}
```

#### Secret maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} author          |(required)|
|{string} format          |(optional)|

---
Summoning `makeMoment(author, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

var sec_pioneer_buff = pathchain.makeSecret(author); // Making a secret with an existing entity hash
console.log("Secret buffer: ", secret); // Printing
```

Console: 
``` bash
Secret buffer:  c0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```

#### Secret usage (using a secret / checking if a secret has been used)

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xsecret         |(required)|


---
Summoning `useSecret(xsecret)` & `isSecretUsed(xsecret)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

var secret_buff = pathchain.makeSecret(author); // Making a secret with an existing entity hash
console.log("Secret buffer: ", secret); // Printing

// Checking if the secret has been used (before using it)
var used = pathchain.isSecretUsed(secret_buff);
console.log("Secret buffer used?: ", used); // Printing

// Using the secret
pathchain.useSecret(secret_buff, xentity);

// Checking if the secret has been used (before using it)
var used = pathchain.isSecretUsed(secret_buff);
console.log("Secret buffer used?: ", used); // Printing
```

Console: 
``` bash
Secret buffer:  c0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```

``` bash
Secret buffer used?: false
```

``` bash
Secret buffer used?: true
```


#### Secret getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xsecret         |(required)|


---
Summoning `getSecretObj(xsecret)`:
```javascript

const pathchain = require("pathchain"); // Summoning pathchain

const secret_buff = pathchain.makeSecret(author); // Secret creation

var secret_obj = pathchain.getSecretObj(secret_buff); //   Getting object from hashname

console.log("Secret object: ", secret_obj); // Printing
```

Console: 
``` bash
Secret object:  {
  register: 'moments/638976edf4684e746f9bd013bd2e9145b1316ee42b40b0877185f6aeda960b8d',
  author: 'pioneer/ebd4ff7e4f69d1c4c2b529eb60a7ca72bb459c1458e1a011b26b6ea84901d143',
  used: false,
  tag: 'secrets/574e8fee76ba4dc93c2f4cd79399aa01e6cfb19257e4eb305dcfaeb16649b7bf'
}
```


## Pioneer

A pioneer is a user with all its content made public. It is the first entity on the system and can only generate one [secret](#Secret) in order to initiate the human chain for the system. The pioneer buffer exists as a single buffer in the `pioneer` folder and as an [entity](#Entity) in the `entities` folder.

`<pioneer>` :: pioneer entity ::= { `<“pioneer/”>` + sha256(`<moment>` +  `<moment>`) }


#### Pioneer maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|                         |(nothing) |


---
Summoning `makePioneer()`:
```javascript

const pathchain = require("pathchain"); // Summoning pathchain

var pioneer_buff = pathchain.makePioneer(); // Pioneer creation

console.log("Pioneer buffer: ", pioneer_buff);
```

Console: 
``` bash
Pioneer buffer:  d945dfb67de94dafbcf0ea35281c7ca534a293db3a4d1ffd82523cd97ff8110f
```

** If you summon `makePioneer()` again, it will always return the original pioneer. The pioneer will be the same forever and ever!. For the same reason, summoning `getPioneerObj()` does not require parameters. If the pioneer does not exist, it is automatically created by the system. **

#### Pioneer getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|                         |(nothing) |


---
Summoning `getPioneerObj()`:
```javascript

const pathchain = require("pathchain"); // Summoning pathchain


var pioneer_buff = pathchain.makePioneer(); // Pioneer creation
var pioneer_obj = pathchain.getPioneerObj();

console.log("Pioneer buffer: ", pioneer_buff);
console.log("Pioneer object: ", pioneer_obj);
```


Console: 
``` bash
Pioneer buffer:  d945dfb67de94dafbcf0ea35281c7ca534a293db3a4d1ffd82523cd97ff8110f
Pioneer object:  {
  register: 'moments/c73d1ca5abc2e158c76747f7c2d56afc729614042a88d46603991fe8f3d4b518',
  ancestor: 'entities/d945dfb67de94dafbcf0ea35281c7ca534a293db3a4d1ffd82523cd97ff8110f',
  tag: 'entities/d945dfb67de94dafbcf0ea35281c7ca534a293db3a4d1ffd82523cd97ff8110f'
}
```


## Entity

Entities are the actors/users that create/author and organize information on the pathchain. Entities are linked to information from their origin and their relationship with other entities and data in the system. Entities can expand and organize with other entities to publish or modify data in the name of an 'alter-ego' or an 'organization'. An entity can only join the pathchain using another entitie(s) secret.

`<entity>` :: entity ::= { `<“entities/”>` + sha256(`<moment>` + `<entity>`) }


#### Protocol Buffer file:

``` proto
syntax = "proto3";

message entity {
    required string register = 1;
    required string ancestor = 2;
    required string tag = 3;
}
```


#### Entity maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} author          |(required)|
|{string} format          |(optional)|


---
Summoning `makeEntity(secret, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Entity creation
var entity_buff = pathchain.makeEntity(secret);

console.log("Entity buffer: ", entity_buff);
```

Console: 
``` bash
Entity buffer:  c0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Entity getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xentity         |(required)|


---
Summoning `getEntityObj(xentity)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Entity creation
var entity_buff = pathchain.makeEntity(secret);

// Getting entity obj
var entity_obj = pathchain.getEntityObj(entity_buff);

console.log("Entity buffer: ", entity_buff);
console.log("Entity object: ", entity_obj);
```

Console: 
``` bash
Entity buffer:  9a07ccefa200a3bcf3322fee26f35302f0ec206784d537bb06065bfb9f92885c
Entity object:  {
  register: 'moments/28013246663010e61e9fca8dd21d309959954d95ac90739616126f40b8d93ede',
  ancestor: 'entities/undefined',
  tag: 'entities/9a07ccefa200a3bcf3322fee26f35302f0ec206784d537bb06065bfb9f92885c'
}
```


## Node

Nodes are the primary data storage elements of the pathchain. They can be the representation of plain `text`, the direction of a `file`, or an internet `url`. 

`<node>` :: node ::= { `<“nodes/”>` + sha256(`<moment>` + `<author>` + `<content>`) }


#### Protocol Buffer file:

``` proto
syntax = "proto3";

message node {
    required string register = 1;
    required string author = 2;
    required string file = 3;
    required string text = 4;
    required string url = 5;
    required string tag = 6;
}
```


#### Node maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} author          |(required)|
|{string} text            |(optional)|
|{string} format          |(optional)|


---
Summoning `makeNode(secret, text, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Node creation
var node_buff = pathchain.makeNode(author, content);

console.log("Node buffer: ", node_buff);
```

Console: 
``` bash
Node buffer:  a0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Node getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xnode           |(required)|
|{string} xauthor         |(optional)|


---
Summoning `getNodeObj(xnode)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Node creation
var node_buff = pathchain.makeNode(secret);

// Getting node obj
var node_obj = pathchain.getNodeObj(node_buff);

console.log("Node buffer: ", node_buff);
console.log("Node object: ", node_obj);
```

Console: 
``` bash
Node buffer:  1014d11c4ed954035790bfed6a3c45e2eda2efbd8d77668c8d8c5d95edc6b0dc
Node object:  {
  register: 'moments/299b4964df437863fdd316c86559e032105ee0f6a6388effd004df60b311f75a',
  author: 'd945dfb67de94dafbcf0ea35281c7ca534a293db3a4d1ffd82523cd97ff8110f',
  text: 'Learning to fly, one step closer to knowing',
  tag: 'nodes/1014d11c4ed954035790bfed6a3c45e2eda2efbd8d77668c8d8c5d95edc6b0dc'
}
```


## Nodelink

Nodelinks are the joints of the paths. They __link__ one node with another. 

`<nodelink>` :: nodelink ::= { `<“nodelinks/”>` + sha256(`<moment>` + `<author>` + `<first>` + `<second>`) }


#### Protocol Buffer file:

``` proto
syntax = "proto3";

message nodelink {
    required string register = 1;
    required string author = 2;
    required string ancestor = 3;
    required string first = 4;
    required string second = 5;
    required string tag = 6;
}
```


#### Nodelink maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} first           |(required)|
|{string} second          |(required)|
|{string} author          |(required)|
|{string} ancestor        |(optional)|
|{string} format          |(optional)|


---
Summoning `makeNodelink(first, second, author, ancestor, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Nodelink creation
var nodelink_buff = pathchain.makeNodelink(node_buff);

console.log("Nodelink buffer: ", nodelink_buff);
```

Console: 
``` bash
Nodelink buffer:  e0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Nodelink getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xnodelink       |(required)|
|{string} xauthor         |(optional)|


---
Summoning `getNodlinkeObj(xnodelink)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Nodelink creation
var nodelink_buff = pathchain.makeNodelink(node_buff, "ec59b50c235b66b4e5d78311a1c3313c9ac43a57d763fb530d5e6c67a64d0ee7");

// Getting node obj
var nodelink_obj = pathchain.getNodeObj(nodelink_buff);

console.log("Nodelink buffer: ", nodelink_buff);
console.log("Nodelink object: ", nodelink_obj);
```

Console: 
``` bash
Nodelink buffer:  2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5
Nodelink object:  {
  register: 'moments/61f89718cfe72b5aab21cef45d3c01c807e760939e437b48357403e2971c3cd8',
  author: 'etities/ad7f31ed77042ed1681119a65b00bbd909b72ecdfb8db5c5f8af596c5a8518bc',
  ancestor: 'nodelinks/2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5',
  first: 'nodes/1baf64c528e787ade5f6b98d7cb0c2c8c0e295ac0ff5ee3939653cddea6ab58f',
  second: 'nodes/ec59b50c235b66b4e5d78311a1c3313c9ac43a57d763fb530d5e6c67a64d0ee7',
  tag: 'nodelinks/2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5'
}
```


## Path

Paths are the skeleton of the data trees built on pathchain. They are a linear way to connect data.

`<path>` :: path ::= { `<“paths/”>` + sha256(`<moment>` + `<author>` + `<head>`) }

#### Protocol Buffer file:

``` proto
syntax = "proto3";

message path {
    required string register = 1;
    required string author = 2;
    required string text = 3;
    required string head = 4;
    required string ancestor = 5;
    optional string chain = 6;
    required string tag = 7;
}
```


#### Path maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xauthor         |(required)|
|{string} text            |(required)|
|{string} head            |(required)|
|{string} format          |(optional)|


---
Summoning `makePath(secret, text, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Path creation
var path_buff = pathchain.makePath(author, text, head);

console.log("Path buffer: ", path_buff);
```

Console: 
``` bash
Path buffer:  a0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Path getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xpath           |(required)|
|{string} xauthor         |(optional)|


---
Summoning `getPathObj(xpath)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Path creation
var path_buff = pathchain.makePath(secret);

// Getting path obj
var path_obj = pathchain.getPathObj(path_buff);

console.log("Path buffer: ", path_buff);
console.log("Path object: ", path_obj);
```

Console: 
``` bash
Path buffer:  426cc58ad2576d48429e2bc32a58b39572fba3e8a1465ae9ecb7826a105d5b31
Path object:  {
  register: 'moments/0fede6ab5d5078f7cb535cfdf50f7339c02e343fd9793bd7d68bd544e984ab5b',
  author: 'ad7f31ed77042ed1681119a65b00bbd909b72ecdfb8db5c5f8af596c5a8518bc',
  text: 'pathlink',
  head: 'nodelinks/1d3fbcff97b1b995eb83b6c70b23ea95b385add1b9bcef5d5adcd7db21591aac',
  ancestor: 'paths/426cc58ad2576d48429e2bc32a58b39572fba3e8a1465ae9ecb7826a105d5b31',
  chain: '',
  tag: 'paths/426cc58ad2576d48429e2bc32a58b39572fba3e8a1465ae9ecb7826a105d5b31'
}
```


#### Pathlink maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} first           |(required)|
|{string} second          |(required)|
|{string} author          |(required)|
|{string} ancestor        |(optional)|
|{string} format          |(optional)|


---
Summoning `makePathlink(first, second, author, ancestor, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Pathlink creation
var pathlink_buff = pathchain.makePathlink(node_buff);

console.log("Pathlink buffer: ", pathlink_buff);
```

Console: 
``` bash
Pathlink buffer:  e0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Pathlink getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xpathlink       |(required)|
|{string} xauthor         |(optional)|


---
Summoning `getNodlinkeObj(xpathlink)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Pathlink creation
var pathlink_buff = pathchain.makePathlink(path_buff, "ec59b50c235b66b4e5d78311a1c3313c9ac43a57d763fb530d5e6c67a64d0ee7");

// Getting node obj
var pathlink_obj = pathchain.getNodeObj(pathlink_buff);

console.log("Pathlink buffer: ", pathlink_buff);
console.log("Pathlink object: ", pathlink_obj);
```

Console: 
``` bash
Pathlink buffer:  2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5
Pathlink object:  {
  register: 'moments/61f89718cfe72b5aab21cef45d3c01c807e760939e437b48357403e2971c3cd8',
  author: 'etities/ad7f31ed77042ed1681119a65b00bbd909b72ecdfb8db5c5f8af596c5a8518bc',
  ancestor: 'pathlinks/2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5',
  first: 'nodes/1baf64c528e787ade5f6b98d7cb0c2c8c0e295ac0ff5ee3939653cddea6ab58f',
  second: 'nodes/ec59b50c235b66b4e5d78311a1c3313c9ac43a57d763fb530d5e6c67a64d0ee7',
  tag: 'pathlinks/2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5'
}
```


## Tree

Trees are the biggest data representation elements of the pathchain. They are ordered representations of the aglomeration of paths.

`<tree>` :: tree ::= { `<“trees/”>` + sha256(`<moment>` + `<author>` + `<head>`) }

#### Protocol Buffer file:

``` proto
syntax = "proto3";

message tree {
    required string register = 1;
    required string author = 2;
    required string text = 3;
    required string head = 4;
    required string ancestor = 5;
    optional string chain = 6;
    required string tag = 7;
}

```


#### Tree maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xauthor         |(required)|
|{string} text            |(required)|
|{string} head            |(required)|
|{string} format          |(optional)|


---
Summoning `makeTree(secret, text, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Tree creation
var tree_buff = pathchain.makeTree("tree", "1d3fbcff97b1b995eb83b6c70b23ea95b385add1b9bcef5d5adcd7db21591aac");


console.log("Tree buffer: ", tree_buff);
```

Console: 
``` bash
Tree buffer:  a0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Tree getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xtree           |(required)|
|{string} xauthor         |(optional)|


---
Summoning `getTreeObj(xtree)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Tree creation
var tree_buff = pathchain.makeTree("tree", "1d3fbcff97b1b995eb83b6c70b23ea95b385add1b9bcef5d5adcd7db21591aac");

// Getting tree obj
var tree_obj = pathchain.getTreeObj(tree_buff);

console.log("Tree buffer: ", tree_buff);
console.log("Tree object: ", tree_obj);
```

Console: 
``` bash
Tree buffer:  8d9abf006f5ba6dc1b415baf6d9e37b5d18d6b43451e01d9fa27b10b393a8d89
Tree object:  {
  register: 'moments/8a6601db7ae0f1dc69b7d5e63c510bbae44d0d58ea2683e289a4a23f0ca2a08c',
  author: 'ad7f31ed77042ed1681119a65b00bbd909b72ecdfb8db5c5f8af596c5a8518bc',
  text: 'tree',
  head: 'nodelinks/1d3fbcff97b1b995eb83b6c70b23ea95b385add1b9bcef5d5adcd7db21591aac',
  ancestor: 'trees/8d9abf006f5ba6dc1b415baf6d9e37b5d18d6b43451e01d9fa27b10b393a8d89',
  chain: '',
  tag: 'trees/8d9abf006f5ba6dc1b415baf6d9e37b5d18d6b43451e01d9fa27b10b393a8d89'
}
```


#### Treelink maker

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} first           |(required)|
|{string} second          |(required)|
|{string} author          |(required)|
|{string} ancestor        |(optional)|
|{string} format          |(optional)|


---
Summoning `makeTreelink(first, second, author, ancestor, format)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Treelink creation
var treelink_buff = pathchain.makeTreelink(node_buff);

console.log("Treelink buffer: ", treelink_buff);
```

Console: 
``` bash
Treelink buffer:  e0f9d300e1b28253455e1835f13ca18d000333152a6a9a9b106d0407612980a8
```


#### Treelink getter

Parameter rules:
|Parameter                |Required  |
|-------------------------|----------|
|{string} xtreelink       |(required)|
|{string} xauthor         |(optional)|


---
Summoning `getNodlinkeObj(xtreelink)`:
```javascript
const pathchain = require("pathchain"); // Summoning pathchain

// Treelink creation
var treelink_buff = pathchain.makeTreelink(path_buff, "ec59b50c235b66b4e5d78311a1c3313c9ac43a57d763fb530d5e6c67a64d0ee7");

// Getting node obj
var treelink_obj = pathchain.getNodeObj(treelink_buff);

console.log("Treelink buffer: ", treelink_buff);
console.log("Treelink object: ", treelink_obj);
```

Console: 
``` bash
Treelink buffer:  2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5
Treelink object:  {
  register: 'moments/61f89718cfe72b5aab21cef45d3c01c807e760939e437b48357403e2971c3cd8',
  author: 'etities/ad7f31ed77042ed1681119a65b00bbd909b72ecdfb8db5c5f8af596c5a8518bc',
  ancestor: 'treelinks/2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5',
  first: 'nodes/1baf64c528e787ade5f6b98d7cb0c2c8c0e295ac0ff5ee3939653cddea6ab58f',
  second: 'nodes/ec59b50c235b66b4e5d78311a1c3313c9ac43a57d763fb530d5e6c67a64d0ee7',
  tag: 'treelinks/2aea1c448756e1b8e7163483d8d8ce17798c0d272adfaeed6907c5f87432e0a5'
}
```
