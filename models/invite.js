const mongoose = require("mongoose");

const inviteSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
    },
    date: {
        type: Date,
    },
});

exports.Invite = mongoose.model("Invite", inviteSchema);
