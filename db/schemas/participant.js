const { Schema, model, Types } = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");

const ParticipantSchema = Schema({

  name: {
    type: String,
    required: true,
  },

  weight: {
    type: String,
    required: true
  }

},
  {
    collection: "categories",
    timestamps: false,
  }
);

module.exports.ParticipantSchema = ParticipantSchema;
module.exports.Participant = model("Participant", ParticipantSchema);
module.exports.ParticipantTC = composeWithMongoose(exports.Participant);