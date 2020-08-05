const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// Init Express app
const app = express();

// Constants
const PORT = process.env.PORT || 3000;

// Using security and parser things
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/uploads', express.static('uploads'));
app.use('/api/docs', express.static('docs'));

// Error route
app.get('/', (_, res) => {
    res.json({
        error: { message: 'Not found' }
    })
})

// Routes
const doctorsRoute = require('./routes/doctors');
const appointmentsRoute = require('./routes/appointments');
const clinicsRoute = require('./routes/clinics');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');

// Init routes
app.use('/api/doctors', doctorsRoute);
app.use('/api/appointments', appointmentsRoute);
app.use('/api/clinics', clinicsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);

// Connecting mongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: true }, (err) => {
    if(!!err) {
        console.log(err);
    }

    console.log('DB is connected');

    // Starting a server
    app.listen(PORT, () => {
        console.log('Server: http://localhost:' + PORT);
    })
})