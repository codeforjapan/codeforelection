# Wikidataで試したクエリのメモ用

## 公職/国-日本
```
select (count(distinct ?s) AS ?c) where {
?s wdt:P39/wdt:P17 wd:Q17.
}
```
結果：1389

## 所属政党/国-日本
```
SELECT (COUNT(DISTINCT ?s) AS ?c) WHERE { 
  ?s (wdt:P102/wdt:P17) wd:Q17. 
}
```
結果：2976

## 公職/国-日本 OR 所属政党/国-日本 
```
SELECT (COUNT(DISTINCT ?s) AS ?c) WHERE { 
  {?s (wdt:P102/wdt:P17) wd:Q17.}
  UNION
  {?s wdt:P39/wdt:P17 wd:Q17.}
}
```
結果：3437

## 職業 -政治家を追加したが変わらず
```
SELECT (COUNT(DISTINCT ?s) AS ?c) WHERE { 
  {?s (wdt:P102/wdt:P17) wd:Q17.}
  UNION
  {?s wdt:P39/wdt:P17 wd:Q17.}
  UNION
  {?s wdt:P106 wd:Q82955;
      wdt:P72 wd:Q17}
}
```
結果：3437

## プロパティ一覧の取得
```
SELECT distinct ?p ?p2 ?pl ?plj WHERE {
    {
    SELECT distinct ?p  WHERE {
      ?s (wdt:P102/wdt:P17) wd:Q17. #所属政党/国-日本
      #?s wdt:P39/wdt:P17 wd:Q17. #公職/国-日本
      #?s wdt:P31 wd:Q5 . #Personのインスタンス
      ?s ?p ?o. 
        }
  limit 1000 #LIMITをかけないとタイムアウトする
  }
  ?p2 wikibase:directClaim ?p.
  ?p2 rdfs:label ?pl.
  FILTER(lang(?pl)="en")
  OPTIONAL{
    ?p2 rdfs:label ?plj.
    FILTER(lang(?plj)="ja")
  }  
} 
```
クエリの実行　http://tinyurl.com/yan9meej
