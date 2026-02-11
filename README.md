# 歩数メモ (Step Memo)

手動で歩数を記録するシンプルなアプリです。HealthKit連携なしで、純粋に歩数をメモとして記録できます。

## 機能

- 📝 **手動で歩数を記録** - ワンタップで今日の歩数を入力
- 🎯 **目標歩数設定** - デフォルト8000歩、自由にカスタマイズ可能
- 📊 **統計グラフ** - 日別・週別・月別の歩数推移を可視化
- 💯 **達成率表示** - 今日は目標の何%達成したか一目でわかる
- 🔥 **連続達成日数** - モチベーションを維持する連続記録

## スクリーンショット

(準備中)

## 技術スタック

- Expo SDK 52
- Expo Router 4
- TypeScript
- AsyncStorage
- React Native SVG

## 開発環境

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm start

# iOS シミュレーター
npm run ios

# Android エミュレーター
npm run android

# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage
```

## プロジェクト構成

```
step-memo/
├── app/                    # Expo Router画面
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # 今日の記録
│   │   ├── history.tsx    # 履歴一覧
│   │   ├── stats.tsx      # 統計グラフ
│   │   └── settings.tsx   # 設定
│   └── _layout.tsx
├── src/
│   ├── components/        # UIコンポーネント
│   ├── storage/          # AsyncStorageラッパー
│   ├── types/            # TypeScript型定義
│   └── utils/            # ユーティリティ関数
├── __tests__/            # テストファイル
└── assets/               # アイコン・画像
```

## ライセンス

© 2026 ManyConnection LLC
