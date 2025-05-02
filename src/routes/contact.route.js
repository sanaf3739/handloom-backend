const { Router } = require("express");
const { handleContact } = require("../controllers/contact.controller");

const router = Router();

router.post("/", handleContact);

module.exports = router;
