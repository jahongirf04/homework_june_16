const { Router } = require("express");

const router = Router();

const {
  get,
  getOne,
  add,
  update,
  deleteOne,
  logIn,
  LogOut,
} = require("../controllers/category.controller");

router.get("/", get);

router.get("/:id", getOne);

router.post("/", add);

router.put("/:id", update);

router.delete("/:id", deleteOne);

router.post("/login/:id", logIn);

router.post("/logout", LogOut);

module.exports = router;
