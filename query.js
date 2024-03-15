const uuid = require("uuid");
const uuidV1 = uuid.v1;
const crypto = require("crypto");
const accessKey = require('./access-key.json')

// Details from access_key.json generated from decentralization interface
const key = accessKey.key;
const publicKey = accessKey.publicKey;
const name = accessKey.name;

// API url for the decentralized network
const host = "https://api-testnet.bitscrunch.com";

// Request path
const path =
"/api/v1/market/metrics?currency=usd&blockchain=1&metrics=holders&metrics=marketcap&time_range=24h&include_washtrade=true";
const body = "";

// create uuid1 based request id
const buffer = Buffer.alloc(16);
uuidV1({}, buffer);
const r_id = buffer.toString("hex");
const message = r_id + ":GET:" + path + ":" + body + ":";

// sign the message with the provided key
const getSignedHeaders = (key, message) => {
    const cKey = crypto?.createPrivateKey({
        key: `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`,
        format: "pem",
        cipher: "fips-186-3",
    });
    const data = Buffer.from(`${message}`);
    const sign = crypto.sign("SHA256", data, cKey);
    const signature = sign.toString("base64");
    return signature;
};
const signature = getSignedHeaders(key, message);

// build required headers
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        rid: r_id,
        sign: signature,
        name: name,
        pubkey: publicKey,
        message: message,
    },
};

// query the network with necessary headers
fetch(`${host}/${path}`, options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));