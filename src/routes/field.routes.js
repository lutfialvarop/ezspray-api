const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/field.controller");
const response = require("../utils/apiResponse");

// router.get("/", (req, res) => {
//     response.success(
//         res,
//         {
//             version: "1.0.0",
//             uptime: process.uptime(),
//         },
//         "Back-End EzSpray API is running",
//     );
// });
router.post("/", fieldController.getAllFields);
router.post("/history", fieldController.getWateringHistory);
router.post("/create", fieldController.createField);
router.post("/detail/:field_id", fieldController.getFieldDetail);
router.post("/control", fieldController.sendControlCommand);

module.exports = router;
