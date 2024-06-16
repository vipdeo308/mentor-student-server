const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mentorDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Create mentor schema
const mentorSchema = new mongoose.Schema({
    name: String,
    students: [String]
});

// Create student schema
const studentSchema = new mongoose.Schema({
    name: String,
    mentor: String
});

// Create mentor and student models
const Mentor = mongoose.model('Mentor', mentorSchema);
const Student = mongoose.model('Student', studentSchema);

app.use(express.json());

// API to create a mentor
app.post('/api/mentors', async (req, res) => {
    const mentor = new Mentor({
        name: req.body.name,
        students: req.body.students || []
    });

    const result = await mentor.save();
    res.send(result);
});

// API to create a student
app.post('/api/students', async (req, res) => {
    const student = new Student({
        name: req.body.name,
        mentor: req.body.mentor || null
    });

    const result = await student.save();
    res.send(result);
});

// API to assign a student to a mentor
app.put('/api/students/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('The student with the given ID was not found.');

    student.mentor = req.body.mentor;
    const result = await student.save();

    res.send(result);
});

// API to list all students for a particular mentor
app.get('/api/mentors/:id/students', async (req, res) => {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).send('The mentor with the given ID was not found.');

    const students = await Student.find({ mentor: mentor.name });
    res.send(students);
});

// Listen on port 3000
app.listen(3000, () => console.log('Listening on port 3000...'));
