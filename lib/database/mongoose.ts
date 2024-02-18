import mongoose, { Mongoose } from "mongoose";

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const MONGODB_URL = process.env.MONGODB_URL;

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  //If we have a cached connection then we will return it for optimization purposes
  if (cached.conn) {
    return cached.conn;
  }

  //If we dont have a mongodb url then we throw an error Missing MongoDB url

  if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL");
  }

  // In case we don't have a cached connection then we will create a new connection
  // If we have already a cached promise then we will used otherwise we will create a new connection

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "Bild",
      /**
       *configures how long Mongoose will allow an operation to stay buffered before throwing an error.
       */
      bufferCommands: false,
    });

  // The cached connection will execute the cached promise
  cached.conn = await cached.promise;

  // Finally we will return the cached connection
  return cached.conn;
};
