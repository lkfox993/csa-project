const { Schema, model, Types } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

const ParticipantSchema = Schema({

  name: {
    type: String,
    required: true,
  },

  age: {
    type: String,
    required: true
  },

  weight: {
    type: String,
    required: true
  }

},
  {
    collection: "participants",
    timestamps: false,
  }
);

module.exports.ParticipantSchema = ParticipantSchema;
module.exports.Participant = model("Participant", ParticipantSchema);
module.exports.ParticipantTC = composeWithMongoose(exports.Participant);