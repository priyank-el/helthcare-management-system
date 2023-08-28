import express,{ Express } from "express";
import './config/db'
import chalk from 'chalk'
import dotenv from "dotenv";

import data from './security/keys';
import route from './routes/index'

dotenv.config()

const app:Express = express();
app.use(express.json())

app.use(route)

app.listen(data.PORT , () => {
    console.log(chalk.yellowBright(`Server running on port : ${data.PORT}..`));
})

