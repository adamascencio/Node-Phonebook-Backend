const mongoose = require("mongoose");
const { Schema, model } = mongoose;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL)
  .then((result) => console.log("connected to mongoDB"))
  .catch((error) => console.log("error:", error.message));

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = model("Person", personSchema);
