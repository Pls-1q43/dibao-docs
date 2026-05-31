---
title: プラグイン開発
description: Dibao プラグイン開発の入口と互換性ルール。
---

プラグイン開発ドキュメントは Dibao を拡張する開発者向けです。プラグインは manifest によって capabilities、contributions、tasks、settings、対応バージョンを宣言します。DOM patch や CSS selector による UI 注入は前提にしません。

## 基本ルール

- プラグインパッケージは `.dibao-plugin` として配布します。
- manifest には plugin ID、version、publisher、capabilities、compatibility range が必要です。
- 第三者プラグインはインストール後も、ユーザーが有効化するまで無効のままです。
- プラグインデータは `/data/plugins/data/<plugin-id>` または文書化された plugin storage API に保存します。
- 更新には metadata、package URL、checksum を提供します。

## リファレンスの状態

プラグイン開発リファレンスは簡体中文と英語で維持されています。日本語ページは製品レベルの案内を提供します。実装時は `plugin-development.zh-CN.md`、`plugin-development.en-US.md`、API contract のプラグイン関連セクションを基準にしてください。

この docs サイトでは、プラグイン開発を独立した入口として置きます。今後 manifest v1、capability 名、Hook 名、UI slot、パッケージ形式を安定ページとして展開します。
