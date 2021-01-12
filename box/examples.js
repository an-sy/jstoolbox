const examples = () => mainBody.innerHTML = `
<pre><code class = "javascript" >export { DataFlowVariable, Scheduler }

const DataFlowVariable = howto => {
    let value = undefined;
    return () => {
        if (value !== undefined) { return value }
        value = howto();
        return value;
    }
};

// execute asynchronous tasks in strict sequence
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( (ok, reject) => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    return {
        add: add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};</pre></code>


<pre><code class = "javascript" >
export {Observable, ObservableList}

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};
</pre></code>

<pre><code class = "javascript" >// "hand-made" object abstraction

export { Player }

const Player = (name) => {   // note that name is immutable!
    let fallbackIndex = 0;   // local function scope is safe
    let progressIndex = 0;
    return {
        getFallbackIndex: () => fallbackIndex,
        getProgressIndex: () => progressIndex,
        proceed:      stride => progressIndex += stride,
        fallback:         () => progressIndex = fallbackIndex,
        turn:             () => fallbackIndex = progressIndex
    }
};

function start() {
    const fields = document.getElementById('fields');

    for (let i = 0; i < 100; i++) {
        let field = document.createElement("DIV");
        field.setAttribute("ID", "FIELD-"+i);
        field.innerText = " ";
        fields.appendChild(field);
    }
    display();
}

function dice() {
    let stride = Math.round(1 + Math.random() * 5);
    document.getElementById('dice').innerText = ""+ stride;
    if (stride === 3) {
        player.fallback();
    } else {
        player.proceed(stride);
    }
    display();
}

function turn() {
    player.turn();
    display();
}

function display() {
    for (let i = 0; i < 100; i++) {
        let field = document.getElementById("FIELD-"+i);
        field.setAttribute("CLASS", "field");
    }
    let fallbackfield = document.getElementById("FIELD-"+ player.getFallbackIndex());
    fallbackfield.setAttribute("CLASS", "field fallback");
    let progressfield = document.getElementById("FIELD-"+ player.getProgressIndex());
    progressfield.setAttribute("CLASS", "field progress");
}

let player = Player("One");
</pre></code>

<pre><code class = "javascript" >// church encoding of the lambda calculus in JavaScript

export {
    id, beta, konst, flip, kite, cmp, cmp2,
    T, F, and, not, beq, or, xor, imp, rec,
    n0, n1, n2, n3, n4, n5,
    succ, plus, mult, pow, isZero, church,
    pair, fst, snd,
    either, Left, Right,
    Nothing, Just, maybe, bindMaybe,
    curry, uncurry
}

// function id(x) { return x; }, \x.x
const id = x => x;

// function application, beta reduction
// const beta = f => id(f);
// const beta = f => f;
// beta.toString = () => "beta";
const beta = f => x => f(x);

// M, const, first, id2, true
const konst = x => y => x;

const flip = f => x => y => f(y)(x);

// const flip = f => g => x => f(x)(g);  // f(x)(g(x)) // konst(g)(x) -> g
// const flip = f => g      => s(f)(konst(g));         // C = \fg.S(f)(Kg)
// const flip = f => g => x => s(f)(konst(g))(x);      // def of S
// const flip = f => g => x => f(x)(konst(g)(x));
// const flip = f => g => x => f(x)(g); // qed.

// Kite
// kite = x => y => y;
// kite = x => y => konst(id)(x)(y);
// const kite = konst(id);
// const kite = x => y => flip(konst)(x)(y);
const kite = flip(konst);

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));
// const cmp = f => g      => S(konst(f))(g);
// const cmp = f => g => x => S(konst(f))(g)(x);
// const cmp = f => g => x => (konst(f)(x))(g(x));
// const cmp = f => g => x => (f)(g(x));
// const cmp = f => g => x => f(g(x)); // qed.

//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);

// ---- boolean logic

const T   = konst;
const not = flip;
const F   = not(T);             //const F = kite;

const and = x => y => x(y)(x);
// const and = f => g => f(g)(f);
// const and = f => g => S(f)(konst(f))(g)  // \fg.Sf(Kf)g

// const or  = x => y => x(x)(y);
const or  = x =>  x(x);
// const or  = M;

const beq = x => y => x(y)(not(y));
//const beq = x => y => S(x)(not)(y);
//const beq = x => S(x)(not);   // S(x)(K)

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;

//const imp = x => y => x (y) (T);
//const imp = x => y => x (y) ( not(x));
// const imp = x => y => flip(x) (not(x)) (y) ;
const imp = x => flip(x) (not(x)) ;
// const imp = S(not)(not) ;
//const imp = S(C)(C) ;


// ----

// loop = loop
// loop = (\x. x x) (\x. x x)
// loop = ( x => x(x) ) ( x => x(x) )
// this is self-application applied to self-application, i.e. M(M)
// which we already checked to be endlessly recursive

// rec = f => f (rec (f)) // cannot work, since rec(f) appears in argument position

// define loop in terms of rec:
// const rec = f => f (rec (f));  // y
// const rec = f => M ( x => f(M(x)) )     // s/o

// this works:
// rec :: (a -> a) -> a
const rec  = f => f ( n => rec(f)(n)  ) ;

// ---------- Numbers

const n0 = f => x => x;         // same as konst, F
const n1 = f => x => f(x);      // same as beta, once, lazy
const n2 = f => x => f(f(x));           // twice
const n3 = f => x => f(f(f(x)));        // thrice

//const succ = cn => ( f => x => f( cn(f)(x) ) );
//const succ = cn => ( f => x => f( (cn(f)) (x) ) );
//const succ = cn => ( f => x => cmp(f) (cn(f)) (x)  );
const succ = cn => ( f => cmp(f) (cn(f)) );
//const succ = cn => ( f => S(cmp)(cn)(f) );
//const succ = cn => S(B)(cn);

const n4 = succ(n3);
const n5 = succ(n4);

// addition + n is the nth successor

//const plus = cn1 => cn2 => f => x =>  cn2(succ)(cn1)(f)(x)  ; // eta
const plus = cn1 => cn2 =>  cn2(succ)(cn1)  ;

// multiplication is repeated plus
// const mult = cn1 => cn2 => cn2 (plus(cn1)) (n0) ;
// rolled out example 2 * 3
// const mult = cn1 => cn2 => f => x =>  f f f   f f f   x
// const mult = cn1 => cn2 => f => x =>  cn1 (cn2 (f))  (x); // eta
// const mult = cn1 => cn2 => f =>  cn1 (cn2 (f));  // introduce composition
// const mult = cn1 => cn2 => cmp(cn1)(cn2); // eta
// const mult = cn1 => cmp(cn1); // eta
const mult = cmp;
//const mult = B;

// power is repeated multiplication
// 2 ^ 3 = (2* (2* (2*(1))) ,
// const pow = cn1 => cn2 => cn2 (mult(cn1)) (n1);
// rolled out = f f ( f f ( f f x ))
// const pow = cn1 => cn2 => f => x => cn2 (cn1)(f)(x); // eta
const pow = cn1 => cn2 => cn2 (cn1) ;
// const pow = cn1 => cn2 => beta (cn2) (cn1) ;
// const pow = cn1 => cn2 => flip (beta) (cn1) (cn2) ;
// const pow = flip (beta) ;
// const pow = not(id);       // x^0 = 1

const isZero = cn =>  cn (konst(F)) (T);

const church = n => n === 0 ? n0 : succ(church(n-1)); // church numeral for n

// ----------- Data structures

// prototypical Product Type: pair
const pair = a => b => f => f(a)(b);

const fst = p => p(T); // pick first  element from pair
const snd = p => p(F); // pick second element from pair

// prototypical Sum Type: either

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = e => f => g => e (f) (g);

// maybe as a sum type

// const Nothing  = ()=> f => g => f ;        // f is used as a value
// const Just     = x => f => g => g (x);
// const maybe    = m => f => g => m (f) (g);

const Nothing  = Left() ;        // f is used as a value
const Just     = Right  ;
// const maybe    = either ;     // convenience: caller does not need to repeat "konst"
const maybe    = m => f => either (m) (konst(f)) ;

//    bindMaybe :: m a -> (a -> m b) -> mb
const bindMaybe = ma => f => maybe (ma) (ma) (f);

// ---- curry

// curry :: ((a,b)->c) -> a -> b -> c
const curry = f => x => y => f(x,y);

// uncurry :: ( a -> b -> c) -> ((a,b) -> c)
const uncurry = f => (x,y) => f(x)(y);

</pre></code>

<pre><code class = "javascript" >// usual programming concepts

export { clock_neutral, clock_op, clock, mod, mfold, foldMap, mfoldMap, a2aMonoid }


// monoid

// integers are a monoid with plus and 0
// integers are a monoid with times and 1
// strings are a monoid with concatenation and ""


// clocks are a monoid with +% size and size

// motivating example
const clock_neutral = 12;
const clock_op = clockx => clocky =>
    (clockx + clocky) > 12 ?
    (clockx + clocky) - 12 :
    (clockx + clocky);

// extract (parameter), generalize
const clock = size => {
    const neutral = size;
    const op = cx => cy => (cx + cy) > size ?
        op(0)(cx + cy - size) :
        cx + cy;
    return {
        neutral: neutral,
        op: op
    }
};

const mod = modul => {
    const neutral = 0;
    const op = cx => cy => (cx + cy) % modul;
    return {
        neutral: neutral,
        op: op
    }
};

// generalized monoidal fold

const mfold = monoid => array =>
    array.reduce(
        (accu, item) => monoid.op(accu)(item),
        monoid.neutral);


// a usual function type over (a -> a) allows for monoidal composition

const a2aMonoid = a2a => {
    const apply = x => a2a(x);
    const neutral = x => x; // id
    const op = f => g => x => f(g(x));
    return {
        apply: apply,
        neutral: neutral,
        op: op
    }
};

// generalizing mfold and map into foldmap

const foldMap = monoid => mapFn => array => mfold(monoid)(array.map(mapFn));

// for monoids, the mapFn is always its "apply"

const mfoldMap = monoid => array => foldMap(monoid)(m => m.apply)(array);

// ----------- functor laws:
// identity    : x.map(id) = x
// composition : x.map( cmp(f)(g) ) = cmp( x.map(f) )( x.map(g) )</pre></code>

<pre><code class = "javascript" >
export { startExcel, refresh, numValue }
import { DataFlowVariable } from "../dataflow/dataflow.js";

const Formulae =  {
    A1: '$(B3) - $(B2)', B1: '1',              C1: '$(A1) + $(B1)',
    A2: '2',             B2: '2',              C2: '$(A2) + $(B2)',
    A3: '$(A1) + $(A2)', B3: '$(B1) + $(B2)',  C3: '$(C1) + $(C2)',
};

const DFVs = {}; // lazy cache for the backing data flow variables

const cols = ["A","B","C"];
const rows = ["1","2","3"];

function startExcel() {
    const dataContainer = document.getElementById('dataContainer');
    fillTable(dataContainer);
}

function fillTable(container) {
    rows.forEach( row => {
        let tr = document.createElement("TR");
        cols.forEach( col => {
            let td     = document.createElement("TD");
            let input  = document.createElement("INPUT");
            let cellid = "" + col + row;
            input.setAttribute("VALUE", Formulae[cellid]);
            input.setAttribute("ID", cellid);
            DFVs[cellid] = df(input);

            input.onchange = evt => {
                Formulae[cellid] = input.value;
                DFVs[cellid] = df(input);
                refresh();
            };
            input.onclick  = evt => input.value = Formulae[cellid] ;

            td.appendChild(input);
            tr.appendChild(td);
        });
        container.appendChild(tr);
    });
}

function refresh() {
    cols.forEach( col => {
        rows.forEach( row => {
            let cellid  = "" + col + row;
            let input   = document.getElementById(cellid);
            input.value = numValue(cellid);
        });
    });
}

// get the numerical value of an input element's value attribute
const numValue = cellID => DFVs[cellID]();

function df(input) {
    return DataFlowVariable ( () => {
        const formula = Formulae[input.id];
        const code = formula.replace(/\$\((.*?)\)/g, 'numValue("$1")'); // make '$' in the formula be the numValue function (mini-DSL)
        return Number( eval(code))
    } ) ;
}

// Note: module bundlers do not like the eval() method since they might rename symbols on the fly (e.g. 'n' to 'n$1' ) and
// cannot foresee how dynamically evaluated code might rely on the original name.
// Hence, we introduce a mini-dsl where '$' is a replacement for the 'numValue' function.</pre></code>


<pre><code class = "javascript" >// requires inheritance.js
// requires /util/test.js

import { Suite } from "../test/test.js"

const inheritance = Suite("inheritance");
    
// ES6 inheritance scheme
inheritance.add("ES6", assert => {

    class Person {
        constructor(name) {
            this.name = name;
            this.worklog = [];
        }
        mustDo() {
            return ""
        }
        work() {
            this.worklog.push(this.mustDo())
        }
    }

    const p = new Person("unknown");
    assert.is(p.worklog.length, 0);  // initially empty
    p.work();
    assert.is(p.worklog[0], "");     // superclass impl

    class Student extends Person {
        mustDo() {
            return "fill quiz"
        }
    }

    const s = new Student();
    assert.is(s.worklog.length, 0);  // initially empty
    s.work();
    assert.is(s.worklog[0], "fill quiz");  // subclass impl
    assert.is(s.name, undefined);  // super ctor not enforced

    assert.true(s instanceof Student);
    assert.is(s.__proto__, Student.prototype);
    assert.is(Object.getPrototypeOf(s), Student.prototype);
    assert.true(s instanceof Person);
    assert.true(s instanceof Object);
    assert.true(Student instanceof Function);

});


// composition by delegation, here: decorator pattern
inheritance.add("delegate", assert => {

    function Prof(worker) {
        const worklog  = [];
        return {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        }
    }

    const wl = Prof( {work: () => ""} );
    assert.is(wl.worklog.length ,  0);  // initially empty
    wl.work();
    assert.is(wl.worklog[0] ,  "");     // superclass impl

    function Student(name) {
        return {
            name:  name,
            work:  () => name + " filled quiz"
        }
    }

    const p = Prof(Student("top"));
    assert.is(p.worklog.length ,  0);  // initially empty
    p.work();
    assert.is(p.worklog[0] ,  "top filled quiz");  // subclass impl

});

// setting the prototype of an object dynamically
inheritance.add("setProto", assert => {

    function Prof(worker) {
        const worklog  = [];
        const result = {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        };
        Object.setPrototypeOf(result, Prof.prototype);
        return result
    }

    const wl = Prof( {work: () => ""} );

    assert.true(wl instanceof Prof)

});

inheritance.run();</pre></code>

<pre><code class = "javascript" >// The test "framework", exports the Suite function plus a total of how many assertions have been tested

export { Suite, total }

import { padLeft, padRight}   from "../util/strings.js"; // for formatting the report
import { Tuple }              from "../church/rock.js";
import { id }                 from "../church/church.js";

let total = 0;

function Assert() {
    const results = []; // [Bool], true if test passed, false otherwise
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { console.error("test failed") }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.error("test failure. Got '"+ actual +"', expected '" + expected +"'");
            }
            results.push(testResult);
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results)
}

function Suite(suiteName) {
    const tests = []; // [Test]
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            total += suiteAssert.results.length;
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report("suite " + suiteName, suiteAssert.results)
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( test => suite.test( test(name), test(logic) ) )
            }
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        write(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    write("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            write("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function write(message) {
    const out = document.getElementById('out');
    out.innerText += message + "\n";
}

function bar(extend) {
    write("+" + "-".repeat(extend) + "+");
}

</pre></code>

<pre><code class = "javascript" >// string utilities

export { padRight, padLeft }

// appends blanks to the right until the string is of size extend
// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

// appends blanks to the left until the string is of size extend
// padLeft :: String, Int -> String
function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return "";
    }
    return " ".repeat(extend - len);
}</pre></code>

<pre><code class = "javascript" ></pre></code>


<pre><code class = "javascript" ></pre></code>

<pre><code class = "javascript" ></pre></code>

`