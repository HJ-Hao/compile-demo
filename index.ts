type CommentType = 'line' | 'mult-line' | ''
export interface Code_Val {
    code: string;
    val: string;
}


export default class Lex {
    private code: Array<string>;
    private i: number = 0;
    private result: Array<Code_Val> = [];
    private static matrix = [];
    private static col_char = ["a", "0", '=', "+", "*", ",", ";", "(", ")", "#", "\x20"];
    constructor(codeStr: string = "") {
        this.code = codeStr.split("")
        Lex.initMatrix()
    }

    static initMatrix() {
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
            ]
        }
    }

    run() {
        console.log('pretreatmenting...')
        this.pretreatment()
        console.log('pretreatment done!')
        let T: Code_Val = { code: null, val: null }
        do {
            while (this.code[this.i] === ' ') {
                this.i += 1
            }
            T = this.scanner()
            this.result.push(T)
        } while (T.code != '#')
        return this
    }

    getCode_Val() {
        let { i, code } = this
        let codeType = code[i]
        if (code[i] >= 'a' && code[i] <= 'z') {
            codeType = 'a'
        }
        if (code[i] >= '0' && code[i] <= '9') {
            codeType = '0'
        }
        return Lex.col_char.findIndex((code) => code == codeType)
    }

    static searchCode(token) {
        const Table = [['begin', '{'], ['end', '}'], ['var', 'a'], ['=', '='],
        ['+', '+'], ['++', '$'], ['*', '*'], [',', ','], [';', ';'], ["(", "("], [")", ")"], ["#", "#"]]
        for (let i = 0; i < Table.length; i++) {
            if (Table[i][0] == token) {
                return Table[i][1]
            }
        }
        let firstChar = token.substring(0, 1)
        if (firstChar >= 'a' && firstChar <= 'z') {
            return 'i'
        } else {
            return 'x'
        }
    }

    scanner(): Code_Val {
        let T: Code_Val = { code: null, val: null }
        let token = ''
        let s = 0, j = this.getCode_Val()
        while (Lex.matrix[s][j]) {
            token += this.code[this.i]
            if (this.code[this.i] == '#')
                break;
            this.i += 1
            s = Lex.matrix[s][j]
            j = this.getCode_Val()
        }
        let type = Lex.searchCode(token)
        T.code = type

        if (type == 'x' || type == 'i') {
            T.val = token
        }
        return T
    }

    pretreatment(): this {
        let code = this.code, prev = '', cur = '', in_comment = false, CommentType: CommentType = '';
        let filterCode = []
        code.forEach((value) => {
            cur = value
            switch (in_comment) {
                case false:
                    if (prev == '/' && cur == '*') {
                        filterCode.pop()
                        in_comment = true
                        CommentType = 'mult-line'
                    } else if (prev == '/' && cur == '/') {
                        filterCode.pop()
                        in_comment = true
                        CommentType = 'line'
                    } else {
                        if (cur == '\t' || cur == '\n') {
                            filterCode.push(' ')
                        } else {
                            filterCode.push(cur.toLowerCase())
                        }
                    }; break;
                case true:
                    if (
                        (prev == '*' && cur == '/' && CommentType == 'mult-line') ||
                        (prev == '/' && cur == '/' && CommentType == 'line')
                    ) {
                        in_comment = false
                    }; break
            }
            prev = cur
        })
        filterCode.push('#')
        this.code = filterCode
        return this
    }

    getResult() {
        // this.result.forEach((item) => console.log(item))
        console.log(this.result)
        return this.result
    }
}

