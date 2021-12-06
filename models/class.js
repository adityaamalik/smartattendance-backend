const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    students: [
        {
            type: String,
        },
    ],
    className: {
        type: String,
        required: true,
    },
    subjectCode: {
        type: String,
        required: true,
    },
    meetLink: {
        type: String,
    },
    days: {
        type: Object,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    date: {
        type: Date,
    },
});

exports.Class = mongoose.model("Class", classSchema);
