const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

app.use(cors());
app.use(bodyParser.json());

app.post("/addServices", (req, res) => {
    const services = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect((error) => {
      const collection = client.db("doctorsPortal").collection("services");
      collection.insert(services, (err, result) => {
        if (err) {
          console.log(err);
          console.log(error)
          res.status(500).send({ message: err });
        } else {
          res.send(result.ops[0]);
        }
      });
      client.close();
    });
});


app.post("/bookAppointment", (req, res) => {
  const appointmentDetails = req.body;
  appointmentDetails.bookingDate = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.insertOne(appointmentDetails, (err, result) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});


app.put("/dailyAppointment/updateVisit", (req, res) => {
  const id = req.body.id
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.updateOne({_id:ObjectId(id)}, {$set: {visited:true}}, (err, result) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } 
    });
    client.close();
  });
});


app.get("/dailyAppointment/:appointmentDate", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.find(req.params).toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});


app.get("/services", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorsPortal").collection("services");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

app.get("/", (req, res) => {
    res.send("<h1>Doctors Portal Server</h1>");
});
  
const port = process.env.PORT || 4200;
  
app.listen(port, () => {
    console.log("Listening at port 4200");
});