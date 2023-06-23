const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const telephoneCheck = (str) => {
  const MATCHES = {
    0: /^\d{3}-\d{3}-\d{3}/,
    1: /^1*\s*\(\d{3}\)\s*\d{3}-\d{4}/,
    2: /^\(\d{3}\)\s\d{3}-\d{4}/,
    3: /\d{3}\s\d{3}\s\d{4}/,
    4: /^\d{10}$/,
    5: /^1\s*\d{3}-\d{3}-\d{4}$/,
  };

  for (const regex in MATCHES) {
    if (MATCHES[regex].test(str)) {
      return true;
    }
  }
  return false;
};

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL)
  .then((result) => console.log("connected to mongoDB"))
  .catch((error) => console.log("error:", error.message));

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return telephoneCheck(v);
      },
      message: (props) => `\n${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = model("Person", personSchema);
