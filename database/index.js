import mongoose from "mongoose";

const DB_NAME = "awsupload";

const ConnectToDatabase = async () => {

  console.log('form the database',process.env.MONGO_URI)
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDb connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export default ConnectToDatabase;
