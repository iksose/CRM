// import {values} from './generators';


// for (let todo of values(this.todos)) {
//   console.log()
// }


console.log("hmm")

// import {values} from './generators';


var list = [1, 2, 3, 4];
var res = (for (x of list) x);

console.log("Res", res)
var acc = '';
for (var x of res) {
  acc += x;
  console.log("Acc", acc)
}

var res = (for (x of list) x);
console.log("Res next", res.next(), res.next())


function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
timeout(1000).then(() => {
  console.log('done');
});


var evens = [2,4,6,8];
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);

console.log("Nums", nums)

//let i = 9;

//console.log(i)

// var huge = [1,2,3, 4]


// var huge = []
// var myobj = {name: "jon", age: "25"}
// huge.push(myobj)
//
// for (var n of huge) {
//   console.log("Huge", n)
// }
//
// for (name of Object.keys(myobj))
//     alert(name + ": " + myobj[name]);

var melter = (obj) =>{
  var temp = obj
  temp.melted = "melted"
  // return obj.melted = "melted"
  return temp;
}
let empty = () => {};


class Car {
    constructor(make) { //constructors!
      this.make = make;
      this.currentSpeed = 25;
    }

    printCurrentSpeed(){
          console.log(this.make + ' is going ' + this.currentSpeed + ' mph.');
    }
}

class RaceCar extends Car { //inheritance
    constructor(make, topSpeed) {
        super(make); //call the parent constructor with super
        this.topSpeed = topSpeed;
    }

    goFast(){
          this.currentSpeed = this.topSpeed;
    }
}

let stang = new RaceCar('Mustang', 150);
let prius = new Car('Prius', 100)

stang.printCurrentSpeed();
stang.goFast();
stang.printCurrentSpeed();

prius.printCurrentSpeed();


var num = 0; //globally scoped

for (let i = 0; i < 10; i++) { //i is block scoped
  num += i;
  console.log('value of i in block: ' + i);
}

console.log('Is i defined here?: ' + (typeof i !== 'undefined')); //Is i defined here?: false
