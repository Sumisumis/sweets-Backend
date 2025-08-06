const express = require ('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('バックエンドが立ち上がっています');
});

const POST = process.env.POST || 3000;
app.listen(POST, () => console.log('http://localhost:${POST} で待機中'));

mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('MongoDBに接続成功'))
 .catch(err => console.error('MongoDB接続エラー', err));