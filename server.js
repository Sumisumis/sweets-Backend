const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
 .then(() => console.log('MongoDB接続成功'))
 .catch((err) => console.error('MongoDB接続エラー:', err));

app.get('/', (req, res) => {
    res.send('バックエンド準備OK');
});

const POST = process.env.POST || 3000;
app.listen(POST, () => console.log('サーバー起動中'))