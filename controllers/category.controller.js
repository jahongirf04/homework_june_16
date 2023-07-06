const { response } = require("express");
const { errorHandler } = require("../helpers/error_handler");
const { idChecking } = require("../helpers/idChecker");
const Mongo = require("../models/category");
const { default: mongoose } = require("mongoose");

const mongoProducts = require("../models/products");

const myJwt = require("../services/jwt-service");

const config = require("config");

const add = async (req, res) => {
  try {
    //Add
    const { name } = req.body;
    if (name == "") {
      return res.status(400).send({ message: "Ma'lumotlarni to'liq yuboring" });
    }
    const neww = await Mongo({
      name,
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
      { $set: { first_name: neww } }
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

const refreshingToken = async (req, res) => {
  const refreshToken = req.headers.cookie.split("=")[1];
  if (!refreshToken)
    return res.status(400).send({ messgae: "Token topilmadi" });
  const DataFromCookie = await Mongo.findOne({
    token: req.headers.cookie.split("=")[1],
  });
  const DataFromDB = await Mongo.findOne({ token: refreshToken });
  if (!DataFromCookie || !DataFromDB) {
    return res.status(400).send({ message: "User ro'yhatdan o'tmagan" });
  }
  const argum = await Mongo.findById(DataFromCookie.id);
  if (!argum) return res.status(400).send({ message: "ID noto'g'ri" });

  const payload = {
    id: argum._id,
    name: argum.name,
  };
  const tokens = myJwt.generateTokens(payload);
  argum.token = tokens.refreshToken;
  await argum.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
  });
  res.status(200).send({ ...tokens });
};

const hihgestLowestEachCategory = async (req, res) => {
  try {
    const data1 = await Mongo.find();
    const category_prices = new Array();
    data1.forEach(async (element) => {
      const product = await mongoProducts.find({ category_id: element._id });
      const element_name = element.name;
      const prices = new Array();
      product.forEach((elem) => {
        prices.push(elem.price);
      });
      category_prices.push({
        element_name: element_name,
        prices: prices,
      });
      const result = new Array();
      category_prices.forEach((element) => {
        result.push({
          element_name: element.element_name,
          highest_price: Math.max(...element.prices),
          lowest_price: Math.min(...element.prices),
        });
      });
      res.status(200).send({ result });
    });
  } catch (e) {
    const message = e.message;
    console.log(message);
    res.status(400).send({
      message,
    });
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
  refreshingToken,
};
