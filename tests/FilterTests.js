describe("FilterHelper Tests", function () {
    // var  [[["ID", "=", "1112"],'or',["ID", "=", "1112"]] ,'and', ["x","=","99"] ]

    it("test Create  simple", function () {

        var exp = ["ID", "=", "1113"]
        var resFilter = FilterHelper.CreateFilterItems(exp);
        expect(resFilter.Condition == '=');
        expect(resFilter.Name == "ID");
        expect(resFilter.Value == "1113");
    });

    it("test Create   2", function () {

        var exp = [["ID", "=", "1113"], 'and', ["IDX", "=", "1112"]];
        var resFilter = FilterHelper.CreateFilterItems(exp);
        expect(resFilter.Name == 'and');
        console.log(resFilter);
        expect(resFilter.Items.length == 2);
    });

    it("test Create   3", function () {

        var exp = [["ID", "=", "1113"], 'and', ["IDX", "=", "1112"], 'and', ["IDX", "=", "1112"]];
        var resFilter = FilterHelper.CreateFilterItems(exp);
        expect(resFilter.Name == 'and');
        console.log(resFilter);
        expect(resFilter.Items.length == 3);

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
         console.log(arr);
         expect(exp).to.eql(arr);
    });

    it("test remove elem from filter ", function () {
        var exp = ["ID", "=", "1113"];
        var inp = [["ID", "=", "1113"], 'and', ["IDX", "<", "1112"], 'and', ["IDX", ">", "1412"]];
        var arr= FilterHelper.DeleteFields(inp, "IDX");
         expect(exp).to.eql(arr);
        });




it("test Add(change) cond filter ", function () {
    var oldFilter = [["ID", "=", "1113"], 'and', ["IDX", "<", "1112"], 'and', ["IDX", ">", "1412"]];
    var expFilterFilter = [["ID", "=", "1113"], 'and', [["IDX", "=", "1112"], 'or', ["IDX", "=", "1412"]]];
    var condField = 'IDX'
    var condValues = ["1112", "1412"]
    var arr = FilterHelper.ApplyInCon(oldFilter, condField, condValues);
    expect(expFilterFilter).to.eql(arr);
        });
});