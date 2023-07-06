const { Router } = require("express");

const router = Router();

const categoryRouter = require("./category.routes");
const userRouter = require("./user.routes");
const productsRouter = require("./products.routes");
const orderRouter = require("./order.routes");
// const viewsRouter = require("./view.routes");

router.use("/category", categoryRouter);
router.use("/users", userRouter);
router.use("/products", productsRouter);
router.use("/orders", orderRouter);
// router.use("/", viewsRouter);

module.exports = router;
