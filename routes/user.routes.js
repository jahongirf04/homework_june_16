const { Router } = require("express");

const router = Router();

const {
  get,
  getOne,
  add,
  update,
  deleteOne,
  logOutUser,
  refreshingToken,
} = require("../controllers/user.controller");

const userPolice = require("../middleware/userPolice");
const userRolesPolice = require("../middleware/userRolesPolice");

const Validator = require("../middleware/validator");

router.get("/", get);

router.get("/:id", userPolice, getOne); //

router.post("/", add);

router.put("/:id", update);

router.delete("/:id", deleteOne);

router.post("/logout", Validator("user"), logOutUser);

router.post("/refresh", refreshingToken);

module.exports = router;
