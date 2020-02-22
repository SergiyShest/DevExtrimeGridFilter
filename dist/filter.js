'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseFilterItem = function () {
    function BaseFilterItem() {
        _classCallCheck(this, BaseFilterItem);
    }

    _createClass(BaseFilterItem, [{
        key: 'isFilterItem',
        get: function get() {
            return this._name;
        },
        set: function set(val) {
            this._name = val;
        }
    }, {
        key: 'isFilterGroupItem',
        get: function get() {
            return this._namex;
        },
        set: function set(val) {
            this._namex;
        }
    }]);

    return BaseFilterItem;
}();

var FilterItem = function (_BaseFilterItem) {
    _inherits(FilterItem, _BaseFilterItem);

    _createClass(FilterItem, [{
        key: 'Name',
        get: function get() {
            return this._Name;
        },
        set: function set(val) {
            this._Name = val;
        }
    }, {
        key: 'Condition',
        get: function get() {
            return this._Condition;
        },
        set: function set(val) {
            this._Condition = val;
        }
    }, {
        key: 'Value',
        get: function get() {
            return this._Value;
        },
        set: function set(val) {
            this._Value = val;
        }
        /**
        * @param {string} name имя переменной
        * @param {string} condition условие
        * @param {string} value значение
        */

    }]);

    function FilterItem(name, condition, value) {
        _classCallCheck(this, FilterItem);

        var _this = _possibleConstructorReturn(this, (FilterItem.__proto__ || Object.getPrototypeOf(FilterItem)).call(this));

        _this.Name = name;
        _this.Condition = condition;
        _this.Value = value;
        _this.isFilterItem = true;
        return _this;
    }

    _createClass(FilterItem, [{
        key: 'GetResultArrey',
        value: function GetResultArrey() {
            return [this.Name, this.Condition, this.Value];
        }
    }, {
        key: 'GetString',
        value: function GetString() {
            return this.Name + this.Condition + this.Value;
        }
    }]);

    return FilterItem;
}(BaseFilterItem);

var FilterGroupItem = function (_BaseFilterItem2) {
    _inherits(FilterGroupItem, _BaseFilterItem2);

    _createClass(FilterGroupItem, [{
        key: 'GroupName',
        get: function get() {
            return this._GroupName;
        },
        set: function set(val) {
            this._GroupName = val;
        }
    }, {
        key: 'Items',
        get: function get() {
            return this._Items;
        },
        set: function set(val) {
            this._Items = val;
        }
    }]);

    function FilterGroupItem(name) {
        _classCallCheck(this, FilterGroupItem);

        var _this2 = _possibleConstructorReturn(this, (FilterGroupItem.__proto__ || Object.getPrototypeOf(FilterGroupItem)).call(this));

        if (name.length == 0) throw "Имя не может быть пустым";
        _this2.GroupName = name.toLowerCase().trim();
        _this2.Items = new Array();
        return _this2;
    }

    _createClass(FilterGroupItem, [{
        key: 'GetResultArrey',
        value: function GetResultArrey() {
            var resultArrey = new Array();
            for (var i = 0; i < this.Items.length; i++) {
                if (resultArrey.length > 0) {
                    resultArrey.push(this.GroupName);
                }
                resultArrey.push(this.Items[i].GetResultArrey());
            }
            return resultArrey;
        }
        //удаляет из  this.Items объекты с именем fieldName

    }, {
        key: 'Remove',
        value: function Remove(fieldName) {
            var resultArrey = new Array();
            for (var i = 0; i < this.Items.length; i++) {
                var item = this.Items[i];
                if (item.Name == fieldName) continue; //
                if (!item.Name) {
                    //если нет свойтсва имя то это 
                    item.Remove(fieldName);
                }
                resultArrey.push(this.Items[i]);
            }
            this.Items = resultArrey;
        }
    }]);

    return FilterGroupItem;
}(BaseFilterItem);

var FilterHelper = function () {
    function FilterHelper() {
        _classCallCheck(this, FilterHelper);
    }
    //убирает лишние скобки


    _createClass(FilterHelper, null, [{
        key: 'Normalaze',
        value: function Normalaze(filtrArr) {
            if ('Items' in filtrArr) {
                if (filtrArr.Items.length == 0) {
                    return null;
                }
                if (filtrArr.Items.length == 1) {
                    return FilterHelper.Normalaze(filtrArr.Items[0]);
                }
            }
            return filtrArr;
        }

        //создание объектного представления фильтра(конвертрация массива в коллекцию элементов фильтра)

    }, {
        key: 'CreateFilterItems',
        value: function CreateFilterItems(filtrArr) {
            if (!filtrArr) filtrArr = [];
            var rezItem = null;
            if (filtrArr != null && 'length' in filtrArr && filtrArr.length > 0) {
                if (FilterHelper.GetName(filtrArr)) {
                    //простое выражение 
                    rezItem = new FilterItem(filtrArr[0], filtrArr[1], filtrArr[2]);
                } else {
                    var ch1 = FilterHelper.CreateFilterItems(filtrArr[0]);
                    var condName = filtrArr[1]; //имя
                    if (typeof condName != "string") {
                        throw "Не корректный фильтр (не получилось прочесть имя)";
                    }
                    rezItem = new FilterGroupItem(condName); //создаю результирующее выражение
                    rezItem.Items.push(ch1); //первое выражение
                    for (var i = 1; i < filtrArr.length; i = i + 2) {
                        if (filtrArr.length < i + 2) throw "Не корректный фильтр (длина)";
                        if (condName !== filtrArr[i]) throw "Не корректный фильтр. В одном выражении разные операторы(" + condName + " и " + filtrArr[i];
                        var ch2 = FilterHelper.CreateFilterItems(filtrArr[i + 1]);
                        rezItem.Items.push(ch2);
                    }
                }
            }
            return rezItem;
        }

        /*ссс*
         * @param {Array<string|Array>} oldFilter стараый массив фильтров грида 
         * @param {string} condField Имя поля
         * @param {Array<string>} condValues Массив значений
         * @return {Array<string|Array>} Новый массив фильтров грида
        */

    }, {
        key: 'ApplyInCon',
        value: function ApplyInCon(oldFilter, condField, condValues) {
            var fi = null;
            if (typeof oldFilter !== 'undefined') {
                fi = FilterHelper.CreateFilterItems(oldFilter); //преобразование массива в объектный тип
            }
            if (fi != null) {
                //удаление старых значений
                if (fi.constructor.name == 'FilterItem') {
                    if (fi.Name == condField) {
                        fi = null;
                    }
                } else {
                    fi.Remove(condField);
                    fi = FilterHelper.Normalaze(fi);
                }
            }

            if (fi == null) {
                //старый фильтр пустой или стал пустым после удаления предыдущих значений
                if (condValues.length == 1) {
                    fi = new FilterItem(condField, "=", condValues[0]);
                } else {
                    fi = CreateOr(condField, condValues);
                }
            } else {
                if (condValues.length > 0) //если есть чего добавлять
                    {
                        if (condValues.length == 1) {
                            //если добавлять одно значение
                            var filterItem = new FilterItem(condField, "=", condValues[0]); //
                            if (fi.constructor.name == 'FilterItem') {
                                //если предыдущее выражение было простым
                                fi = CreateAnd([fi, filterItem]);
                            } else {
                                if (fi.GroupName == 'and') {
                                    //если предыдущее выражение было групповым и имя группы 'and'
                                    fi.Items.push(filterItem); //добавляю новое выражение в группу
                                } else {
                                    if (fi.GroupName == 'or') {
                                        fi = CreateAnd([fi, newOr]);
                                    } else {
                                        throw "notImplimented " + fi.GroupName;
                                    }
                                }
                            }
                        } else {
                            var newOr = CreateOr(condField, condValues);
                            if (fi.constructor.name == 'FilterItem') {
                                //если предыдущее выражение было простым
                                fi = CreateAnd([fi, newOr]);
                            } else if (fi.GroupName == 'and') {
                                //если предыдущее выражение было групповым и имя группы 'and'

                                fi.Items.push(newOr);
                            } else {
                                throw "notImplimented 2 ==" + fi.GroupName;
                            }
                        }
                    }
            }
            fi = FilterHelper.Normalaze(fi);
            if (fi == null) return null;
            return fi.GetResultArrey();

            function CreateOr(condFieldName, condValues) {
                var newOr = new FilterGroupItem('or');
                for (var i = 0; i < condValues.length; i++) {
                    var val = condValues[i];
                    var filter = new FilterItem(condFieldName, "=", val);
                    newOr.Items.push(filter);
                }
                return newOr;
            }
            function CreateAnd(items) {
                var newfi = new FilterGroupItem('and'); //создаю результирующую группу 'and'
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    newfi.Items.push(item);
                }
                return newfi;
            }
        }

        /**
            @param { Array<string | Array>} filterArr массив параметров
        */

    }, {
        key: 'GetName',
        value: function GetName(filterArr) {
            // var arrType = typeof filterArr;
            if (typeof filterArr !== "undefined" && typeof filterArr.length !== "undefined") if (filterArr.length == 3 && typeof filterArr[0] == 'string') {
                return filterArr[0];
            }
            return null;
        }
    }, {
        key: 'DeleteFields',
        value: function DeleteFields(filterArr, fieldName) {
            var fi = FilterHelper.CreateFilterItems(filterArr);
            if (fi.Name == fieldName) {
                return new Array();
            }
            fi.Remove(fieldName);
            fi = FilterHelper.Normalaze(fi);
            return fi.GetResultArrey();
        }
    }]);

    return FilterHelper;
}();

var FilterElement = function () {
    _createClass(FilterElement, [{
        key: 'IsChecked',
        get: function get() {
            return this._isChecked;
        },
        set: function set(val) {
            this._isChecked = val;
        }
    }, {
        key: 'Caption',
        get: function get() {
            return this._caption;
        },
        set: function set(val) {
            this._caption = val;
        }
    }, {
        key: 'DataField',
        get: function get() {
            return this._dataField;
        },
        set: function set(val) {
            this._dataField = val;
        }
    }, {
        key: 'Value',
        get: function get() {
            return this._value;
        },
        set: function set(val) {
            this._value = val;
        }
    }]);

    function FilterElement(column) {
        _classCallCheck(this, FilterElement);

        if (column.caption) {
            this.Caption = column.caption;
        }
        if (column.dataField) {
            this.DataField = column.dataField;
        }
    }

    _createClass(FilterElement, [{
        key: 'setValue',
        value: function setValue(filterArr) {
            array.forEach(function (element) {
                arr;
            });
        }
    }]);

    return FilterElement;
}();