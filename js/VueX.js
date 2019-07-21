

//     var grid = $("#grid").dxDataGrid("instance");

//     grid.option("dataSource", dataSource);
// }
function onRowClick(e) {
    console.log(e);
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
    console.log(" time loading data")
    console.timeEnd("x");
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

        onContextMenuPreparing: contextMenuPreparing,
        focusedRowEnabled: true,
        rowAlternationEnabled: true,

        columnAutoWidth: false,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20],
            showInfo: true
        },
        headerFilter: { visible: true },
        filterPanel: { visible: true },
        selection: {
            mode: "multiple",
            allowSelectAll: true
        },
        columns: colunmDescription,
        summary: {
            totalItems: [{
                    column: "OrderID",
                    summaryType: "count"
            }] 
        }
    });


});