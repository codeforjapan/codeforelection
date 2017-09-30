"use strict";

const assert = require("power-assert");
const City = require("../../script/city");
const SenkyokuCell = require("../../script/senkyoku_cell");

const testCellData =
  [
];

let city,cell;
const cell1 = new SenkyokuCell(
  { '行番号': '2',
    '市町村コード': '1101',
    '町丁字コード１': '1010300',
    '町丁字コード２': '300',
    '地域識別番号': '2',
    '市区町村名': '札幌市中央区',
    '町丁字名': '円山',
    '選挙区': '1' }
);
const another_senkyoku_cell = new SenkyokuCell(
  { '行番号': '2',
    '市町村コード': '1101',
    '町丁字コード１': '1010300',
    '町丁字コード２': '300',
    '地域識別番号': '2',
    '市区町村名': '札幌市中央区',
    '町丁字名': '丸山大通り',
    '選挙区': '2' }
);
const another_senkyoku_cell_1 = new SenkyokuCell(
  { '行番号': '2',
    '市町村コード': '1101',
    '町丁字コード１': '1010300',
    '町丁字コード２': '300',
    '地域識別番号': '2',
    '市区町村名': '札幌市中央区',
    '町丁字名': '丸山大通り１',
    '選挙区': '2' }
);
const another_senkyoku_cell_2 = new SenkyokuCell(
  { '行番号': '2',
    '市町村コード': '1101',
    '町丁字コード１': '1010300',
    '町丁字コード２': '300',
    '地域識別番号': '2',
    '市区町村名': '札幌市中央区',
    '町丁字名': '丸山大通り２',
    '選挙区': '2' }
);
const another_city_cell = new SenkyokuCell(
  { '行番号': '2',
    '市町村コード': '1102',
    '町丁字コード１': '1010300',
    '町丁字コード２': '300',
    '地域識別番号': '2',
    '市区町村名': '札幌市中央区',
    '町丁字名': '丸山公園',
    '選挙区': '2' }
);


describe("City",()=>{
  beforeEach(()=>{
    cell = new SenkyokuCell(
      { '行番号': '1',
        '市町村コード': '1101',
        '町丁字コード１': '1010200',
        '町丁字コード２': '200',
        '地域識別番号': '2',
        '市区町村名': '札幌市中央区',
        '町丁字名': '宮ケ丘（番地）',
        '選挙区': '1' }
    );
    city = new City(cell);
    city.registerSenkyokuNum(cell);
  });
  it("cityをインスタンス化できる",()=> {
    assert(city);
  });
  it("同じ市町村コードを持ったcellはSameになる" ,()=>{
    assert(city.isSameCity(cell));
  });
  it("異なる市町村コードを与えたcellはSameにならない" ,()=>{
    assert(!city.isSameCity(another_city_cell));
  });
  it("同じ行政コード、同じ選挙区番号のcellを追加するとcellsは増えるが、senkyokuNumsは増えない",()=>{
    assert(city.cells.length === 1,"最初のセル数は1");
    assert(city.senkyokuNums.length === 1,"最初の選挙区番号リストの長さは1");
    city.registerSenkyokuNum(cell1);
    assert(city.cells.length === 2, "追加後のセル数は2");
    assert(city.senkyokuNums.length === 1, "追加後の選挙区番号のリストの長さは1");
  });
  it("add another_senkyoku_cell",()=>{
    assert(city.cells.length === 1);
    assert(city.senkyokuNums.length === 1);
    city.registerSenkyokuNum(another_senkyoku_cell);
    assert(city.cells.length === 2);
    assert(city.senkyokuNums.length === 2);
  });
  it("異なる行政コードのcellを追加しても増えない",()=>{
    assert(city.cells.length === 1);
    city.registerSenkyokuNum(another_city_cell);
    assert(city.cells.length === 1);
  });
  describe("searchCellsIncludingTownName",()=>{
    beforeEach(()=>{
      city.registerSenkyokuNum(cell1);
      city.registerSenkyokuNum(another_senkyoku_cell);
    });
    it("同一町字を指定して返す",()=>{
      const res = city.searchCellsIncludingTownName("円山");
      assert(res.length === 1);
    });
    it("一部文字を指定して返す",()=>{
      const res = city.searchCellsIncludingTownName("円");
      assert(res.length === 1);
    });
    it("含まない文字ではnullを返す",()=>{
      const res = city.searchCellsIncludingTownName("線");
      assert(res === null);
    });
  });
  describe("setStandardSenkyokuNum",()=>{
    it("すべてのセルが同じ選曲番号を保つ場合",()=>{
      city.registerSenkyokuNum(cell1);
      city.setStandardSenkyokuNum();
      assert(city.standardSenkyokuNum === "1");
    });
    it("1が多数派の場合",()=>{
      city.registerSenkyokuNum(cell1);
      city.registerSenkyokuNum(another_senkyoku_cell);
      assert(city.setStandardSenkyokuNum() === "1");
    });
    it("1,2同数の場合、先に登録されていた方を返す",()=>{
      city.registerSenkyokuNum(cell1);
      city.registerSenkyokuNum(another_senkyoku_cell);
      city.registerSenkyokuNum(another_senkyoku_cell_1);
      city.setStandardSenkyokuNum();
      assert(city.standardSenkyokuNum === "1");
    });
    it("2が多数派の場合",()=>{
      city.registerSenkyokuNum(cell1);
      city.registerSenkyokuNum(another_senkyoku_cell);
      city.registerSenkyokuNum(another_senkyoku_cell_1);
      city.registerSenkyokuNum(another_senkyoku_cell_1);
      city.setStandardSenkyokuNum();
      assert(city.standardSenkyokuNum === "2");
    });

  });


  /*
  it("ハッシュが2以上読み込まれている", ()=>{
    assert(Object.keys(c2s.hash).length > 2);
  });
  it("10201の市町村が引ける",()=>{
    assert(c2s.senkyokuNums("10201"));
  });
  */
});
