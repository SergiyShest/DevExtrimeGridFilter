class BaseFilterItem {

    get isFilterItem() { return this._name; }
    set isFilterItem(val) { this._name = val; }

    get isFilterGroupItem() { return this._namex; }
    set isFilterGroupItem(val) { this._namex; }
}

class FilterItem extends BaseFilterItem {

    get Name() { return this._Name; }
    set Name(val) { this._Name = val; }

    get Condition() { return this._Condition; }
    set Condition(val) { this._Condition = val; }

    get Value() { return this._Value; }
    set Value(val) { this._Value = val; }
    /**
    * @param {string} name имя переменной
    * @param {string} condition условие
    * @param {string} value значение
    */
    constructor(name, condition, value) {
        super();
        this.Name = name;
        this.Condition = condition;
        this.Value = value;
        this.isFilterItem = true;
    }
    GetResultArrey() {
        return [this.Name, this.Condition, this.Value]
    }
}

class FilterGroupItem extends BaseFilterItem {

    get GroupName() { return this._GroupName; }
    set GroupName(val) { this._GroupName = val; }

    get Items() { return this._Items; }
    set Items(val) { this._Items = val; }

    constructor(name) {
        super();
        if (name.length == 0) throw "Имя не может быть пустым"
        this.GroupName = name.toLowerCase().trim();
        this.Items = new Array();
    }
    GetResultArrey() {
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
    Remove(fieldName) {
        var resultArrey = new Array();
        for (var i = 0; i < this.Items.length; i++) {
            var item = this.Items[i];
            if (item.Name == fieldName) continue;//
            if (!item.Name) {//если нет свойтсва имя то это 
                item.Remove(fieldName);
            }
            resultArrey.push(this.Items[i]);
        }
        this.Items = resultArrey;
    }
}

class FilterHelper {

    constructor() { }
    //убирает лишние скобки
    static Normalaze(filtrArr) {
        if ('Items' in filtrArr) {
            if (filtrArr.Items.length == 0) {
                return null;
            }
            if (filtrArr.Items.length == 1) {
                return FilterHelper.Normalaze(filtrArr.Items[0])
            }
        }
        return filtrArr
    }

    //создание объектного представления фильтра(конвертрация массива в коллекцию элементов фильтра)
    static CreateFilterItems(filtrArr) {
        var rezItem = null;
        if (filtrArr != null && 'length' in filtrArr && filtrArr.length > 0) {
            if (FilterHelper.GetName(filtrArr)) {//простое выражение 
                rezItem = new FilterItem(filtrArr[0], filtrArr[1], filtrArr[2]);
            }
            else {
                var ch1 = FilterHelper.CreateFilterItems(filtrArr[0]);
                var condName = filtrArr[1];//имя
                if (typeof (condName) != "string") {
                    throw "Не корректный фильтр (не получилось прочесть имя)";
                }
                rezItem = new FilterGroupItem(condName);//создаю результирующее выражение
                rezItem.Items.push(ch1);//первое выражение
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
    static ApplyInCon(oldFilter, condField, condValues) {
        var fi = null;
        if (typeof oldFilter !== 'undefined') {
            fi = FilterHelper.CreateFilterItems(oldFilter);//преобразование массива в объектный тип
        }
        if (fi != null) {//удаление старых значений
            if (fi.constructor.name == 'FilterItem') {
                if (fi.Name == condField) {
                    fi = null;
                }
            } else {
                fi.Remove(condField);
                fi = FilterHelper.Normalaze(fi);
            }
        }

        if (fi == null) {//старый фильтр пустой или стал пустым после удаления предыдущих значений
            if (condValues.length == 1) {
                fi = new FilterItem(condField, "=", condValues[0]);
            } else {
                fi = CreateOr(condField, condValues);
            }
        } else {
            if (condValues.length > 0)//если есть чего добавлять
            {
                if (condValues.length == 1) {//если добавлять одно значение
                    var filterItem = new FilterItem(condField, "=", condValues[0])//
                    if (fi.constructor.name == 'FilterItem') {//если предыдущее выражение было простым
                        fi = CreateAnd([fi, filterItem]);
                    } else {
                        if (fi.GroupName == 'and') {//если предыдущее выражение было групповым и имя группы 'and'
                            fi.Items.push(filterItem)//добавляю новое выражение в группу
                        } else {
                            if (fi.GroupName == 'or') {
                                fi = CreateAnd([fi, newOr]);
                            } else { 
                                throw "notImplimented " + fi.GroupName;
                            }
                        }
                    }
                } else {
                    var newOr = CreateOr(condField, condValues)
                    if (fi.constructor.name == 'FilterItem') {//если предыдущее выражение было простым
                        fi = CreateAnd([fi, newOr]);
                    } else

                        if (fi.GroupName == 'and') {//если предыдущее выражение было групповым и имя группы 'and'

                            fi.Items.push(newOr);
                        }
                        else {
                            throw "notImplimented 2 ==" + fi.GroupName;
                        }
                }
            }
        }
        fi = FilterHelper.Normalaze(fi);
        if (fi == null) return null;
        return fi.GetResultArrey();

        function CreateOr(condField, condValues) {
            var newOr = new FilterGroupItem('or')
            for (var i = 0; i < condValues.length; i++) {
                var status = condValues[i];
                var filter = new FilterItem(condField, "=", status)
                newOr.Items.push(filter)
            }
            return newOr;
        }
        function CreateAnd(items) {
            var newfi = new FilterGroupItem('and')//создаю результирующую группу 'and'
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
    static GetName(filterArr) {
        // var arrType = typeof filterArr;
        if (typeof (filterArr) !== "undefined" && typeof (filterArr.length) !== "undefined")
            if (filterArr.length == 3 && typeof filterArr[0] == 'string') {
                return filterArr[0];
            }
        return null;
    }

    static DeleteFields(filterArr, fieldName) {
        var fi = FilterHelper.CreateFilterItems(filterArr);
        if (fi.Name == fieldName) {
            return new Array();
        }
        fi.Remove(fieldName);
        fi = FilterHelper.Normalaze(fi)
        return fi.GetResultArrey();
    }

}