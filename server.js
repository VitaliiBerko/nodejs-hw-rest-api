const app = require('./app')
require("dotenv").config();
const mongoose = require("mongoose");


const connection = mongoose.connect(process.env.MONGODB_URL, {
  // promiseLibrary: global.Promise,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
});


connection
   .then((con) => {
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000")
    })
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`)
    process.exit(1);
  });

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
