'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//     var grid = $("#grid").dxDataGrid("instance");

//     grid.option("dataSource", dataSource);
// }
function onRowClick(e) {
    console.log(e);
}

//
function copyToClipboard(str) {
    var el = document.createElement('textarea');
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
}
function onRowClick(e) {
    console.log(e);
}

//��������� ������ ��������
function processFilter(dataGridInstance, filter) {
    if ($.isArray(filter)) {
        if ($.isFunction(filter[0])) {
            filter[0] = getColumnFieldName(dataGridInstance, filter[0]);
        } else {
            for (var i = 0; i < filter.length; i++) {
                processFilter(dataGridInstance, filter[i]);
            }
        }
    }
}

//���������� ������ ���� ����������
function contextMenuPreparing(e) {
    if (e.target == 'header') {
        var dataGrid = $('#grid').dxDataGrid('instance');
        var selectedRows = dataGrid.getSelectedRowsData();
        if (selectedRows.length > 0) {
            var ind = e.column.dataField;
            e.items.push({
                text: "Copy",
                onItemClick: function onItemClick() {
                    var res = '';
                    for (i = 0; i < selectedRows.length; i++) {
                        res += selectedRows[i][ind] + ',';
                    }
                    copyToClipboard(res.trim(','));
                }
            });
        }
    }
}

$(function () {
    var _$$dxDataGrid;

    //��������� ������ ��������
    function processFilter(dataGridInstance, filter) {
        if ($.isArray(filter)) {
            if ($.isFunction(filter[0])) {
                filter[0] = getColumnFieldName(dataGridInstance, filter[0]);
            } else {
                for (var i = 0; i < filter.length; i++) {
                    processFilter(dataGridInstance, filter[i]);
                }
            }
        }
    }

    //����� ����� ������� �� �������
    function getColumnFieldName(dataGridInstance, getter) {
        var column, i;

        if ($.isFunction(getter)) {
            for (i = 0; i < dataGridInstance.columnCount(); i++) {
                column = dataGridInstance.columnOption(i);
                if (column.calculateCellValue.guid === getter.guid) {
                    return column.dataField;
                }
            }
        } else {
            return getter;
        }
    }

    $("#grid").dxDataGrid((_$$dxDataGrid = {
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
        }
    }, _defineProperty(_$$dxDataGrid, 'paging', {
        pageSize: 10
    }), _defineProperty(_$$dxDataGrid, 'pager', {
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20],
        showInfo: true
    }), _defineProperty(_$$dxDataGrid, 'headerFilter', { visible: true }), _defineProperty(_$$dxDataGrid, 'filterPanel', { visible: true }), _defineProperty(_$$dxDataGrid, 'selection', {
        mode: "multiple",
        allowSelectAll: true
    }), _defineProperty(_$$dxDataGrid, 'columns', colunmDescription), _defineProperty(_$$dxDataGrid, 'summary', {
        totalItems: [{
            column: "OrderID",
            summaryType: "count"
        }]
    }), _$$dxDataGrid));
});