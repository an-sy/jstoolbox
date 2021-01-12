const classes = () => mainBody.innerHTML = `
<div>
<h2> Classes </h2> 
<h3>Keywords: class</h3>
<pre><code class = "javascript" >class Person { constructor(first, last) {
    this.firstname = first;
    this.lastname = last }
    getName() {
    return this.firstname + " " + this.lastname
    } }
    // new Person("Good", "Boy") instanceof Person</pre></code>
    <h3>Keywords: extends</h3>

<pre><code class = "javascript" >class Student extends Person { constructor (first, last, grade) {
        super(first, last);
        this.grade = grade; }
        }
        const s = new Student("Top","Student", 5.5);</pre></code>

<h3>Prototype chain</h3>
<img src="../img/classes_protottype.png"></img>
<pre><code class = "javascript" >const s = new Student()
        // s.__proto__ === Student.prototype; // Object.getPrototypeOf(s) === Student.prototype; // => s instanceof Student </pre></code>
</div>`;