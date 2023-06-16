import mongoose from 'mongoose';

let db: typeof mongoose;

export async function testDbConnect() {
  db = await mongoose.connect(
    // @ts-ignore
    global.__MONGO_URI__ + global.__MONGO_DB_NAME__
  );

  return db;
}

export async function testDbCloseConnection() {
  await db.connection.close();
}
