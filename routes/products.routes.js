const { Router } = require("express");

const router = Router();

const Validator = require("../middleware/validator");

const {
  get,
  getOne,
  add,
  update,
  deleteOne,
  logIn,
  LogOut,
  refreshingToken,
} = require("../controllers/products.controller");

router.get("/", get);

router.get("/:id", getOne);

router.post("/", Validator("product"), add);

router.put("/:id", update);

router.delete("/:id", deleteOne);

router.post("/login/:id", logIn);

router.post("/logout", LogOut);

router.post("/refresh", refreshingToken);

module.exports = router;
