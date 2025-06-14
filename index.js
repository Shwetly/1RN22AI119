require('dotenv').config();

const express = require('express');

const axios = require('axios');

const {validateNumberType,maintainWindow,getAverage} = require('./utils/numberUtils');

const app=express();
const PORT=process.env.PORT || 9876;

const MAX_WINDOW_SIZE=10;
let currentWindow=[];

app.use(express.json());

app.get('/numbers/:numberid',validateNumberType,async (req, res) =>

{
  const {numberCategory}=req;

  try
  {
    const apiUrl = `http://20.244.56.144/evaluation-service/${numberCategory}`;

    const response=await axios.get(apiUrl,
    
    {
      headers:
      {
        Authorization:`Bearer ${process.env.AUTH_TOKEN}`
      },
      timeout:500
    });

    const incomingNumbers=response.data.numbers;
    const previousWindow= [...currentWindow];

    currentWindow=maintainWindow(currentWindow,incomingNumbers,MAX_WINDOW_SIZE);

    res.json(
    {
      windowPrevState:previousWindow,
      windowCurrState:currentWindow,
      numbers:incomingNumbers,
      avg:getAverage(currentWindow).toFixed(2)
    }
    );

  }
  
  catch (err)
  {
    console.error('fetch is failed', err.message);

    const errorMessage =
      err.code === 'ECONNABORTED'
        ? 'service timeout'
        : 'did nott fetch numbers';

    res.status(500).json(
    { error:errorMessage }
    );
  }
});

app.listen(PORT, () =>

{
  console.log(`active on http://localhost:${PORT}`);
});
