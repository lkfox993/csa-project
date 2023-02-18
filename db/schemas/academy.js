const { Schema, model, Types } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

const AcademySchema = Schema({

  /**
   * Name of Academy
   * @example mongodb
   */
  name: {
    type: String,
    required: true,
  },

  trainer: {
    type: String,
    required: false
  },

  email: {
    type: String,
    required: false
  },

  phone: {
    type: String,
    required: true
  },

  participants: {
    type: [
      {

        _id: false,

        name: {
          type: String,
          required: true,
        },

        age: {
          type: Date,
          required: false,
          default: Date.now
        },

        balance: {
          type: Number,
          required: false,
          defaultValue: 0
        },

        weight: {
          type: String,
          required: true
        }

      }

    ],
    required: false
  }

},
  {
    collection: "academies",
    timestamps: false,
  }
);

module.exports.AcademySchema = AcademySchema;
module.exports.Academy = model("Academy", AcademySchema);
module.exports.AcademyTC = composeWithMongoose(exports.Academy);