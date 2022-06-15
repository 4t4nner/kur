import { materials, products } from './config.js';
import gen from './matrix.js';
import { getNestingMatrix, getSimplexData } from './methods.js';
import { simplex } from './simple-simplex/simplex.js';

// const sData = getSimplexData();
const firstMatrix = getNestingMatrix(gen, materials, products);
const solved = simplex(firstMatrix);
debugger;
console.log(JSON.stringify(firstMatrix));
debugger;