import mongoose from 'mongoose';

async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // const options = {
  //   autoIndex: process.env.NODE_ENV === 'production' ? false : true, // check more about this feature
  // };

  await mongoose.connect(process.env.MONGODB_URI!);

  return mongoose;
}
// for next-auth adapter
async function getMongoClient() {
  await dbConnect();

  return mongoose.connection.getClient();
}

export { getMongoClient, dbConnect as default };
