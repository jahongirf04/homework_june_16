const { Router } = require("express");

const router = Router();

const {
  get,
  getOne,
  add,
  update,
  deleteOne,
} = require("../controllers/order.controller");

router.get("/", get);

router.get("/:id", getOne);

router.post("/", add);

router.put("/:id", update);

router.delete("/:id", deleteOne);

module.exports = router;
