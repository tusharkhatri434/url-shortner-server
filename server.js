require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const urlRedirectRoutes = require('./routes/redirectUrl');



app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.json({msg:"Server is running....."})
});

app.use("/",urlRedirectRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/urls",urlRoutes);

app.listen(process.env.PORT || 6000,()=>{
    console.log(`Application running on PORT : ${process.env.PORT || 6000}`)
})