
//объект который содержит данные о гриде
function FilterField(dataGridColumn, input, checkBox, condition = '=') {
    this.column = dataGridColumn;
    this.DataField = dataGridColumn.dataField;
    this.DataType = dataGridColumn.dataType;
    this.Condition = condition;
    this.Input = input;
    this.Input.Tag = this;
    this.Input.onkeyup = ValueChanged;
    this.CheckBox = checkBox;
    this.CheckBox.Tag = this;
    this.ApplayFilter = ApplayFilter;//function применить фильтр
    this.ChangeChecked = ChangeChecked;//function изменилась галочка
    function ApplayFilter(collectiveFilter) {
        var val='';
        if (checkBox.checked) {

            val = this.Input.value;
           switch (this.DataType) {
              case 'number': { }       
              break;
              case 'string': { }
              break;
            }
        }
        return FilterHelper.GetFilterFromText(this.DataField, val, collectiveFilter)
    }
    //разделение по значения фильтра по запятым
    function filterCommaSplittedCodition(dataField, inpVal) {
        inpVal = inpVal.replace(/\s/g, '').replace(/,+/g, ',');//remove repeated commas and spaces
        var arr = inpVal.split(',');
        filter = new Array();
        if (arr.length == 1 && arr[0] == '') { } else {
            for (f = 0, i = 0; i < arr.length; i++ , f++) {
                filter[f] = [dataField, "=", arr[i]];
                if (arr.length - 1 > i) {
                    f++;
                    filter[f] = 'or'
                }
            }
        }
        return filter;
    }
    //called from OUTside 
    //change CheckBox value depending on the InputBox.value  
    function ChangeChecked() {
        if (this.Input.value === "") {
            this.CheckBox.checked = false;
        } else {
            this.CheckBox.checked = true;
        }
    }
    //called from InputBox 
    //change CheckBox value depending on the InputBox.value 
    function ValueChanged(e) {
        if (this.value === "") {
            this.Tag.CheckBox.checked = false;
        } else {
            this.Tag.CheckBox.checked = true;
        }
    }

}

function FilterElements(datagrid, fe) {

    this.dataGrid = datagrid;
    this.filtElem = fe;
    this.CreateFilter = CreateFilter;
  //  this.SetCombinedFilter = SetCombinedFilter;
    this.ClearFilter = ClearFilter;
    this.FilterFind = FilterFind;
  //  this.SetOldFilter = SetOldFilter;

    //массив элементов фильтра
    this.FilterElementsArray = new Array();
    //поиск в массиве элементов по имени поля данных
    function FindFilterElementsByDateField(dataField) {
        for (i = 0; i < this.FilterElementsArray.length; i++) {
            if (this.FilterElementsArray[i].DataField == dataField) { return this.FilterElementsArray[i] }
        }
    }
    //Функция создания фильтра
    function CreateFilter(columns) {
        //  var filtElem = document.getElementById(id);
        this.filtElem.childNodes.length = 0;
        //  var dataGridInstance = $("#grid").dxDataGrid("instance");
        oldGridFilter = this.dataGrid.getCombinedFilter();

        const table = document.createElement('table');
        this.filtElem.appendChild(table);

        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];

            if (!column.filter) {
                continue;
            }
            row = document.createElement('tr');
            table.appendChild(row);


            var text = column.caption;
            if (!text) {
                text = column.dataField;
            }
            //label
            textnode = document.createTextNode(text);

            //create  checkbox
            checkBox = document.createElement("input");
            checkBox.setAttribute('type', 'checkbox');

            //input
            input = document.createElement("input")


            if (column.filterType && column.filterType == 'ComboBox') {
                input = document.createElement("select")

            }
            field = new FilterField(column, input, checkBox);

            this.FilterElementsArray.push(field);
            createTableCell(row, textnode);
            createTableCell(row, checkBox);
            createTableCell(row, input);
            //this.FilterElementsArray.push({ DataField: column.dataField, DataType: column.dataType, Input: input, Check: checkBox });
        }
        row = document.createElement('tr');

        table.appendChild(row);
        findButton = document.createElement("button");
        findButton.setAttribute('onclick', 'FilterFind()');
        findButton.setAttribute('class', 'float-right');
        findButton.textContent = 'Найти';
        createTableCell(row);// create 2 empty cell
        createTableCell(row);
        createTableCell(row, findButton);//put button in 3 cell

        //SetCombinedFilter();
        //oldGridFilter = dataGridInstance.getCombinedFilter();
        //if (oldGridFilter != undefined) {
        //SetOldFilter(oldGridFilter);
        //}

        function createTableCell(row, el) {
            td = document.createElement("td");
            if (el != null) { td.appendChild(el); }
            row.appendChild(td);
            return td;
        }
    }

 //   установка готового фильтра
 //   function SetCombinedFilter() {
 //       var oldGridFilter = this.dataGrid.getCombinedFilter();
 //       if (oldGridFilter != undefined) {
 //           SetOldFilter(oldGridFilter);
 //       }
 //   }

    // //установка предыдущего значения фильтра 
    // function SetOldFilter(oldGridFilter) {
    //     if (oldGridFilter === undefined) return;

    //     const first = oldGridFilter[0];
    //     const condition = oldGridFilter[1];
    //     const val = oldGridFilter[2];
    //     if (typeof first === 'string') {//Если это не массив то имя поля то бишь строка
    //         var ff = FindFilterElementsByDateField(first);//Нашел соответствующий ей элемент в массиве
    //         if (ff != undefined) {
    //             ff.Input.Condition = condition;//условие
    //             if (ff.Input.value == "") { ff.Input.value = val; }
    //             else {
    //                 ff.Input.value += ',' + val;
    //             }
    //             ff.ChangeChecked();
    //         } else {
    //             console.error("не найдено свойство " + first);
    //         }
    //     }
    //     else {
    //         oldGridFilter.forEach(element => {
    //             if (typeof element != 'string') { SetOldFilter(element); }
    //         });


    //     }
    // }


    function ClearFilter() {
        for (i = 0; i < this.FilterElementsArray.length; i++) {
            this.FilterElementsArray[i].Input.value = "";
            this.FilterElementsArray[i].ChangeChecked();
        }
    }


    //Find by Filter
    function FilterFind() {
        collectiveFilter = dataGrid.getCombinedFilter();
        for (i = 0; i < this.FilterElementsArray.length; i++) {
            collectiveFilter=   this.FilterElementsArray[i].ApplayFilter(collectiveFilter);
        }
        
        dataGrid.option("filterValue", collectiveFilter);
    }

}
