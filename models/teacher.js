const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
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
    qualifications: {
        type: String,
        default: "",
    },
});

exports.Teacher = mongoose.model("Teacher", teacherSchema);
