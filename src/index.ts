import { materials, products } from './config.js';
import gen from './matrix.js';
import { getNestingMatrix } from './methods.js';

const firstMatrix = getNestingMatrix(gen, materials, products);
console.log(JSON.stringify(firstMatrix));
debugger;