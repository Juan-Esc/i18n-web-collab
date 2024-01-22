import mongoose from "mongoose";
import { mongodb_uri } from 'config.json'
console.log("dockeR? " + process.env.DOCKERIZED)

let connectionString = (process.env.DOCKERIZED === 'true') ? 'mongodb://mongodb:27017/i18nweb' : (mongodb_uri || 'mongodb://127.0.0.1:27017/i18nweb');

if (connectionString.indexOf("appName") === -1) connectionString += connectionString.indexOf("?") > -1 ? "&appName=remix|" : "?appName=remix|";
else connectionString = connectionString.replace(/appName\=([a-z0-9]*)/i, (m,p) => `appName=remix|${p}`);

let db;

async function connect() {
  if (db) return db;
  mongoose.connection.on('connected', () => console.log({mongoDB: 'Connected'}))
  mongoose.connection.on('error', () => console.log({mongoDB: 'Error'}))

  if (process.env.NODE_ENV === "production") {
    db = await mongoose.connect(connectionString)
  } else {
    // in development, need to store the db connection in a global variable
    // this is because the dev server purges the require cache on every request
    // and will cause multiple connections to be made
    if (!global.__db) {
      global.__db = await mongoose.connect(connectionString)
    }
    db = global.__db;
  }
  return db;
}

export { connect };
