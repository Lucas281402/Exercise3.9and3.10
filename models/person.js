const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((response) => {
    console.log("Connected with MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.path('name').validate((name) => {
  if (name.length < 3) {
    throw new Error('Path `name` `{VALUE}` is shorter than the minimun allowed length (3)')
  }
  return true
},
  'Person validation failed: Name: Path `name` `{VALUE}` is shorter than the minimun allowed length (3)')

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
