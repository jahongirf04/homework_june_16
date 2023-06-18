const { Router } = require("express");

const router = Router();

const categoryRouter = require("./category.routes");
const userRouter = require("./user.routes");
const productsRouter = require("./products.routes");
const orderRouter = require("./order.routes");

router.use("/category", categoryRouter);
router.use("/users", userRouter);
router.use("/products", productsRouter);
router.use("/orders", orderRouter);

module.exports = router;
