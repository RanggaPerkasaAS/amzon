const mongoose = require("mongoose");
const schema = mongoose.Schema;

const tesSchema = new schema({
  nama: {
    type: String,
  },
});

module.exports = mongoose.model("tes", tesSchema);
