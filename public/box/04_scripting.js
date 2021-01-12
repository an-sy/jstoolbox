const scripting = () => mainBody.innerHTML = `
<div>
<h2> Scripting </h2> 
<p> eval</p>
<pre><code class = "javascript" >eval('console.log(1)');
// expected output: 1</pre></code>
<p> <b>Function()</b> is like <b>eval()</b> but declares parameters and executes in the global scope. It creates a reference.
</p>
<pre><code class = "javascript" >
const add = Function('x','y','return x+y'); 
add(1, 2); // 3
add(2, 3); // 5 no need to re-parse</pre></code>
</div>`;