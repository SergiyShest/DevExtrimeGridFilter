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


$(function(){
    $("#grid").dxDataGrid({
        dataSource: orders,
        keyExpr: "ID",
        showBorders: true,

        paging: {
            pageSize: 5
        },
        onContextMenuPreparing: contextMenuPreparing,
        focusedRowEnabled: true,
        rowAlternationEnabled: true,
        selection: {
            mode: "single"
        },
        columns: [
            {
                dataField: "ID",
                width: 50,

            },
            {
                dataField: "OrderNumber",
                width: 130,
                caption: "Invoice Number"
            }, {
                dataField: "OrderDate",
                dataType: "date",
                width: 160
            }, 
            "Employee", {
                caption: "City",
                dataField: "CustomerStoreCity"
            }, {
                caption: "State",
                dataField: "CustomerStoreState"  
            }, {
                dataField: "SaleAmount",
                alignment: "right",
                format: "currency"
            }
        ],
        summary: {
            totalItems: [{
                column: "OrderNumber",
                summaryType: "count"
            }, {
                column: "OrderDate",
                summaryType: "min",
                customizeText: function(data) {
                    return "First: " + data.value;//Globalize.formatDate(data.value, { date: "medium" });
                }
            }, {
                column: "SaleAmount",
                summaryType: "sum",
                valueFormat: "currency"
            }]
        }
    });
});