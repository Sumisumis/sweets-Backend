const express = require('express');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.use(express.json()); //json を req.body にする 
app.use(express.urlencoded({ extended: true})); // フォームデータを req.body にする

//MongoDBへ接続
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB接続成功'))
    .catch(err => console.error('MongoDB接続エラー', err));
    
// セッション設定
app.use(session({
    secret: process.env.SESSION_SECRET,  // セッションIDを署名するための秘密鍵。安全な値を.envに設定
    resave: false, // セッションの内容に変更がなくても再保存するかどうか
    saveUninitialized: false, // 新しいセッションが作られた時に保存するかどうか（false推奨）
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}), // セッション情報をMongoDBに保存する設定
    cookie: {
        httpOnly: true,  // JavaScriptからクッキーの読み取りを禁止し、セキュリティを高める
        secure: false,   // HTTPSでのみクッキーを送信（本番環境ではtrueにする）
        maxAge: 1000 * 60 * 60 * 24 * 30 // クッキーの有効期限を30日間に設定（ミリ秒単位）
    }
}))

//仮のルート
app.get('/', (req, res) => {
    res.send('バックエンド準備OK');
});

// ルーティングをインポートして/userLoginバスに割り当てる
const userRouter = require("./routes/userFunction");
app.use('/userFunction', userRouter);

// サーバー起動
//POST → PORTへの変更
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => console.log('サーバー起動中'))