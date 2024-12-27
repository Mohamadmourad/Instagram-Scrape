require('dotenv').config();

const express = require('express');
const scrapeRoutes = require('./routes/scraping');

const app = express();

app.use(express.json());

app.use((req,res,next)=>{
  console.log(req.path,req.method);
  next();
})

app.use('/getInstaUser',scrapeRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`listening to port ${process.env.PORT}`);
})