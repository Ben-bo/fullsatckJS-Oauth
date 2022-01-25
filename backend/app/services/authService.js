const model = require("../models");
const userModel = model.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const client = new OAuth2Client(
  process.env.CLIENT_ID //client ID dari project mern-login bagian credential
);
const authService = {
  findByUsername: async (email) => {
    return await userModel.findOne({ email: email }).exec();
  },

  createService: async (userDetails) => {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hashedPassword = await bcrypt.hashSync(userDetails.password, salt); //ecnrypt password
      const isUserExist = await authService.findByUsername(userDetails.email); //cek data user
      let error = null;
      let result = {};

      if (!isUserExist) {
        const data = {
          email: userDetails.email,
          nama: userDetails.nama,
          password: hashedPassword,
        };
        const postData = new userModel(data);
        const saveData = await postData.save();
        result = saveData;
      } else {
        error = "user Alredy exist";
      }

      return {
        data: result,
        error,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  loginService: async (userDetails) => {
    try {
      let error = null;
      let result = {};
      const isUserExist = await authService.findByUsername(
        userDetails.username
      );

      if (!isUserExist) {
        error = "email not registered";
        return {
          data: {},
          error,
        };
      }
      const isSamePassword = await bcrypt.compareSync(
        userDetails.password,
        isUserExist.dataValues.password
      );
      if (!isSamePassword) {
        error = "incorrect password";
        return {
          data: {},
          error,
        };
      }
      result = await jwt.sign(isUserExist.dataValues, "secret_key"); //buat token(identitas) dari data user(database)
      return {
        data: result,
        error,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  loginGoogleService: async (dataBody) => {
    try {
      let error = null;
      let result = {};
      let user = null;

      const { tokenId } = dataBody; //tokenId dari google login

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.CLIENT_ID, //client ID from console.google
      });
      //ambill email name dan email verif dari token yang di kirim oleh front end
      const { email_verified, name, email } = verify.payload;
      if (email_verified) {
        const cekUser = await userModel.findOne({ email }).exec(); //cek email di dalam db
        if (cekUser) {
          const token = jwt.sign({ id: cekUser._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
          });
          const { _id, nama, email } = cekUser;
          result = token;
          user = {
            id: _id,
            nama,
            email,
          };
        } else {
          const saltRounds = 10;
          const salt = await bcrypt.genSaltSync(saltRounds);
          const password = email + process.env.SECRET_KEY;
          const hashedPassword = await bcrypt.hashSync(password, salt); //ecnrypt password
          const data = {
            email,
            nama: name,
            password: hashedPassword,
          };
          const postData = new userModel(data);
          const saveData = await postData.save();
          if (saveData) {
            const token = jwt.sign(
              { id: saveData._id },
              process.env.SECRET_KEY,
              {
                expiresIn: "7d",
              }
            );

            result = token;
            user = {
              id: saveData._id,
              nama: saveData.nama,
              email: saveData.email,
            };
          }
        }
      }

      return {
        data: result,
        user,
        error,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  loginFacebookService: async (dataBody) => {
    try {
      let error = null;
      let result = {};
      let user = null;
      const { accessToken, userID } = dataBody;
      let urlGraphFacebook = `https://graph.facebook.com/v12.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
      const response = await fetch(urlGraphFacebook, {
        method: "GET",
      });
      const data = await response.json();
      const { email, name } = data;
      const cekUser = await userModel.findOne({ email }).exec();
      if (cekUser) {
        const token = jwt.sign({ id: cekUser._id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        const { _id, nama, email } = cekUser;
        result = token;
        user = {
          id: _id,
          nama,
          email,
        };
      } else {
        const saltRounds = 10;
        const salt = await bcrypt.genSaltSync(saltRounds);
        const password = email + process.env.SECRET_KEY;
        const hashedPassword = await bcrypt.hashSync(password, salt); //ecnrypt password
        const data = {
          email,
          nama: name,
          password: hashedPassword,
        };
        const postData = new userModel(data);
        const saveData = await postData.save();
        if (saveData) {
          const token = jwt.sign({ id: saveData._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
          });

          result = token;
          user = {
            id: saveData._id,
            nama: saveData.nama,
            email: saveData.email,
          };
        }
      }
      console.log(data);
      return {
        data: result,
        user,
        error,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
module.exports = authService;
