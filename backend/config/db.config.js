const db = require("../app/models");
//connect dalam database
db.mongoose
  .connect(db.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("cant connect database:", err);
    process.exit(); //hentikan programm
  });
module.exports = db;
