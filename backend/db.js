import mongoose from "mongoose";

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

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
