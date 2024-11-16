const express = require("express");
const bodyParser = require("body-parser");
const { dbConnect } = require("./config/DBconnect");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const credentialRoutes = require("./routes/credentialRoutes");
const blogRoutes = require("./routes/blogRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

const port = process.env.PORT || 8087;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173","https://xpertbuddy.vikas.engineer","https://expert-client.onrender.com"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use("/api/auth", credentialRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api", forgotPasswordRoutes);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

dbConnect();
