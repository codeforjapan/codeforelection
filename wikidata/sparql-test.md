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
