const { Router } = require("express");

const { createViewpath } = require("../helpers/create_view_path");

const router = Router();

router.get("/", (req, res) => {
  res.render(createViewpath("index"), {
    title: "Asosit sahifa",
    isHome: true, //class menuni aktiv qilish uchun
  });
});

router.get("/users", (req, res) => {
  res.render(createViewpath("users"), {
    title: "Users",
    isUser: true,
  });
});

router.get("/products", async (req, res) => {
  res.render(createViewpath("products"), {
    title: "Products",
    isProduct: true,
  });
});

router.get("/category", async (req, res) => {
  res.render(createViewpath("category"), {
    title: "Categories",
    isCategory: true,
  });
});

router.get("/users/login", async (req, res) => {
  res.render(createViewpath("login"), {
    title: "Login",
    isLogin: true,
  });
});

module.exports = router;
