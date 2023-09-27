import express,{ Express, urlencoded } from "express"
import './config/db'
import chalk from 'chalk'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

import data from './security/keys'
import { cronJobs } from './controllers/cronJobs'
import route from './routes/index'

cronJobs()

dotenv.config()

const app:Express = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(express.static('public'))
app.use('/images', express.static(__dirname + '/images'))

app.use(cookieParser())
app.use(route)

app.listen(data.PORT , () => {
    console.log(chalk.yellowBright(`Server running on port : ${data.PORT}..`))
})

