import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL,  {useNewUrlParser: true,   useUnifiedTopology: true,   serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


mongoose.connection.on('error', err => {
console.error('Mongoose connection error:', err);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected due to app termination");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected due to SIGTERM");
  process.exit(0);
});
