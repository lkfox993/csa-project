const mongoose = require('mongoose');

module.exports.connectDatabase = async (options) => {
    await mongoose.connect('mongodb+srv://lkfox993:PdTX6Ur1yk3ULGV3@cluster0.hoiosw9.mongodb.net/csa?retryWrites=true&w=majority', /*options*/);
};