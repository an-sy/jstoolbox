const modules = () => mainBody.innerHTML = `
<div>
<h2> Modules </h2> 
<h3>Imports</h3>
<pre><code class = "javascript" >import "module-name"; 
import { export1 , export2 } from "module-name";</pre></code>
    <h3>Exports</h3>
    <pre><code class = "javascript" >export { name1, name2, ..., nameN };</pre></code>
<h3>Impact I</h3>
<p>
implicit "use strict" exports are read-only !</br>
no Global object, no Global "this", no Global hoisting </br>
implicit "defer" mode, => document.writeln is no longer useful
</p>
<h3>Impact II</h3>
<p>
Modules are Namespaces </br>
Modules are Singletons
</p>
<h3>SOP Single origin policy</h3>
<p>
Modules are subject to the SOP </br>
Problem zur Entwicklungszeit: das File System ist ein null origin

</p>

</div>`;