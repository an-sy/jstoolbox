const promesis = () => mainBody.innerHTML = `
<div>
<h2> Aysnc </h2> 
<h3>Promesis</h3>
<pre><code class = "javascript" >fetch ('https://jsonplaceholder.typicode.com/posts/1') 
        .then(response => response.json())
        .then(students => console.log(students.length))
        .catch (err => console.log(err)</pre></code>
    <h3>Create your own Promess</h3>

<pre><code class = "javascript" >const processEven = i => new Promise( (resolve, reject) => { 
        if (i % 2 === 0) {
                resolve(i); 
        } else {
                reject(i); 
        }
} );

processEven(4)
.then ( it => {console.log(it); return it} ) .then ( it => processEven(it+1))
.catch( err => console.log( "Error: " + err))</pre></code>

<h3>async / await variants</h3>
<pre><code class = "javascript" >async function foo(i) { try {
        const x = await processEven(i);
        console.log("foo: " + x); }
        catch(err) { console.log(err); } };
        foo(4);</pre></code>
</div>`;