//const FilterHelper = require('../dist/filter.js');
//import { FilterHelper }  from '../dist/filter.js';

describe("FilterHelper Tests", function () {
    // var  [[["ID", "=", "1112"],'or',["ID", "=", "1112"]] ,'and', ["x","=","99"] ]

    it("test Create simple", function () {

      //  const fh=new FilterHelper();
        var exp = ["ID", "=", "1113"]
        var resFilter = FilterHelper.CreateFilterItems(exp);
        expect(resFilter.Condition ).to.equal( '=');
        expect(resFilter.Name ).to.equal(  "ID");
        expect(resFilter.Value ).to.equal( "1113");

    });

    it("test Create   2", function () {

        var exp = [["ID", "=", "1113"], 'and', ["IDX", "=", "1112"]];
        var resFilter = FilterHelper.CreateFilterItems(exp);
        expect(resFilter.GroupName).to.equal( 'and');
      //  console.log(resFilter);
        expect(resFilter.Items.length).to.equal(2);
    });

    it("test Create   3", function () {

        var exp = [["ID", "=", "1113"], 'and', ["IDX", "=", "1112"], 'and', ["IDX", "=", "1112"]];
        var resFilter = FilterHelper.CreateFilterItems(exp);
        expect(resFilter.GroupName ).to.equal(  'and');
      //  console.log(resFilter);
        expect(resFilter.Items.length).to.equal( 3);

    });

    it("test Error when Array bed ", function () {

        var ErrorFilter = [["ID", "=", "1113"], 'and', ["IDX", "=", "1112"], 'and'];

        try {
            var resFilter = FilterHelper.CreateFilterItems(ErrorFilter);
            expect(false, "должна быть ошибка");
        } catch (e) {
            console.log(e);

            //expect(e.message).to.startsWith("Не корректный фильтр");
            //   assert.startsWith(e, "Не корректный фильтр");
        }


    });

    it("test Create Arrey  from filter", function () {
        var exp = [["ID", "=", "1113"], 'and', ["IDX", "=", "1112"], 'and', ["IDX", "=", "1112"]];
        var resFilter = FilterHelper.CreateFilterItems(exp);
        var arr = resFilter.GetResultArrey();
      //  console.log(arr);
        expect(exp).to.eql(arr);
    });

    it("test remove elem from filter ", function () {
        var exp = ["ID", "=", "1113"];
        var inp = [["ID", "=", "1113"], 'and', ["IDX", "<", "1112"], 'and', ["IDX", ">", "1412"]];
        var arr = FilterHelper.DeleteFields(inp, "IDX");
        expect(exp).to.eql(arr);
    });

    it("test Add simple in empty filter", function () {
        var oldFilter = [];
        var expFilterFilter = ["IDX", "=", "1112"];
        var condField = 'IDX'
        var condValues = ["1112"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
    });

    it("test Add OR group empty in filter", function () {
        var oldFilter = [];
        var expFilterFilter = [["IDX", "=", "1112"], 'or', ["IDX", "=", "1412"]];
        var condField = 'IDX'
        var condValues = ["1112", "1412"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
    });

    it("test Add OR group in simple filter ", function () {
        var oldFilter = ["ID", "=", "1113"];//старое значение н
        var expFilterFilter = [["ID", "=", "1113"], 'and', [["IDX", "=", "1112"], 'or', ["IDX", "=", "1412"]]];
        var condField = 'IDX'
        var condValues = ["1112", "1412"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
    });

    it("test Add OR group in GROUP filter ", function () {
        var oldFilter = [["ID", "=", "1113"], 'and', ["IDX", "<", "1112"], 'and', ["IDX", ">", "1412"]];
        var expFilterFilter = [["ID", "=", "1113"], 'and', [["IDX", "=", "1112"], 'or', ["IDX", "=", "1412"]]];
        var condField = 'IDX'
        var condValues = ["1112", "1412"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
    });

    it("test Add OR group in GROUP filter 2", function () {
        var oldFilter = [["IDX", "=", "14"], 'or', ["IDX", "=", "412"]];
        var expFilterFilter = [["IDX", "=", "1112"], 'or', ["IDX", "=", "1412"]];
        var condField = 'IDX'
        var condValues = ["1112", "1412"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
    });

    it("test Add OR group in GROUP filter 3", function () {
     
        var expFilterFilter = [["IDX", "=", "1112"], 'or', ["IDX", "=", "1412"]];
        var condField = 'IDX'
        var condValues = ["1112", "1412"]
        var arr = FilterHelper.ApplyInCon(null, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
    });

   it("test Add OR group in GROUP filter 4", function () {
    var oldFilter = [["IDX", "=", "1"], 'or', ["IDX", "=", "2"]];
        var expFilterFilter = [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,[["I", "=", "11"], 'or', ["I", "=", "14"]]];
        var condField = 'I'
        var condValues = ["11", "14"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        expect(expFilterFilter).to.eql(arr);
       // console.log(arr);
    });

     it("test repit filter simpl  ", function () {
        var oldFilter =       [ ["IDX", "=", "2"],'and' ,["I", "=", "11"]];
        var expFilterFilter =  [ ["IDX", "=", "2"],'and' ,["I", "=", "11"]];
        var condField = 'I'
        var condValues = ["11"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
     //   console.dirxml(arr);
        expect(expFilterFilter).to.eql(arr);
      //  console.log(arr);
    }); 

    it("test repit filter simple ", function () {
        var oldFilter =       [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,["I", "=", "11"]];
        var expFilterFilter = [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,["I", "=", "11"]];
        var condField = 'I'
        var condValues = ["11"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
       // console.dirxml(arr);
        expect(expFilterFilter).to.eql(arr);
      //  console.log(arr);
    });

   it("test repit filter ", function () {
        var oldFilter =       [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,[["I", "=", "11"], 'or', ["I", "=", "14"]]];
        var expFilterFilter = [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,[["I", "=", "11"], 'or', ["I", "=", "14"]]];
        var condField = 'I'
        var condValues = ["11", "14"]
        var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
        console.dirxml(arr);
        expect(expFilterFilter).to.eql(arr);
      
    });

    it("test RemoveOldItems ", function () {
        var oldFilter =       [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,[["I", "=", "11"], 'or', ["I", "=", "14"]]];
        var expFilterFilter = [["IDX", "=", "1"], 'or', ["IDX", "=", "2"]];
        var condField = 'I'
        var oldObjectFilter = FilterHelper.CreateFilterItems(oldFilter);
        var arr = FilterHelper.RemoveOldItems(oldObjectFilter, condField);
        var resArr=arr.GetResultArrey();
        console.dirxml(resArr);
        expect(expFilterFilter).to.eql(resArr);
      
    }); 
    
     it("test Normalaze ", function () {
        var oldFilter =       [[["IDX", "=", "1"], 'or', ["IDX", "=", "2"]],'and' ,[]];
        var oldObjectFilter = FilterHelper.CreateFilterItems(oldFilter);

        var expFilter = [["IDX", "=", "1"], 'or', ["IDX", "=", "2"]];
    
        var arr = FilterHelper.Normalaze(oldObjectFilter);
        var resArr=arr.GetResultArrey();
        console.dirxml(resArr);
        expect(expFilter).to.eql(resArr);
      
    });    
});