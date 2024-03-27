import { createAPI } from './api';
import { connect as connect_1_2 } from '../fdc3-1.2/connect';
import { connect as connect_2_0 } from '../fdc3-2.0/connect';

import { contextBridge, ipcRenderer } from 'electron';
import { sendMessage } from '../lib/lib';

import * as express from 'express';

connect_1_2(ipcRenderer, sendMessage);
connect_2_0(ipcRenderer, sendMessage);
console.log('CREATING DESKTOP AGENT');
const DesktopAgent = createAPI(sendMessage, ipcRenderer);
/* expose the fdc3 api across the context isolation divide...*/
contextBridge.exposeInMainWorld('fdc3', DesktopAgent);

// import { createDesktopAgentInstance } from './desktop-agent';

const e = require('express');
const app = e();
// const agent = createDesktopAgentInstance(/*...*/);
const agent = DesktopAgent;

app.get('/getInfo', function (req: express.Request, res: express.Response) {
  agent.getInfo().then((info) => {
    res.json(info);
  });
});

// app.get('/findIntent', (req, res) => {
//   const { intent, context } = req.query;

//   agent.findIntent(intent, context).then(result => {
//     res.json(result);
//   });
// });

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('App running on port 3000');
});

app.listen(3000, () => {
  console.log('Agent API listening on port 3000');
});

// export default app;
