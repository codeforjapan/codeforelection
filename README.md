## Code for 選挙プロジェクト・データ作成リポジトリ
| ⚠️ This repository has been archived and will no longer be maintained. Thanks for all the stars, help and brainstorms! |

Code for 選挙プロジェクトは、2017年衆議院選挙候補者のオープンなデータベースを作り、候補者の政策及び過去の実績を中立的に参照できるサイトを制作することを目的としています。
このリポジトリはデータの作成に関する活動を行っています。

データ配布サイトなどフロントエンドに関する情報は、[codeforjapan/codeforelection_front](https://github.com/codeforjapan/codeforelection_front)を参照してください。

## 作成したデータについて
### 候補者データ
候補者データをCSV形式で提供しています。

詳細は[こちら](https://kouhosha.info/data)

### 郵便番号-小選挙区検索データ
- 7桁の郵便番号（事業所番号は除く）から、対応する289選挙区への対応を取れるオープンデータを作成しました。
- データ仕様
  - 郵便番号をキーとして格納
  - 該当郵便番号の基礎自治体の行政コード、および小選挙区番号が含まれます
  - 都道府県は行政コードからご利用ください。

```json
{
  "1050000":{"cityCode":"13103","senkyoNum":"1"},
  "1050001":{"cityCode":"13103","senkyoNum":"2"},
  "1050002":{"cityCode":"13103","senkyoNum":"2"},
  //以下略
}

```

- [ダウンロード](https://github.com/codeforjapan/codeforelection/blob/master/data/json/postal2senkyoku.json)
- [データに関するREADME](https://github.com/codeforjapan/codeforelection/blob/master/data/README.md)
- [利用データ/東大西沢先生作成小選挙区データ](http://www.csis.u-tokyo.ac.jp/~nishizawa/senkyoku/)
- [利用データ/郵便番号](http://www.post.japanpost.jp/zipcode/download.html)

### データに関するライセンス
CC0

### データ構造について
TBD

## メンバー

一般社団法人Code for Japan 及び有志メンバーによって開発されています。
メンバーについては[情報まとめページ](https://hackmd.io/s/rkXhmQjjW)をご確認ください。

## コントリビューター募集中

このプロジェクトには、誰でも貢献ができます。  
今の政治の状況に対して声をあげるのも大事ですが、実際に手を動かすことで、政治家の活動の見える化に協力しませんか？
各候補者の、過去の国会での発言や政策など、事実情報を淡々と積み上げることで、多くの人が正しい投票を行うサポートができるはずです。

参加方法については、[HowToContribute](https://github.com/codeforjapan/codeforelection/blob/master/HowToContribute.md)を参照してください。

また、[情報まとめページ](https://hackmd.io/s/rkXhmQjjW) 内にかかれている、Slack チャンネルから議論に参加できます。

### お問い合わせ

info@code4japan.org までご連絡ください
