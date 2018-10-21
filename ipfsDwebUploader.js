#!/usr/bin/env node

// DAppNode params
//////////////////
const ipfsProvider = "my.ipfs.dnp.dappnode.eth";
const ipfsGateway = "http://my.ipfs.dnp.dappnode.eth:8080";
//////////////////

const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI(ipfsProvider);

const args = process.argv.slice(2);
const path = args[0];

console.log("Uploading files...");
ipfs.util.addFromFs(path, { recursive: true }).then(response => {
  console.log("Succesfully uploaded files!");
  printTable(response);

  const dwebHash = response[response.length - 1].hash;
  console.log("\n\n\n");
  console.log(
    `To point an .eth domain to this website, use this hash as value:`
  );
  console.log("\x1b[36m%s\x1b[0m", `\n   ${dwebHash}\n`);
  console.log(`To preview you website immediately go to:`);
  console.log("\x1b[36m%s\x1b[0m", `\n   ${ipfsGateway}/ipfs/${dwebHash}\n`);
});

// Util

/**
 * 
 * @param array must be an array of objects where all the object have the same keys
 * Demo output
                               path	                                          hash	   size
-----------------------------------	----------------------------------------------	-------
  build/android-chrome-192x192.png	QmVDXMWzpcxJH7dVLy7EcJbiuwMbvW7TzpftQ9WhZJtNYo	  25613
   build/android-chrome-512x512.png	QmSPVmLSSBo9RdVTxUUGvDt3Qkb62Pu5ai3NPLrvdkKFxY	  82789
 */
function printTable(array) {
  const maxLen = {};
  array.forEach(elem => {
    Object.keys(elem).forEach(key => {
      const len = String(elem[key]).length;
      const _len = maxLen[key] || 0;
      maxLen[key] = len > _len ? len : _len;
    });
  });
  const sp = "\t";
  console.log(
    Object.keys(array[0])
      .map(key => key.padStart(maxLen[key]))
      .join(sp)
  );
  console.log(
    Object.keys(array[0])
      .map(key => "".padStart(maxLen[key], "-"))
      .join(sp)
  );
  array.forEach(elem => {
    console.log(
      Object.keys(elem)
        .map(key => String(elem[key]).padStart(maxLen[key]))
        .join(sp)
    );
  });
}
