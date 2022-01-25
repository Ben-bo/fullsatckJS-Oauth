const authService = require("../services/authService");

const authController = {
  register: async (req, res) => {
    try {
      let status = 200;
      let message = "OK";
      let data = {};
      console.log(req.body);
      const { data: userCreated, error } = await authService.createService(
        req.body
      );
      if (error !== null) {
        (status = 500), (message = error);
      }
      res.send({
        status,
        message,
        data: userCreated || data,
      });
    } catch (error) {
      console.log(error);
      res.send({ status: 500, message: "failed", data: error });
    }
  },
  googleLogin: async (req, res) => {
    try {
      let status = 200;
      let message = "OK";
      let data = {};
      const {
        data: token,
        user,
        error,
      } = await authService.loginGoogleService(req.body);
      if (error !== null) {
        (status = 500), (message = error);
      }
      res.json({
        status,
        message,
        data: user,
        Token: token || data,
      });
    } catch (error) {
      console.log(error);
    }
  },
  facebookLogin: async (req, res) => {
    try {
      let status = 200;
      let message = "OK";
      let data = {};
      const {
        data: token,
        user,
        error,
      } = await authService.loginFacebookService(req.body);
      if (error !== null) {
        (status = 500), (message = error);
      }
      res.json({
        status,
        message,
        data: user,
        Token: token || data,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = authController;
