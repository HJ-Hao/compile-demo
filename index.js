"use strict";
exports.__esModule = true;
var Lex = /** @class */ (function () {
    function Lex(codeStr) {
        if (codeStr === void 0) { codeStr = ""; }
        this.i = 0;
        this.result = [];
        this.code = codeStr.split("");
        Lex.initMatrix();
    }
    Lex.initMatrix = function () {
        if (Lex.matrix.length === 0) {
            Lex.matrix = [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0],
                [11, 11],
                [0, 12],
                [0],
                [0, 0, 0, 13],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [11, 11],
                [0, 12],
                [0]
            ];
        }
    };
    Lex.prototype.run = function () {
        console.log('pretreatmenting...');
        this.pretreatment();
        console.log('pretreatment done!');
        var T = { code: null, val: null };
        do {
            while (this.code[this.i] === ' ') {
                this.i += 1;
            }
            T = this.scanner();
            this.result.push(T);
        } while (T.code != '#');
        return this;
    };
    Lex.prototype.getCode_Val = function () {
        var _a = this, i = _a.i, code = _a.code;
        var codeType = code[i];
        if (code[i] >= 'a' && code[i] <= 'z') {
            codeType = 'a';
        }
        if (code[i] >= '0' && code[i] <= '9') {
            codeType = '0';
        }
        return Lex.col_char.findIndex(function (code) { return code == codeType; });
    };
    Lex.searchCode = function (token) {
        var Table = [['begin', '{'], ['end', '}'], ['var', 'a'], ['=', '='],
            ['+', '+'], ['++', '$'], ['*', '*'], [',', ','], [';', ';'], ["(", "("], [")", ")"], ["#", "#"]];
        for (var i = 0; i < Table.length; i++) {
            if (Table[i][0] == token) {
                return Table[i][1];
            }
        }
        var firstChar = token.substring(0, 1);
        if (firstChar >= 'a' && firstChar <= 'z') {
            return 'i';
        }
        else {
            return 'x';
        }
    };
    Lex.prototype.scanner = function () {
        var T = { code: null, val: null };
        var token = '';
        var s = 0, j = this.getCode_Val();
        while (Lex.matrix[s][j]) {
            token += this.code[this.i];
            if (this.code[this.i] == '#')
                break;
            this.i += 1;
            s = Lex.matrix[s][j];
            j = this.getCode_Val();
        }
        var type = Lex.searchCode(token);
        T.code = type;
        if (type == 'x' || type == 'i') {
            T.val = token;
        }
        return T;
    };
    Lex.prototype.pretreatment = function () {
        var code = this.code, prev = '', cur = '', in_comment = false, CommentType = '';
        var filterCode = [];
        code.forEach(function (value) {
            cur = value;
            switch (in_comment) {
                case false:
                    if (prev == '/' && cur == '*') {
                        filterCode.pop();
                        in_comment = true;
                        CommentType = 'mult-line';
                    }
                    else if (prev == '/' && cur == '/') {
                        filterCode.pop();
                        in_comment = true;
                        CommentType = 'line';
                    }
                    else {
                        if (cur == '\t' || cur == '\n') {
                            filterCode.push(' ');
                        }
                        else {
                            filterCode.push(cur.toLowerCase());
                        }
                    }
                    ;
                    break;
                case true:
                    if ((prev == '*' && cur == '/' && CommentType == 'mult-line') ||
                        (prev == '/' && cur == '/' && CommentType == 'line')) {
                        in_comment = false;
                    }
                    ;
                    break;
            }
            prev = cur;
        });
        filterCode.push('#');
        this.code = filterCode;
        return this;
    };
    Lex.prototype.getResult = function () {
        // this.result.forEach((item) => console.log(item))
        console.log(this.result);
        return this.result;
    };
    Lex.matrix = [];
    Lex.col_char = ["a", "0", '=', "+", "*", ",", ";", "(", ")", "#", "\x20"];
    return Lex;
}());
exports["default"] = Lex;
