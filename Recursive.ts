import {Code_Val} from './index'

interface RecursiveConfig{
    p: Array<[string, string[]]>;
    M: number[][];
    end: string[];
    notEnd: string[];
}

class Recursive {
    private i=0;
    private Code_list:Array<Code_Val> = [];
    private stack: Array<string> = [];
    public result = [];
    private static Config:RecursiveConfig=null;

    static init(){
        if(!this.Config){
            const p:Array<[string, string[]]> = [
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
            ]
            const end = ['+', '*', '(', ')', 'i', 'x', 'y', '#']
            const notEnd = ['E', 'E1', 'T', 'T1', 'F']
            const M: number[][] = [
                [-1, -1, 0, -1, 0, 0, 0, -1],
                [1, -1, -1, 2, -1, -1, -1, 2],
                [-1, -1, 3, -1, 3, 3, 3, -1],
                [5, 4, -1, 5, -1, -1, -1, 5],
                [-1, -1, 6, -1, 7, 8, 9, -1],
            ]
            this.Config = {
                p: p,
                end: end,
                notEnd: notEnd,
                M : M
            }
        }
    }

    constructor(Code_list:Array<Code_Val>){
        Recursive.init()
        this.Code_list = Code_list
    }

    private addResult(item: Code_Val):this{
        this.result.push(item.code)
        return this
    }

    private nextIndex():this{
        this.i += 1
        return this
    }
    //规则
    private E(){
        let cur = this.Code_list[this.i]
        if(cur.code=='i'||cur.code=='x'||cur.code=='y'||cur.code=='('){
            this.T()
            this.E1()
        }else{
            throw Error(`ERR IN E->${cur.code}`)
        }
    }

    private T(){
        let cur = this.Code_list[this.i]
        if(cur.code=='i'||cur.code=='x'||cur.code=='y'||cur.code=='('){
            this.F()
            this.T1()
        }else{
            throw Error(`ERR IN T->${cur.code}`)
        }
    }

    private E1(){
        let cur = this.Code_list[this.i]
        if(cur.code == '+'){
            this.nextIndex()
            this.result.push(cur.code)
            this.T()
            this.E1()
        }else if(!(cur.code=='#'||cur.code==')')){
            throw Error(`ERR IN E1->${cur.code}`)
        }
    }

    private T1(){
        let cur = this.Code_list[this.i]
        if(cur.code == '*'){
            this.nextIndex()
            this.result.push(cur.code)
            this.F()
            this.T1()
        }else if(!(cur.code=='#'||cur.code==')'||cur.code=='+')){
            throw Error(`ERR IN T1->${cur.code}`)
        }
    }

    private F(){
        let cur = this.Code_list[this.i]
        if(cur.code == 'i'||cur.code=='x'||cur.code=='y'){
            this.nextIndex()
            this.result.push(cur.code)
        }else if(cur.code =='('){
            this.nextIndex()
            this.result.push(cur.code)
            this.E()
            cur = this.Code_list[this.i]
            if(cur.code == ')'){
                this.nextIndex()
                this.result.push(cur.code)
            }else{
                throw Error(`ERR IN F1->${cur.code}`)
            }
        }else{
            throw Error(`ERR IN F2->${cur.code}`)
        }
    }

    //输出
    getResult(){
    
          console.log(this.result)
         return this.result
    }

    isT(item){
        if(!Recursive.Config){
            throw Error('config not init')
        }
        return Recursive.Config.end.findIndex((val) => val==item)
    }

    isNT(item){
        if(!Recursive.Config){
            throw Error('config not init')
        }
        return Recursive.Config.notEnd.findIndex((val) => val==item)
    }

    run(): this{
        //stack push # & E
        this.stack.push('#')
        this.stack.push('E')
        while(true){
            //not finish
            //pop code 
            //console.log(this.stack)
            const X = this.stack.pop()
            const cur = this.Code_list[this.i]

            if(this.isNT(cur.code)==-1 && this.isT(cur.code) == -1){
                throw Error(`${cur.code} not in T and NT`)
            }
            //if X == '#'
            if(X == '#'){
                //  if X == code
                // else throw error
                if(X == cur.code){
                    console.log('completed')
                    break;
                }else{
                    throw Error(`Err in # --> ${cur.code}`)
                }
            }

             //if X is End
            // X === current addResult().nextIndex()
            //else throw Error


            if(this.isT(X) !== -1){
                if(X == cur.code){
                    this.addResult(cur).nextIndex()
                }else{
                    throw Error(`Err in T --> ${cur.code}`)
                }
            }
            
            if(this.isNT(X) !== -1) {
                //if X is NotEnd
            // get val from M
            // val == -1 throw Error
            // acc val get from P
                let row = this.isNT(X)
                let col = this.isT(cur.code)
                let k = Recursive.Config.M[row][col]
                if(k == -1){
                    throw Error(`Error in Nt -> X:${X} ${cur.code}`)
                }
                let [key, value] = Recursive.Config.p[k]
    
                let arr =  [...value].reverse()
                arr.forEach((item) => {
                    this.stack.push(item)
                })
                
            }
        }
        return this
    }
}

new Recursive([
    {
        "code": "(",
        "val": null
    },
    {
        "code": "i",
        "val": "i"
    },
    {
        "code": "+",
        "val": null
    },
    {
        "code": "i",
        "val": "i"
    },
    {
        "code": ")",
        "val": null
    },
    {
        "code": "*",
        "val": null
    },
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
]).run().getResult()


// let myMap = new Map([
//     ["key1", "value1"],
//     ["key2", "value2"]
// ]); 

// myMap.forEach((value: string, key: string) => {//worked
//     console.log("PRINTING : ", key, value);
// });

