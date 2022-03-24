const port = 8000;

const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();
app.use(cors());

app.listen(port, () => console.log("server running on", port));
