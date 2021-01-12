const func = () => mainBody.innerHTML = `
<div>
<h2> Functions </h2> 
<p> Create functions in JS with keyword <i> function </i> </p>
<pre><code class = "javascript" > function fun1() { return 1; } </code></pre>
<h3> Call a function </h3> 
<pre><code class="javascript"> console.log(fun1() === 1); </code></pre>
<h3> Arguments in a function </h3> 
<pre> <code class = "javascript" > fun1(); // without argument
console.log(fun1(10) !== 10); // fun1 has no args, so it will ignore passing args
function fun2() { return 1; } // will be overwritten in the next line
function fun2(arg) { return arg; } // with an argument (Overloading not possible)
console.log(fun2() === undefined) // will be overwritten 
console.log(fun2(42) === 42); // call function with an argument
function fun3(arg) { return arg(); } // argument can also be a function
console.log(fun3(fun1) === 1); // call a function with an argument which is a function </code></pre>
<h3> Lambda expression </h3> 
<p> Create functions with Lambda expression. </p> 
<pre> <code class="javascript"> const funcName = () => 1; // same as function funcName() {return 1;}
const doit2 = callme => arg => callme(arg); // doit2 take 2 params in Curried style => doit2(fun2)(10);
console.log(doit2(fun2)(10) === 10); // call doit2 
const funcName2 = () => { return 1 }; // with block statement the return statement is needed</code></pre>
<h3> Immediately - invoked Function Expression IIFE </h3> 
<pre><code class="javascript">function foo() {let x = 2; console.log(x === 1)}; foo() // create functions and Immediately-invoked it
(function foo() { let x = 2; console.log(x === 1)})() // create functions and Immediately-invoked it 
(function() {let x = 2; console.log(x === 1)})() // // name not needed, because we Immediately-invoked it
(() => {let x = 2;console.log(x === 1) })() // keyword not needed</code></pre>

<h3>(a, b) vs. a => b => </h3>
<p> multiple arguments versus curried style chain arguments lets see the code below</p>
<pre><code class="javascript">const times =(a,b)=>a*b; // multiple arguments
times(2) // to call it with a parameter will not throw an error, the second args is undefined, so return value is NaN
const times =a=>b=>a*b; // curried style chain args 
times(2) // to call it with a parameter will not throw an error, but it return the function b => a*b, so its clear that second parameter needed! </code></pre>
</div>`;