const { Teacher } = require("../models/teacher");
const { Invite } = require("../models/invite");
const { Class } = require("../models/class");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
router.get(`/`, async (req, res) => {
    const teacherList = await Teacher.find().select("-password");
    if (!teacherList) {
        res.json({ success: false });
    }
    res.send(teacherList);
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
        filter = { teacher: req.params.id };
    }
    const classList = await Class.find(filter).sort({ date: -1 });
    if (!classList) {
        res.json({ success: false });
    }
    res.send(classList);
});

router.post("/invite/:id", async (req, res) => {
    const studentid = mongoose.Types.ObjectId(req.body.student);
    const teacherid = mongoose.Types.ObjectId(req.params.id);
    const classid = mongoose.Types.ObjectId(req.body.class);
    const today = Date.now();
    let invite = new Invite({
        message: req.body.message,
        student: studentid,
        teacher: teacherid,
        date: today,
        timings: req.body.timings,
        days: req.body.days,
        class: classid,
    });
    invite = await invite.save();
    if (!invite) return res.send("the Invite cannot be created!");
    res.send(invite);
});

router.post("/class/:id", async (req, res) => {
    const teacherid = mongoose.Types.ObjectId(req.params.id);
    const today = Date.now();

    let classA = new Class({
        className: req.body.className,
        teacher: teacherid,
        date: today,
        days: req.body.days,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        meetLink: req.body.meetLink,
        subjectCode: req.body.subjectCode,
        students: req.body.students,
    });
    classA = await classA.save();
    if (!classA) return res.send("the class cannot be created!");

    res.send(classA);
});

router.post("/register", async (req, res) => {
    console.log(req.body);

    const secret = process.env.secret;
    let teacher = new Teacher({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
    });
    teacher = await teacher.save();
    if (!teacher) return res.send("the teacher cannot be created!");
    const token = jwt.sign(
        {
            email: req.body.email,
        },
        secret,
        { expiresIn: "1d" }
    );
    res.status(200).send({ teacher: teacher, token: token });
});
router.post("/login", async (req, res) => {
    const teacher = await Teacher.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!teacher) {
        return res.status(400).send("The teacher not found");
    }

    if (teacher && bcrypt.compareSync(req.body.password, teacher.password)) {
        const token = jwt.sign(
            {
                teacherid: teacher._id,
            },
            secret,
            { expiresIn: "1d" }
        );

        res.status(200).send({ teacher: teacher, token: token });
    } else {
        res.status(400).send("password incorrect");
    }
});

router.put("/:id", async (req, res) => {
    let params = {
        email: req.body.email,
        name: req.body.name,
        qualifications: req.body.qualifications,
        profileHeading: req.body.profileHeading,
        profileDescription: req.body.profileDescription,
    };
    for (let prop in params) if (!params[prop]) delete params[prop];

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, params, {
        new: true,
    });

    if (!teacher) return res.send("the teacher cannot be updated!");
    res.send(teacher);
});

router.get("/:id", async (req, res) => {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) {
        res.json({ message: "The Teacher with the given ID was not found." });
    }
    res.send(teacher);
});

module.exports = router;
