import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Db!!!");
  } catch (error) {
    console.log("Error connecting to MongoDb", error.message);
  }
};
export default dbConnection;
