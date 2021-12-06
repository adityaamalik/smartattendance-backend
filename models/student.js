const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        default: 1,
        required: true,
    },
    rollNo: {
        type: Number,
        required: true,
    },
});

exports.Student = mongoose.model("Student", studentSchema);
