module.exports = (app) => {
  const route = require("express").Router();
  const auth = require("../controllers/authController");
  route.post("/register", auth.register);
  route.post("/google-login", auth.googleLogin);
  route.post("/facebook-login", auth.facebookLogin);

  app.use("/api", route);
};
