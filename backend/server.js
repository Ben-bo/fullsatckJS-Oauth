const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const PORT = process.env.PORT;
//connect dalam database
require("./config/db.config");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./app/routes/user.route")(app);
app.use("/", (req, res) => {
  res.send({
    status: 500,
    Message: "url not found",
  });
});

app.listen(PORT, () => {
  console.log(`server run on PORT ${PORT}`);
});
