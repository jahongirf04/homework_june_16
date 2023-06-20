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
} = require("../controllers/category.controller");

router.get("/", get);

router.get("/:id", getOne);

router.post("/", Validator("category"), add);

router.put("/:id", update);

router.delete("/:id", deleteOne);

router.post("/login/:id", Validator("category"), logIn);

router.post("/logout", LogOut);

router.post("/refresh", refreshingToken);

module.exports = router;
