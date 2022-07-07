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
  //return all vehicles
  Vehicle.find({}).exec((err, vehicles) => {
    if (err) return res.status(500).send(err);
    res.json(vehicles);
  });
});

//add db entry with a new vehicle object
app.post("/api/v1/garage/", (req, res, next) => {
  console.log("POST/garage: ", req.body);
  const newVehicle = new Vehicle(req.body);
  //save vehicle posted as newVehicle into db
  newVehicle.save((err, vehicles) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(vehicles);
  });
});

//post update to a vehicle by db id
app.put("/api/v1/garage/:id", (req, res, next) => {
  console.log("PUT/garage by ID: ", req.params.id);
  const vehicleId = req.params.id;
  const update = req.body;
  Vehicle.updateOne({ _id: vehicleId }, update, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

//delete vehicle by db id
app.delete("/api/v1/garage/:id?", (req, res, next) => {
  console.log("DELETE/garage by ID: ", req.query.id);
  const idToDelete = req.query.id;
  Vehicle.remove({ _id: idToDelete }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});
