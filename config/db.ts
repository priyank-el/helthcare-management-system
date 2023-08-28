import mongoose from 'mongoose';
import data from '../security/keys'
import chalk from 'chalk'

mongoose.connect(data.MONGODB_URI)
.then(() => {
    console.log(chalk.yellowBright("database connected.."));
})
.catch((error:any) => {
    console.log(chalk.redBright(error));
})