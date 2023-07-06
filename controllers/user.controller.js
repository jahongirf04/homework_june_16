const { errorHandler } = require("../helpers/error_handler");
const { idChecking } = require("../helpers/idChecker");
const Mongo = require("../models/user");

const config = require("config");

const myJwt = require("../services/jwt-service");

const uuid = require("uuid");
const mailService = require("../services/mail-service");

// const generateAccessToken = (id, name, email) => {
//   const payload = {
//     id,
//     name,
//     email,
//   };
//   return jwt.sign(payload, config.get("secret"), { expiresIn: "1h" });
// };

const add = async (req, res) => {
  try {
    //Add
    const { name, email, password } = req.body;

    const user_activation_link = uuid.v4();
    const neww = await Mongo({
      name,
      email,
      password,
      user_activation_link,
    });
    await neww.save();

    await mailService.sendActivationMail(
      email,
      `${config.get("api_url")}/api/users/activate/${user_activation_link}`
    );

    const payload = {
      id: neww._id,
      name: neww.name,
      email: neww.email,
      user_is_active: neww.user_is_active,
    };
    const tokens = myJwt.generateTokens(payload);
    neww.user_token = tokens.refreshToken;
    await neww.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    // try {
    //   setTimeout(function () {
    //     var err = new Error("Hello");
    //     throw err;
    //   }, 1000);
    // } catch (e) {
    //   console.log(e.message);
    //   res.status(404).send({ message: e.message });
    // }
    res.status(200).send({ ...tokens, user: payload });
  } catch (error) {
    errorHandler(res, error);
  }
};

const get = async (req, res) => {
  try {
    // Get

    const argums = await Mongo.find();
    if (!argums) {
      return res.status(400).send({ message: "Hech narsa topilmadi" });
    }
    res.json({ argums });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getOne = async (req, res) => {
  try {
    // GetOne
    const myId = req.params.id;
    if (idChecking(myId)) {
      res.status(400).send({ message: "Incorrect ID" });
    }
    const argum = await Mongo.findOne({ _id: `${myId}` });
    if (!argum) {
      return res.status(400).send({ message: "Topilmadi" });
    }
    const payload = {
      id: argum._id,
      name: argum.name,
      email: argum.email,
    };
    const tokens = myJwt.generateTokens(payload);
    // const token = generateAccessToken(argum._id, argum.name, argum.email);

    argum.user_token = tokens.refreshToken;
    await argum.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.json({ argum, ...tokens });
  } catch (error) {
    errorHandler(res, error);
  }
};

const update = async (req, res) => {
  if (idChecking(myId)) {
    res.status(400).send({ message: "Incorrect ID" });
  }
  try {
    const myId = req.params.id;
    const { neww } = req.body;
    const result = await Mongo.updateOne(
      { _id: myId },
      { $set: { name: neww } }
    );
    return res.status(200).send({ message: "O'zgartirildi", result });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteOne = async (req, res) => {
  if (idChecking(myId)) {
    res.status(400).send({ message: "Incorrect ID" });
  }
  try {
    const myId = req.params.id;
    if (myId !== req.user.id) {
      return res.status(401).send({ message: "Sizda bunday huquq yo'q" });
    }

    await Mongo.deleteOne({ _id: myId });
    return res.status(200).send({ message: "O'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logOutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    let argum;
    if (!refreshToken)
      return res.status(400).send({ message: "Token topilmadi" });
    argum = await Mongo.findOneAndUpdate(
      { user_token: refreshToken },
      { user_token: "" },
      { new: true }
    );
    if (!argum) return res.status(400).send({ message: "Token topilmadi" });

    return res
      .clearCookie("refreshToken")
      .send({ message: "Muvafaqiyatli chiqdingiz!", argum });
    // res.status(200).send({ user });
  } catch (e) {
    const message = e.message;
    console.log(e.message);
    res.send({ message: message });
  }
};

const refreshingToken = async (req, res) => {
  const { refreshToken } = req.headers.cookie;
  if (!refreshToken)
    return res.status(400).send({ messgae: "Token topilmadi" });
  const userDataFromCookie = req.headers.cookie;
  const userDataFromDB = await Mongo.findOne({ user_token: refreshToken });
  if (!userDataFromCookie || !userDataFromDB) {
    return res.status(400).send({ message: "User ro'yhatdan o'tmagan" });
  }
  const user = await Mongo.findById(userDataFromCookie.id);
  if (!user) return res.status(400).send({ message: "ID noto'g'ri" });

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  const tokens = myJwt.generateTokens(payload);
  user.user_token = tokens.refreshToken;
  await user.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.status(200).send({ ...tokens });
};

const activate = async (req, res) => {
  try {
    const argum = await Mongo.findOne({
      user_activation_link: req.params.link,
    });
    if (!argum) {
      return res.status(400).send({
        message: "Bundayi topilmad",
      });
    }

    if (argum.user_is_active) {
      return res.status(400).send({ message: "Allaqachon" });
    }

    argum.user_is_active = true;
    await argum.save();
    res.status(200).send({
      user_is_active: argum.user_is_active,
      message: "Activated",
    });
  } catch (e) {
    const message = e.message;
    console.log(message);
    res.status(404).send({ message: message });
  }
};

module.exports = {
  add,
  get,
  getOne,
  update,
  deleteOne,
  logOutUser,
  refreshingToken,
  activate,
};
