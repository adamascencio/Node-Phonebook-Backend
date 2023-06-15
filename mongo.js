const mongoose = require("mongoose");
const { Schema } = mongoose;

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://fullstack:${password}@cluster0.uu27v2o.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new Schema({
  name: String,
  number: String,
  id: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
