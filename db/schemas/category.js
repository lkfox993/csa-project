const { Schema, model, Types } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

const CategorySchema = Schema({
    
    name: {
        type: String,
        required: true,
    },

    weights: {
      type: [String],
      required: true
    }

  },
  {
    collection: "categories",
    timestamps: false,
  }
);

module.exports.CategorySchema = CategorySchema;
module.exports.Category = model("Category", CategorySchema);
module.exports.CategoryTC = composeWithMongoose(exports.Category);