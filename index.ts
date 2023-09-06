import express,{ Express } from "express";
import './config/db'
import chalk from 'chalk'
import dotenv from "dotenv";
import i18n from 'i18n';
import cookieParser from 'cookie-parser';
import path from 'path';

import data from './security/keys';
import route from './routes/index';
import { named } from './controllers/cronJobs'
named

dotenv.config()

const app:Express = express();
app.use(express.json())

i18n.configure({
    locales:['en','hi'],
    directory:path.join(__dirname,'/locales'),
    defaultLocale:'en',
    queryParameter:'lang',
    register:'global'
});

app.use(i18n.init)
app.use(cookieParser())
app.use(route)

app.listen(data.PORT , () => {
    console.log(chalk.yellowBright(`Server running on port : ${data.PORT}..`));
})

