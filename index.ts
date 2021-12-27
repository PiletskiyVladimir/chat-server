import express from "express";
import cors from 'cors';
import {PORT} from './settings.json';

const app = express();

app.use(cors());

app.listen(PORT, (): void => {
    console.log(`App is listening on port ${PORT}`);
});