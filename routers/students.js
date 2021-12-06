const { Student } = require("../models/student");
const { Invite } = require("../models/invite");
const { Class } = require("../models/class");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
    const studentList = await Student.find().select("-password");
    if (!studentList) {
        res.json({ success: false });
    }
    res.send(studentList);
});

router.get("/invite/:id", async (req, res) => {
    let filter = {};
    if (req.params.id) {
        filter = { student: req.params.id };
    }
    const inviteList = await Invite.find(filter).sort({ date: -1 });
    if (!inviteList) {
        res.json({ success: false });
    }
    res.send(inviteList);
});

router.get("/class/:id", async (req, res) => {
    let filter = {};
    if (req.params.id) {
        filter = { student: req.params.id };
    }
    const classList = await Class.find(filter).sort({ date: -1 });
    if (!classList) {
        res.json({ success: false });
    }
    res.send(classList);
});

router.put("/invite/accept/:id", async (req, res) => {
    let inviteid = mongoose.Types.ObjectId(req.body.invite);
    let invite = await Invite.findById(inviteid);
    const classid = mongoose.Types.ObjectId(invite.class);
    const classobj = await Class.findById(classid);
    const studentArray = classobj.student;
    studentArray.push(mongoose.Types.ObjectId(req.params.id));
    let params = {
        student: studentArray,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const classa = await Class.findByIdAndUpdate(classid, params, {
        new: true,
    });

    const studentid = mongoose.Types.ObjectId(req.params.id);
    const studentobj = await Student.findById(studentid);
    const TeacherArray = studentobj.teachers;
    const Teacherobj = {
        class: classid,
        teacher: mongoose.Types.ObjectId(classobj.teacher),
    };

    TeacherArray.push(Teacherobj);

    params = {
        teachers: TeacherArray,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];
    const student = await Student.findByIdAndUpdate(req.params.id, params, {
        new: true,
    });

    invite = await Invite.findByIdAndDelete(inviteid);
    if (!invite) {
        return res.status(404).send();
    }
    res.send("invite accepted");
});

router.post("/register", async (req, res) => {
    console.log(req.body);
    const secret = process.env.secret;
    let student = new Student({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        year: req.body.year,
        rollNo: req.body.rollNo,
    });
    student = await student.save();
    if (!student) return res.send("the student cannot be created!");
    const token = jwt.sign(
        {
            email: req.body.email,
        },
        secret,
        { expiresIn: "1d" }
    );
    res.status(200).send({ student: student, token: token });
});

router.post("/login", async (req, res) => {
    const student = await Student.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!student) {
        return res.status(403).send("email incorrect");
    }

    if (student && bcrypt.compareSync(req.body.password, student.password)) {
        const token = jwt.sign(
            {
                studentid: student._id,
            },
            secret,
            { expiresIn: "1d" }
        );

        res.status(200).send({ student: student, token: token });
    } else {
        res.send("password incorrect");
    }
});

//for profile
router.put("/:id", async (req, res) => {
    let params = {
        email: req.body.email,
        name: req.body.name,
        qualifications: req.body.a,
        profileHeading: req.body.a,
        profileDescription: req.body.profileDescription,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];

    const student = await Student.findByIdAndUpdate(req.params.id, params, {
        new: true,
    });

    if (!student) return res.send("the student cannot be updated!");
    res.send(student);
});

router.get("/:id", async (req, res) => {
    Student.findOne({ _id: req.params.id })
        .populate({
            path: "teachers",
            populate: [
                {
                    path: "teacher",
                },

                {
                    path: "class",
                },
            ],
        })
        .then((user) => {
            res.json(user);
        });
});

module.exports = router;
