import 'dotenv/config'
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import productRouter from './router/product.js';
import categoryRouter from './router/category.js';
import cors from 'cors';


const port = process.env.PORT;
const databseUrl = process.env.DATABASE;


mongoose.connect(databseUrl)
    .then(() => {
        console.log('database is connected')
    })
    .catch((err) => {
        console.log(err.message)
    })

const corsOptions = {
    origin: 'http://localhost:5173',
    method: ['get', 'post', 'delete', 'patch', 'put']
}

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);


app.listen(port, () => {
    console.log(`app is runnning on http://localhost:${port}`);
})