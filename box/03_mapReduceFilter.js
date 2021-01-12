const mapReduceFilter = () => mainBody.innerHTML = `
<div>
<h2> Map, Reduce Filter </h2> 
<h3> Map </h3> 
<p> The <b>map()</b> method creates a new array populated with the results of calling a provided function on every element in the calling array.
</p>
<pre> <code class="javascript"> const array1 = [1, 4, 9, 16];
// pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
// expected output: Array [2, 8, 18, 32]</pre></code>
<p><b>Parameter of Map</b></p>
<pre> <code class="javascript"> //callback
// syntax example
const new_array = arr.map(function callback(currentValue,  index, array) {
    // return Element for new_array
}
let arr = [1,2,3].map((x,i,a) => {
    console.log(x); // element
    console.log(i);  // index
    console.log(a); // array
    return x*2}) // element2times
console.log(arr);
// expected output: Array [2, 4, 6]</pre></code>

<h3> Filter </h3> 
<p>The <b>filter()</b> method creates a new array with all elements that pass the test implemented by the provided function. </p>
<pre><code class="javascript">const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]</pre></code>
<h3> Reduce </h3> 
<p> The <b>reduce()</b> method executes a reducer function (that you provide) on each element of the array, resulting in single output value.</p>
<pre><code class="javascript">const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15</code></pre>
<p><b>Parameter of Reduce</b></p>
<pre> <code class="javascript"> //callback
// syntax example
const reduced = arr.reduce((acc,curr,index, sourceArr) =>  {
    // return reduced
}, initialValue)
const array1 = [1, 4, 9, 16];
const result = array.reduce( (accu, cur) => accu + 1  , 0) // length

console.log(result);
// expected output: 4</pre></code>

<h3>further examples (also slice and splice)</h3>
<pre> <code class="javascript">const array = ["aaa", "bbb", "ccc", "d", "e", "f"];
// const array = [1,2,3,4];
// const result = array.reduce( (accu, cur) => accu + 1  , 0) // length
// const result = array.reduce( (accu, cur) => accu + cur  , 0)  // sum
// const result = [].reduce( (accu, cur) => accu + cur)  // without start value -> type error
// const result = array.reduce( (accu, cur) => accu + cur  , '')  // concat
// const result = array.reduce( (accu, cur) => accu + cur.length  , 0)  // concat
// const result = array.reduce( (accu, cur) => [...accu,cur]  , []) // copy
// const result = array.reduce( (accu, cur) => [cur, ...accu]  , []) // reverse
const pred = it => it.startsWith("b");
// const result = array.reduce( (accu, cur) => pred(cur) ? [...accu,cur] : accu  , []) // filter
const fn = it => it.length;
// const result = array.reduce( (accu, cur) => [...accu, fn(cur)] , []) // map

const bools = [true, false, true];
// const result = bools.reduce( (accu, cur) => accu && cur , true) // every
// const result = bools.reduce( (accu, cur) => accu || cur , false) // any

// const result = array.slice() // copy
// const result = array.slice(3)
// const result = array.slice(3, 4) // begin incl, end excl.
// const result = array.slice(0, array.length) // begin incl, end excl.
// const result = array.slice(0, -3) // begin incl, end neg
// const result = array.slice(4, 0) // not supported -> empty array

const result = array.splice(-3,0,"x","y") // changes the receiver!!</code></pre>

</div>`;