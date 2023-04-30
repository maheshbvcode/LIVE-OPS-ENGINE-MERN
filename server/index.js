const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000

//connect to DB
mongoose.connect("mongodb+srv://mahesh:maheshbv@cluster0.v1dvyhe.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Successfully connected to MongoDB')
})


app.listen(port, () => console.log(`Server successfully running at port ${port}`));

