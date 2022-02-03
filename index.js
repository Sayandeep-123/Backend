const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
const hostname = "0.0.0.0";
const { mongoUrl } = require("./keys");
require("./models/User");
require("./models/Events");
const authRoutes = require("./Routes/authRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const requireToken = require("./middlewares/requireToken");
app.use(bodyParser.json());
app.use(authRoutes);
app.use(eventRoutes);

mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("connected to mongo !");
});

mongoose.connection.on("error", (error) => {
  console.log("This is error: ", error);
});

app.post("/", requireToken, (req, res) => {
  const data = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    trip: req.user.trip,
  };
  res.send({ data });
});

app.listen(PORT, () => {
  console.log(`server running at http://${hostname}${PORT}`);
});
