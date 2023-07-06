const { errorHandler } = require("../helpers/error_handler");
const { idChecking } = require("../helpers/idChecker");
const Mongo = require("../models/order");

const add = async (req, res) => {
  try {
    //Add
    const { user_id, product_id, total_amount } = req.body;
    if (user_id == "" || product_id == "" || total_amount == "") {
      return res.status(400).send({ message: "Ma'lumotlarni to'liq yuboring" });
    }
    const neww = await Mongo({
      user_id,
      product_id,
      total_amount,
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
      { $set: { user_id: neww } }
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

const search = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Mongo.find({ user_id: id })
      .populate(user_id)
      .populate({
        path: product_id,
        populate: category_id,
      });
    res.status(200).send({
      message: result,
    });
  } catch (e) {
    const message = e.message;
    console.log(e.message);
    res.status(404).send({
      message: message,
    });
  }
};

const calculateTotalAmount = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Mongo.find({ user_id: id });
    var totalAmount = 0;
    data.forEach((amount) => {
      totalAmount = totalAmount + amount.total_amount;
    });
    res.status(200).send({ result: totalAmount });
  } catch (e) {
    const message = e.message;
    console.log(message);
    res.status(400).send({
      message,
    });
  }
};

const highestTotalAmount = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Mongo.find({ user_id: id });
    var amounts = new Array();
    data.forEach((amount) => {
      amounts.push(amount.total_amount);
    });
    res.status(200).send({ result: Math.max(...amounts) });
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
};
