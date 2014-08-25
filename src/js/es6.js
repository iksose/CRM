function checkTest(age: number) {
    console.log("Passed? ", age)
}
checkTest(20)

// var customers = [];
// var customer = {}
// customer.city = "Seattle"
// var customer2 = {}
// customer2.city = "Kansas City"
// customers.push(customer);
// customers.push(customer);
// customers.push(customer2);

// var results = [
//     for (c of customers)
//         if (c.city == "Seattle") {
//             name: c.name,
//             age: c.age
//         }
// ]



// var evens = [2, 4, 6];

// var odds = evens.map(v => v + 1).filter(v => v > 0)

// console.log("odds", odds)

// var hello = {
//     hello: 'world',
//     foo: 'bar'
// };
// var qaz = {
//     hello: 'stevie',
//     foo: 'baz'
// }

// var myArray = [];
// myArray.push(hello, hello, qaz);

// var pos = myArray.map(v => v.hello).indexOf('stevie');

// console.log("position", pos)

// myArray.splice(myArray.map(v => v.hello).indexOf('stevie'), 1);
// console.log("myArray", myArray)


// var testArray = [1, 2, 3, 4]

// console.log("uhhh")

// // function assrt(arr:Array){
// //     console.log("Array", arr)
// // }

// // assrt([1,2,3])

// function timeout() {
//     var ms = Math.random() * (5000 - 1000) + 1000;
//     return new Promise(resolve => setTimeout(resolve, ms));
// }


// async

// function asyncValue(value) {
//     await timeout();
//     return value * value;
// }

// asyncValue(2).then((res) => {
//     // console.log("res", res)
//     // var dicks = res
//     return res
// }).then(async(x) => {
//     // console.log("Starting next res", x) // x = 4
//     var y = await asyncValue(x) // IO or db transaction;
//         // console.log("Done after res", y) // y = 16
//     var z = await asyncValue(y) // IO or db transaction;
//         // console.log("Done after res 2", z) // z = 256
//         // return x * x;
// });

// async

// function loop(val) {
//     while (val < 9000) {
//         val = await asyncValue(val)
//         // console.log("iteration", val)
//         // console.log("Test array", testArray2)
//     }
// }

// loop(2)

// var testArray2 = []
// testArray.forEach(async(x) => {
//     var double = await asyncValue(x)
//     testArray2.push(double)
// });


// class Stack extends Array {
//     constructor() {
//         // super()
//     }
//     top() {
//         return this[this.length - 1];
//     }
//     bottom() {
//         return this[0]
//     }
//     async queue(task) {
//         this.push(task)
//         while (this.length > 0) {
//             console.log("Adding", task)
//             await this.something(task)
//         }
//         // await this.something(task);
//     }
//     async work(task) {
//         await timeout() //aka go to the DB
//         console.log("Done with task", task)
//         return
//     }
//     async something(task) {
//         console.log("Something", task)
//         await timeout()
//         this.shift();
//         console.log("Done", task)
//         return
//     }
// }

// var s = new Stack();
// // s.push("world");
// // s.push("hello");
// // console.log(s.top());  // "hello"
// // console.log(s.length); // 2
// // console.log(s.bottom()); // world


// var map = new Map()
// map.set('John', 25)
// map.set('Alice', 400)

// map.forEach(function(key, value) {
//     console.log(key, value)
// })

// for (var [key, value] of map) {
//     console.log("dude", key, value)
// }

// var arr = [1, 2, 3, 4]
//     // if (!arr.contains(5)){
//     //     arr.push(obj);
//     // }
//     // console.log("Arr", arr)

// var bo = _.contains([1, 2, 3], 5);
// console.log(bo)
// // console.log( _.contains([1, 2, 3], 1); )
