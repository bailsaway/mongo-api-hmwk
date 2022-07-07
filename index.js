import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3333;

app.use(express.json()); //parsing everything to json
app.use(express.urlencoded({ extended: true })); //parses incoming requests with urlencoded payload
app.use(express.static("public")); //display pages in public folder
app.listen(port, () => {}); //localhost:3333/{endpoint} and also where public files will be served to

const { PORT = 3333, MONGODB_URI = "mongodb://localhost:27017/garage_hmwk" } =
  process.env; //create MongoDB database

//connect to MongoDb database using mongoose.connect()
(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    mongoose.connection.on("error", (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(`Connection error`, err);
  }
})();

const { Schema } = mongoose; //create Schema class from mongoose library to help keep db docs in shape (ORM)
const garageSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  bhp: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

//all vehicles in the DB need to correspond to the declared Schema, this is a model
//Models have find() and save() methods (need to .exec() at the end)
const Vehicle = mongoose.model("vehicle", garageSchema);

//get all vehicles in db
app.get("/api/v1/garage/", (req, res, next) => {
  console.log("GET/garage");
  Vehicle.find({}).exec((err, vehicles) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(vehicles);
  });
});

//update db with a new vehicle object
app.post("/api/v1/garage/", (req, res, next) => {
  console.log("POST/garage: ", req.body);
  const newVehicle = req.body;

  res.status(200).json(req.body);
});

//post update to a vehicle by db id
app.put("/api/v1/garage/:id", (req, res, next) => {
  const vehicleId = req.params.id;
  const update = req.body;
  console.log("PUT/garage by ID: ", req.params.id);
});

//delete vehicle by db id
app.delete("/api/v1/garage/:id?", (req, res, next) => {
  const idToDelete = req.query.id;
  console.log("DELETE/garage by ID: ", req.query.id);
});
