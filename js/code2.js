

//     var grid = $("#grid").dxDataGrid("instance");

//     grid.option("dataSource", dataSource);
// }
function onRowClick(e) {
    console.log(e);
}
//window.addEventListener('resize', AutoSizeDataGrid);

function AutoSizeDataGrid() {
    var cont = document.getElementById('grid');
    var dataGridRect = cont.getBoundingClientRect();
    var height = document.documentElement.clientHeight - dataGridRect.top - 20;
    $("#grid").dxDataGrid("instance").option("height", height);
   // console.log(cont.offsetHeight);
  
    //  document.querySelector('.width').innerText = document.documentElement.clientWidth;
    //  document.querySelector('.height').innerText = document.documentElement.clientHeight;
}

//
function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


//write time loading data
function contentReady() {
    dataGrid = $('#grid').dxDataGrid('instance');
    console.log(" time loading data");
    console.timeEnd("x");
    AutoSizeDataGrid();
}
function onRowClick(e) {
    console.log(e);
}


 //получение строки фильтров
    function processFilter(dataGridInstance, filter) {
        if ($.isArray(filter)) {
            if ($.isFunction(filter[0])) {
                filter[0] = getColumnFieldName(dataGridInstance, filter[0]);
            }
            else {
                for (var i = 0; i < filter.length; i++) {
                    processFilter(dataGridInstance, filter[i]);
                }
            }
        }
    }

    //поиск имени конолки по фильтру
    function getColumnFieldName(dataGridInstance, getter) {
        var column,
            i;

        if ($.isFunction(getter)) {
            for (i = 0; i < dataGridInstance.columnCount(); i++) {
                column = dataGridInstance.columnOption(i);
                if (column.calculateCellValue.guid === getter.guid) {
                    return column.dataField;
                }
            }
        }
        else {
            return getter;
        }
    }


//добавление пункта меню копировать
function contextMenuPreparing(e) {
    if (e.target == 'header') {
        var dataGrid = $('#grid').dxDataGrid('instance');
        var selectedRows = dataGrid.getSelectedRowsData();
        if (selectedRows.length > 0) {
            var ind = e.column.dataField;
            e.items.push({
                text: "Copy",
                onItemClick: function () {
                    var res = '';
                    for (i = 0; i < selectedRows.length; i++) { res += selectedRows[i][ind] + ',' }
                    copyToClipboard(res.trim(','));
                }
            });
        }
    }
}

$(function () {








   $("#grid").dxDataGrid({
            height: 500,
            remoteOperations: { paging: true, filtering: true, sorting: true, grouping: true, summary: true, groupPaging: true },
       keyExpr: "OrderID",
       searchPanel: { visible: true },
             dataSource: dataEx,
       onRowClick: onRowClick,
       export: {
                enabled: true
       },
            groupPanel: {
                visible: true
            },
       stateStoring: {
                enabled: true,
                type: "localStorage",
                storageKey: "storage1"
            },
            paging: {
                pageSize: 30
            },
            allowColumnResizing:"true",
            columnResizingMode: "widget",
            onContextMenuPreparing: contextMenuPreparing,
            focusedRowEnabled: true,
            rowAlternationEnabled: true,
           onContentReady: contentReady,
             columnAutoWidth: false,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },

            headerFilter: { visible: true },
            filterPanel: { visible: true },
            selection: {
                mode: "multiple",
                allowSelectAll: true
            },
            columns:colunmDescription, 
   });

 var dataGridInstance = $("#grid").dxDataGrid("instance");
 var filter = dataGridInstance.getCombinedFilter();

    $("#filterBuilder").dxFilterBuilder({
        fields: colunmDescription,
        value: filter
    });

    $("#apply").dxButton({
        text: "Apply Filter",
        type: "default",
        onClick: function () {
            var filter = $("#filterBuilder").dxFilterBuilder("instance").option("value");
           
            var dataGridInstance = $("#grid").dxDataGrid("instance");
            var filtergr = dataGridInstance.getCombinedFilter();
            if (filter) {
                var resFilter=[filtergr ,'and',filter]
 
                console.log(resFilter);
                dataGridInstance.option("filterValue", resFilter);
            }
        },
    });
  
    });