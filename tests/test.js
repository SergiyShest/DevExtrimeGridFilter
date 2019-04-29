describe("FilterTests", function () {

    it("SimpleFilter", function () {
        ClearFilter();
        var oldGridFilter = ["ID", "=", "1112"]
        SetOldFilter(oldGridFilter);
        var fi = FindByDateField("ID");

        assert.isTrue("1112" === fi.Input.value);
    });

    it("and filter", function () {
        ClearFilter();
        var oldGridFilter = [["ID", "=", "1112"], 'and', ["SaleAmount", "=", "13"]];
        SetOldFilter(oldGridFilter);
        var fi = FindByDateField("ID");
         var fi2 = FindByDateField("SaleAmount");
       F1="1112" === fi.Input.value;
       F2="13" === fi2.Input.value;
        assert.isTrue(F1 && F2);
       

    });

    it("OR filter", function () {
        ClearFilter();
        var oldGridFilter = [["ID", "=", "1112"], 'or', ["ID", "=", "13"]];
        SetOldFilter(oldGridFilter);
        var fi = FindByDateField("ID");
       
      const F1="1112,13" === fi.Input.value;
    
        assert.isTrue(F1);
       

    });

    it("full filter", function () {
        ClearFilter();
        var oldGridFilter = [[["ID", "=", "1112"], 'or', ["ID", "=", "13"]], 
        'and', ["SaleAmount", "=", "17"]
    ];
        SetOldFilter(oldGridFilter);
 
        var fi = FindByDateField("ID");
        var fi2 = FindByDateField("SaleAmount");
      F1="1112,13" === fi.Input.value;
      F2="17" === fi2.Input.value;
      assert.isTrue(F1 && F2);
    });

    it("checkBox", function () {
        ClearFilter();
        
        var fi = FindByDateField("ID");
        checkBefore=fi.CheckBox.checked;
        var oldGridFilter = ["ID", "=", "1112"]
        SetOldFilter(oldGridFilter);
        checkAfter=fi.CheckBox.checked;
      
         assert.isTrue(!checkBefore && checkAfter);
    });
});