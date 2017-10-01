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

## IDを指定した人物（政治家）から指定したプロパティの値を取得する例
```
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/>
SELECT distinct ?class ?classLabel ?occupation ?occupationLabel ?position ?positionLabel ?partyLabel WHERE {
  wd:Q261703 wdt:P31 ?class.
OPTIONAL{
  wd:Q261703 wdt:P106 ?occupation;
             wdt:P39 ?position;
             wdt:P102 ?party.
  }
SERVICE wikibase:label {
     bd:serviceParam wikibase:language "ja" .
   }
} 
```
実行例：http://tinyurl.com/ybb6yve5  
- 必要なプロパティが決まれば，OPTIONALの中身を増やす   
- 人物のIDの部分を候補者一覧に沿って差し替えて処理する   

## 上記のクエリを「衆議院議員」を対象に実行
http://tinyurl.com/y8lc4poh
※ただ，現職以外もヒットする

## 在職期間（開始日）の取得例
```
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/>
prefix ps: <http://www.wikidata.org/prop/statement/> 

SELECT distinct #?person ?personLabel  ?priod 
    ?occupation ?occupationLabel #?occupationP 
    ?position ?positionLabel ?positionP
    #?party ?partyLabel ?partyP
WHERE {
#  wd:Q261703 p:P39 ?state.
#  ?state ps:P39 wd:Q17506823 . 
#  OPTIONAL{ ?state pq:P580 ?priod. }
  wd:Q261703  p:P106 ?occupationST.
  ?occupationST  ps:P106 ?occupation.
#  OPTIONAL{ ?occupationST pq:P580 ?occupationP. }      
  wd:Q261703 p:P39 ?positionST.
  ?positionST ps:P39 ?position.
  OPTIONAL{ ?positionST pq:P580 ?positionP. }
#  wd:Q261703 p:P102 ?partyST.
#  ?partyST ps:P102 ?party.
#  OPTIONAL{ ?partyST pq:P580 ?partyP. }
SERVICE wikibase:label {
     bd:serviceParam wikibase:language "ja" .
   }
} ORDER BY ?person
```
実行例　http://tinyurl.com/y7dzkcoh  
→衆議院議員全体を対象にテスト　http://tinyurl.com/y8rmbzbe  
※衆議院議員の在職期間は，ほとんど記述がなさそう
