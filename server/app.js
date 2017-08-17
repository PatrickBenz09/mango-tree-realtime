'use strict'

const cron = require('node-cron')
const firebase = require('firebase')

let config = {
  databaseURL: 'https://kanban-realtime-vuefire.firebaseio.com',
  projectId: 'kanban-realtime-vuefire'
}
let firebaseApp = firebase.initializeApp(config)
let db = firebaseApp.database()

class FruitTree {

    // Initialize a new Tree
    constructor(age = 0, height = 0, fruits = [], healthyStatus = true) {
      this._age = age;
      this._height = height;
      this._fruits = fruits;
      this._healthyStatus = healthyStatus;
      this._harvested = 0;
      this._good = 0;
      this._bad = 0;
    }

    get age() {
      return this._age;
    }

    get height() {
      return this._height;
    }

    get fruits() {
      return this._fruits;
    }

    get healthyStatus() {
      return this._healthyStatus;
    }


    // Get current states here

    // Grow the tree
    grow() {
      if (this._age < 15) {
        if (this._age < 10) this._height = this._height + parseFloat((Math.random()*5).toFixed(2));
        this._age = this._age + 1;
      }
      if (this._age >= 15) {
        this._healthyStatus = false;
      }
    }

    // Produce some mangoes
    produceFruit() {
      let randomize = Math.floor(Math.random()*10+1);
      for (let i = 0; i < randomize; i++) {
        this._fruits.push(new Mango);
      }
    }

    // Get some fruits
    harvest() {
      this._good = 0, this._bad = 0;
      for (let i = 0; i < this._fruits.length; i++) {
        if(this._fruits[i]._quality === 'good') this._good++;
        else this._bad++;
      }
      this._harvested = this._fruits.length;
      return `${this._harvested} (${this._good} good, ${this._bad} bad)`;
    }

    // End the harvest
    endOfHarvest () {
      this._fruits = [];
      this._harvested = 0;
      this._good = 0;
      this._bad = 0;
    }
}

class Fruit {
  // Produce a fruit
  constructor() {
    this._quality = this.qualityCheck();
  }

  qualityCheck() {
    let randomize = Math.floor(Math.random()*2);
    if (randomize === 0) return "good";
    else return "bad";
  }
}

//-------------------------------------------------------------------------------------------------------------------------------//


// release 0
class MangoTree extends FruitTree {
  constructor(age = 0, height = 0, fruits = [], healthyStatus = true) {
    super(age, height, fruits, healthyStatus)
  }
}

class Mango extends Fruit{
  // Produce a mango
  constructor() {
    super();
  }

}

console.log('------------Mango Tree----------------');
let mangoTree = new MangoTree()
db.ref('mangoTree').set(mangoTree)

let sandsOfTime = cron.schedule('*/2 * * * * *', () => {
  if (mangoTree._healthyStatus !== false) {
    mangoTree.grow();
    mangoTree.produceFruit();
    console.log(`[Year ${mangoTree._age} Report] Height = ${mangoTree._height} m| Fruits harvested = ${mangoTree.harvest()}`)
    console.log('<><><><>');
    console.log('harvested: ' + mangoTree._harvested, 'Good: ' + mangoTree._good, "Bad: " + mangoTree._bad);
    console.log('><><><><>');
    db.ref('mangoTree').set(mangoTree)
    mangoTree.endOfHarvest()
  }
  else {
    sandsOfTime.stop()
    console.log(`The mango tree has met its end of time~.  :sad:`);
  }
})

// do {
//  mangoTree.grow();
//  mangoTree.produceFruit();
//  console.log(`[Year ${mangoTree._age} Report] Height = ${mangoTree._height} m| Fruits harvested = ${mangoTree.harvest()}`)
// } while (mangoTree._healthyStatus != false)
//
// console.log(`The mango tree has met its end. :sad:`);
// console.log();console.log();
//-------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------//
