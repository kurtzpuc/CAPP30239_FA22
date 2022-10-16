/*
This is a block comment, allows multiple lines of comment
This is a javascript example for week 2.
*/ 

let num = 100; //integer

function foo() {
    let num2 = 200;
    console.log(num);
};

//let  anonFun = function() {
//    console.log("hello")
//};

let anonFun = () => console.log("hello")

foo();
anonFun;

(function() {
    console.log("hi")
})();

(() => console.log("bye"))();

let Person = "Summer";

function people(peopleName) {
    console.log("Hello " + peopleName);
};

people(Person);


let arr = ["foo", 123, ["zar", "bar"]];

console.log(arr[1]);
arr[1] = "barbar"
console.log(arr[1]);

arr.push("car");
console.log(arr[3]);
console.log(arr)
arr.splice(2,1)
console.log(arr)


for (let item of arr) {
    console.log(item);
}

for (let i in arr) {
    console.log(i + " " + arr[i]);
}

arr.forEach((item, i) => console.log(i + " " + item));

let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter",
};


console.log(obj1.name)
console.log(obj1["job"])

obj1.job = "Vampire Hunter";

console.log(obj1.job)

console.log("Say Hello to")
for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}: ${value}`);
}

console.log(`hello what a wonderful day we're having, 
aren't we ${obj1.name}`); //string literal

for(let i = 0; i < 10; i++) {
    console.log(i);
}





//if else
let x = 75;

if (x < 50) {
    console.log(`name is ${x}`);
} else {
    console.log("nope");
}


//traverse DOM
let example = document.getElementById("example");

example.innerHTML += "Hello world";