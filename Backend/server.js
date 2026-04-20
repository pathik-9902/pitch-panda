require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const turfRoutes = require("./routes/turfRoutes");
const slotRoutes = require("./routes/slotRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const splitedSlotsRoutes = require("./routes/splitedSlotRoutes");
const gdriveRoutes = require("./routes/gdriveRoutes");
const deleteSlots = require("./jobs/deleteSlots");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();
// deleteSlots();

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/split", splitedSlotsRoutes);
app.use('/api/gdrive', gdriveRoutes);
app.use('/api/images', require('./routes/imageRoutes'));


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
