const express = require('express');
const app = express();

app.use("/", (req, res) => {
    res.send("Server is Running");
});

app.listen(5000, console.log("Server startd on PORT http://localhost:5000/"));
