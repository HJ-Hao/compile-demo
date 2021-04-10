"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Recursive = /** @class */ (function () {
    function Recursive(Code_list) {
        this.i = 0;
        this.Code_list = [];
        this.stack = [];
        this.result = [];
        Recursive.init();
        this.Code_list = Code_list;
    }
    Recursive.init = function () {
        if (!this.Config) {
            var p = [
                ['E', ['T', 'E1']],
                ['E1', ['+', 'T', 'E1']],
                ['E1', [null]],
                ['T', ['F', 'T1']],
                ['T1', ['*', 'F', 'T1']],
                ['T1', [null]],
                ['F', ['(', 'E', ')']],
                ['F', ['i']],
                ['F', ['x']],
                ['F', ['y']]
            ];
            var end = ['+', '*', '(', ')', 'i', 'x', 'y', '#'];
            var notEnd = ['E', 'E1', 'T', 'T1', 'F'];
            var M = [
                [-1, -1, 0, -1, 0, 0, 0, -1],
                [1, -1, -1, 2, -1, -1, -1, 2],
                [-1, -1, 3, -1, 3, 3, 3, -1],
                [5, 4, -1, 5, -1, -1, -1, 5],
                [-1, -1, 6, -1, 7, 8, 9, -1],
            ];
            this.Config = {
                p: p,
                end: end,
                notEnd: notEnd,
                M: M
            };
        }
    };
    Recursive.prototype.addResult = function (item) {
        this.result.push(item.code);
        return this;
    };
    Recursive.prototype.nextIndex = function () {
        this.i += 1;
        return this;
    };
    //规则
    Recursive.prototype.E = function () {
        var cur = this.Code_list[this.i];
        if (cur.code == 'i' || cur.code == 'x' || cur.code == 'y' || cur.code == '(') {
            this.T();
            this.E1();
        }
        else {
            throw Error("ERR IN E->" + cur.code);
        }
    };
    Recursive.prototype.T = function () {
        var cur = this.Code_list[this.i];
        if (cur.code == 'i' || cur.code == 'x' || cur.code == 'y' || cur.code == '(') {
            this.F();
            this.T1();
        }
        else {
            throw Error("ERR IN T->" + cur.code);
        }
    };
    Recursive.prototype.E1 = function () {
        var cur = this.Code_list[this.i];
        if (cur.code == '+') {
            this.nextIndex();
            this.result.push(cur.code);
            this.T();
            this.E1();
        }
        else if (!(cur.code == '#' || cur.code == ')')) {
            throw Error("ERR IN E1->" + cur.code);
        }
    };
    Recursive.prototype.T1 = function () {
        var cur = this.Code_list[this.i];
        if (cur.code == '*') {
            this.nextIndex();
            this.result.push(cur.code);
            this.F();
            this.T1();
        }
        else if (!(cur.code == '#' || cur.code == ')' || cur.code == '+')) {
            throw Error("ERR IN T1->" + cur.code);
        }
    };
    Recursive.prototype.F = function () {
        var cur = this.Code_list[this.i];
        if (cur.code == 'i' || cur.code == 'x' || cur.code == 'y') {
            this.nextIndex();
            this.result.push(cur.code);
        }
        else if (cur.code == '(') {
            this.nextIndex();
            this.result.push(cur.code);
            this.E();
            cur = this.Code_list[this.i];
            if (cur.code == ')') {
                this.nextIndex();
                this.result.push(cur.code);
            }
            else {
                throw Error("ERR IN F1->" + cur.code);
            }
        }
        else {
            throw Error("ERR IN F2->" + cur.code);
        }
    };
    //输出
    Recursive.prototype.getResult = function () {
        console.log(this.result);
        return this.result;
    };
    Recursive.prototype.isT = function (item) {
        if (!Recursive.Config) {
            throw Error('config not init');
        }
        return Recursive.Config.end.findIndex(function (val) { return val == item; });
    };
    Recursive.prototype.isNT = function (item) {
        if (!Recursive.Config) {
            throw Error('config not init');
        }
        return Recursive.Config.notEnd.findIndex(function (val) { return val == item; });
    };
    Recursive.prototype.run = function () {
        var _this = this;
        //stack push # & E
        this.stack.push('#');
        this.stack.push('E');
        while (true) {
            //not finish
            //pop code 
            console.log(this.stack);
            var X = this.stack.pop();
            var cur = this.Code_list[this.i];
            if (this.isNT(cur.code) == -1 && this.isT(cur.code) == -1) {
                throw Error(cur.code + " not in T and NT");
            }
            //if X == '#'
            if (X == '#') {
                //  if X == code
                // else throw error
                if (X == cur.code) {
                    console.log('completed');
                    break;
                }
                else {
                    throw Error("Err in # --> " + cur.code);
                }
            }
            //if X is End
            // X === current addResult().nextIndex()
            //else throw Error
            if (this.isT(X) !== -1) {
                if (X == cur.code) {
                    this.addResult(cur).nextIndex();
                }
                else {
                    throw Error("Err in T --> " + cur.code);
                }
            }
            if (this.isNT(X) !== -1) {
                //if X is NotEnd
                // get val from M
                // val == -1 throw Error
                // acc val get from P
                var row = this.isNT(X);
                var col = this.isT(cur.code);
                var k = Recursive.Config.M[row][col];
                if (k == -1) {
                    throw Error("Error in Nt -> X:" + X + " " + cur.code);
                }
                var _a = Recursive.Config.p[k], key = _a[0], value = _a[1];
                var arr = __spreadArrays(value).reverse();
                arr.forEach(function (item) {
                    _this.stack.push(item);
                });
            }
        }
        return this;
    };
    Recursive.Config = null;
    return Recursive;
}());
new Recursive([
    // {
    //     "code": "(",
    //     "val": null
    // },
    // {
    //     "code": "i",
    //     "val": "i"
    // },
    // {
    //     "code": "+",
    //     "val": null
    // },
    // {
    //     "code": "i",
    //     "val": "i"
    // },
    // {
    //     "code": ")",
    //     "val": null
    // },
    // {
    //     "code": "*",
    //     "val": null
    // },
    {
        "code": "i",
        "val": "i"
    },
    {
        "code": "#",
        "val": null
    }
    // {
    //     "code": "i",
    //     "val": "i"
    // },
    // {
    //     "code": "+",
    //     "val": null
    // },
    // {
    //     "code": "i",
    //     "val": "i"
    // },
    // {
    //     'code': '#',
    //     "val": null
    // }
]).run().getResult();
// let myMap = new Map([
//     ["key1", "value1"],
//     ["key2", "value2"]
// ]); 
// myMap.forEach((value: string, key: string) => {//worked
//     console.log("PRINTING : ", key, value);
// });
