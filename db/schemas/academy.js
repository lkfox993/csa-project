const { Schema, model, Types } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

const { ParticipantSchema } = require('./participant');

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
    type: [ ParticipantSchema ],
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