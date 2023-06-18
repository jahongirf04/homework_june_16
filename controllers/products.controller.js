const { idChecking } = require("../helpers/idChecker");
const Mongo = require("../models/products");

const myJwt = require("../services/jwt-service");

const { errorHandler } = require("../helpers/error_handler");

const config = require("config");

const add = async (req, res) => {
  try {
    //Add
    const { name, price, category_id } = req.body;
    if (name == "" || price == "" || category_id == "") {
      return res.status(400).send({ message: "Ma'lumotlarni to'liq yuboring" });
    }
    const neww = await Mongo({
      name,
      price,
      category_id,
    });
    await neww.save();
    res.status(200).send({ message: "Qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const get = async (req, res) => {
  try {
    // Get

    const argums = await Mongo.find();
    if (!argums) {
      return res.status(400).send({ message: "Hech narsa opilmadi" });
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
    res.json({ argum });
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
    await Mongo.deleteOne({ _id: myId });
    return res.status(200).send({ message: "O'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logIn = async (req, res) => {
  try {
    // Log In
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
      price: argum.price,
    };
    const tokens = myJwt.generateTokens(payload);
    // const token = generateAccessToken(argum._id, argum.name, argum.email);

    argum.token = tokens.refreshToken;
    await argum.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.json({ message: "Xush kelibsiz", argum, ...tokens });
  } catch (error) {
    console.log(error.message);
  }
};

const LogOut = async (req, res) => {
  try {
    const refreshToken = req.headers.cookie.split("=")[1];
    let argum;
    if (!refreshToken)
      return res.status(400).send({ message: "Token topilmadi 1" });
    argum = await Mongo.findOneAndUpdate(
      { token: refreshToken },
      { token: "" },
      { new: true }
    );
    if (!argum) return res.status(400).send({ message: "Token topilmadi" });

    res.clearCookie("refreshToken");

    res.send({ message: "Muvafaqiyatli chiqdingiz!", argum });
  } catch (e) {
    const message = e.message;
    console.log(e.message);
    res.send({ message: message });
  }
};

module.exports = {
  add,
  get,
  getOne,
  update,
  deleteOne,
  logIn,
  LogOut,
};
