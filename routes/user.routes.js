const { Router } = require("express");

const router = Router();

const {
  get,
  getOne,
  add,
  update,
  deleteOne,
  logOutUser,
} = require("../controllers/user.controller");

const userPolice = require("../middleware/userPolice");
const userRolesPolice = require("../middleware/userRolesPolice");

router.get("/", get);

router.get("/:id", getOne); //userPolice,

router.post("/", add);

router.put("/:id", update);

router.delete("/:id", deleteOne);

router.post("/logout", logOutUser);

module.exports = router;
