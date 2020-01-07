const cors = require('cors');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const {
  Client,
  LocalSigner,
  createAccount,
  argString
} = require('orbs-client-sdk');

const PORT = process.env.PORT || 5678;
const IMAGE_HASH_SERVICE_URL = 'http://localhost:5000';
const ORBS_NODE_URL = 'http://localhost:8080';
const ORBS_VCHAIN = 42;

const orbsClient = new Client(
  ORBS_NODE_URL,
  ORBS_VCHAIN,
  'MAIN_NET',
  new LocalSigner(createAccount())
);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { url } = req.body;
  const { data } = await axios.post(`${IMAGE_HASH_SERVICE_URL}/hash`, { url });
  const { pHash } = data;

  const query = await orbsClient.createQuery(
    'OpenRights01',
    'getMedia',
    [argString(pHash)]
  );

  const { outputArguments, executionResult } = await orbsClient.sendQuery(query);
  if (executionResult === 'SUCCESS') {
    // we know how to map url to an image 1 to 1, thus checking other values is useless for now.
    res.send(outputArguments[0].value)
  } else {
    res.status(500).send(outputArguments);
  }
  res.end();
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));