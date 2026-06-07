import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saruul3339_db_user:saruul1006@cluvr.fi7ib8o.mongodb.net/?appName=Cluvr"
    );

    console.log("Successfully connected");
  } catch (e) {
    console.log("ee bolsongui " + e);
  }
};

export default dbConnect;