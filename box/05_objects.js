const objects = () => mainBody.innerHTML = `
<div>
<h2> Objects </h2> 
<h3>What are Objects?</h3>
<p> Data structures +
Methods for access and management (+ a location for mutable state)
(+ abstraction and polymorphism)</p>
<h3>Different Approaches</h3>
<p><b>Open, dynamic</b> </p>
<pre><code class = "javascript" >const good = {
    firstname : "Good", lastname : "Boy", getName : function() {
    return this.firstname + " " + this.lastname }
};
    // no safety but super dynamic
    // unobvious how to share structure
    // beware of "this"! </pre></code>
<p><b>Closed, explicit</b> </p>
<p> Best Practice use Closed, explicit Objects</p>
<pre><code class="javascript">function Person(first, last) {
    let firstname = first; // optional let lastname = last;
    return {
        getName: function() {
            return firstname + " " + lastname;
        }
    }
    // Closure, no this
    // best safety, easy to share structure, but no class</code></pre>
<p><b>Mixed, classified</b><p>
<pre><code class="javascript">const Person = ( () => { // lexical scope
    function Person(first, last) { // ctor, binding
        this.firstname = first;
        this.lastname = last; 
    }
    Person.prototype.getName = function() {
        return this.firstname + " " + this.lastname;
    };
    return Person; 
    }) (); // IIFE
    // new Person("Good", "Boy") instanceof Person</code></pre>


</div>`;