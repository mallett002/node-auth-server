const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// DB setup
mongoose.connect('mongodb://localhost:27017/auth_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
router(app);

// Server setup
const port = process.env.port || 3090;

app.listen(port, () => console.log(`server is listening on port ${port}`));
