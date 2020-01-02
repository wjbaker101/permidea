import path from 'path';
import express from 'express';

import bodyParser from 'body-parser';

import { NoteController } from './controller/NoteController';

const app = express();

app.use(bodyParser.json());

app.use('/api', NoteController);

app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(8080, () => {
    console.log('Backend started on port 8080');
});
