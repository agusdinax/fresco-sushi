// models/ConfiguracionGlobal.js
const mongoose = require("mongoose");

const StockGeneralSchema = new mongoose.Schema({
  stockGeneralActivo: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("StockGeneral", StockGeneralSchema);
