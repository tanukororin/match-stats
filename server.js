const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// JSON形式でデータを受け取る
app.use(express.json());

// 試合データを保存するAPI
app.post("/save-match", (req, res) => {
    const matchData = req.body;

    // stats.jsonのパス
    const statsFilePath = path.join(__dirname, "stats.json");

    // 既存の統計データを読み込み
    fs.readFile(statsFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "ファイル読み込みエラー" });
        }

        let stats = [];
        try {
            stats = JSON.parse(data);
        } catch (e) {
            // JSONパースエラーの場合、新しい配列で初期化
            stats = [];
        }

        // 新しい試合データを追加
        stats.push(matchData);

        // stats.jsonに保存
        fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "ファイル書き込みエラー" });
            }
            res.json({ message: "試合データが保存されました" });
        });
    });
});

// サーバーを起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました。`);
});
