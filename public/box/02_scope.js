const scope = () => mainBody.innerHTML = `
<div>
<h2> Variable scope </h2> 
<p> <b>global</b> window (in Browser)</p>
<p> <b>function</b> no matter where defined, variables are
local to the enclosing function (lambda)</p>
<pre><code class = "javascript" >x = 1 //mutable, global scope --> dont use!
var x = 1 // mutable, "hoisted" scope  dont use!
let x = 1 // mutable, local scope 
const x = 1 // immutable*, local scope </code></pre>
<h3> Example</h3>
<pre> <code class="javascript">let x = 1;
(() => {let x = 2;console.log(x === 2) })(); // TRUE IIFE let is Blockscope (local) 
console.log(x === 1); // TRUE
(() => {x = 2;console.log(x === 2) })(); // TRUE now global scope 
console.log(x===2) // TRUE x is mutable and is changed in the IIFE</code></pre>


</div>`;