class BaseFilterItem {
    isFilterItem;
    isFilterConditionItem;
}


class FilterItem extends BaseFilterItem {

    Name;
    Condition;
    Value;
    /**
    * @param {string} name имя переменной
    * @param {string} condition условие
    * @param {string} value значение
    */
    constructor(name, condition, value) {
        this.Name = name;
        this.Condition = condition;
        this.Value = value;
        this.isFilterItem = true;
    }
    GetResultArrey() {
        return [this.Name, this.Condition, this.Value]
    }
}

class FilterConditionItem extends BaseFilterItem {

    GroupName;
    Items;
    constructor(name) {
        if (name.length == 0) throw "Имя не может быть пустым"
        this.GroupName = name;
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
    //убирает лишние скобки
    static Normalaze(filtrArr) {
        if ('Items' in filtrArr && filtrArr.Items.length == 1) {
            return FilterHelper.Normalaze(filtrArr.Items[0])
        }
        return filtrArr
    }
    //создание объектного представления фильтра(конвертрация массива в коллекцию элементов фильтра)
    static CreateFilterItems(filtrArr) {
        var rezItem;
        if (FilterHelper.GetName(filtrArr)) {//простое выражение 
            rezItem = new FilterItem(filtrArr[0], filtrArr[1], filtrArr[2]);
        }
        else {
            var ch1 = FilterHelper.CreateFilterItems(filtrArr[0]);
            var condName = filtrArr[1];//имя
            if (typeof (condName) != "string") {
                throw "Не корректный фильтр (не получилось прочесть имя)";
            }
            rezItem = new FilterConditionItem(condName);//добавляем имя
            rezItem.Items.push(ch1);//первое выражение
            for (var i = 1; i < filtrArr.length; i = i + 2) {
                if (filtrArr.length < i + 2) throw "Не корректный фильтр (длина)";
                if (condName !== filtrArr[i]) throw "Не корректный фильтр. В одном выражении разные операторы(" + condName + " и " + filtrArr[i];
                var ch2 = FilterHelper.CreateFilterItems(filtrArr[i + 1]);
                rezItem.Items.push(ch2);
            }
        }
        return rezItem;
    }

    /*ссс*
     * @param {Array<string|Array>} oldFilter стараый массив фильтров грида 
     * @param {string} condField Имя поле
     * @param {Array<string>} condValues Массив значений
     * @return {Array<string|Array>} Новый массив фильтров грида
    */
    static ApplyInCon(oldFilter, condField, condValues) {

        var fi = FilterHelper.CreateFilterItems(oldFilter);//преобразование массива в объектный тип
        fi.Remove(condField);//удаление старых значений
        if (condValues.length > 0)//если есть чего добавлять
        {
            if (condValues.length == 1) {//если добавлять одно значение
                var filter = new FilterItem(condField, "=", status)
                if (typeof fi == 'FilterItem') {
                    var newfi = new FilterConditionItem('And')
                    newfi.Items.push(fi);
                    newfi.Items.push(filter);
                } else {
                    if (fi.Condition == 'And') {
                        fi.Items.push(filter)
                    } else {
                        throw new "notImplimented";
                    }
                }
            } else {
                if (fi.Condition == 'And') {
                    var newOr = new FilterConditionItem('Or')
                    for (var i = 0; i < condValues.length; i++) {
                        var status = statusAr[i];
                        var filter = new FilterItem(condField, "=", status)
                        fi.Items.push(filter)
                    }
                    fi.Condition.push(newOr);
                }
                else {
                    throw new "notImplimented";
                }
            }
        }
        return fi.GetResultArrey();

    }

    /**
        @param { Array<string | Array>} filterArr массив параметров
    */
    static GetName(filterArr) {
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