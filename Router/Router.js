const express = require("express");
const route = express.Router();
const {ApiData,sentCountTotalValueController }= require("../Controller/ApiFetch")


route.get("/getInvoiceData", ApiData)
route.post("/sentCountTotalValue",sentCountTotalValueController)
module.exports = route