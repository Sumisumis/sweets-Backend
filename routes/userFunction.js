const express = require("express");
const router = express.Router();
const User = require('../models/userModels');
const UserModel = require("../models/userModels");

// 新規ユーザー登録処理
router.post("/register", async (req, res) => {
    try {
        // リクエストの body から name, email, password を取り出す
        const { name, email, password } = req.body;

        // User model のインスタンスを作成
        // Mongo の users コレクションに保存する準備
        const newUser = new User({ name, email, password });

        await newUser.save(); // MongoDBにユーザーを保存
        // await は非同期処理のため

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        // エラー発生時の処理
        console.error(err); // サーバー側のログにエラー内容を出力
        // クライアントにエラーを返す
        res.status(500).json({ error: 'Failed to create user'/*, detail: err.message */ });
    }
});

// ログイン処理
router.post("/login", async (req, res) => {
    // リクエストの body から email, password を取り出す
    const { email, password } = req.body;

    // DBからemailが一致するユーザーを探す
    const user = await UserModel.findOne({ email });

    // ユーザーが存在しない、またはパスワードが一致しない場合
    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // ログイン成功：セッションに保存
    req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name
    }
    res.json({ message: "Logged in successfully" });
});

// ログアウト処理
// セッションを破棄してログアウト
router.post("/logout", (req, res) => {
    const user = req.session.user; // ← ログアウト前に退避しておく

    // セッションを破棄
    req.session.destroy(() => {
        res.json({
            message: "Logged out",
            user: user ? { name: user.name, email: user.email } : null
        });
    });
});

// 削除処理
router.delete("/delete", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // 該当するユーザーを探す
        const user = await UserModel.findOne({ name, email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // パスワードが一致するかチェック
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // ユーザーを削除
        await UserModel.deleteOne({ _id: user._id });

        res.json({ message: "User deleted successfully", deletedUser: { name, email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user" });
    }
})

// 認証済みのみアクセス可能なページ
router.get("/dashboard", (req, res) => {
    // ログイン状態でなければエラー
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // ログイン状態の場合、歓迎メッセージを返す
    res.json({ message: `Welcome,${req.session.user.name}` });
})

module.exports = router;