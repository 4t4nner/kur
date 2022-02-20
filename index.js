import { promises } from 'fs';
const fs = promises;
// has
const materials = [
    [3000, 4],
    [4000, 5],
    [6000, 9999],
];
// const mLengths = materials.map(([length]) => length);
// needed
const products = [
    [1700, 3],
    [1500, 5],
    [700, 8],
].sort(([aLen], [bLen]) => bLen - aLen); // по убываниию
const pLen = products.map(([length]) => length);
const P_SIZE = products.length;
// j - material
// k - products
// i - kind of cut
const a_jki = Object.fromEntries(materials.map(([mLen, mMax]) => {
    const wayIK = [];
    // как можно порезать материал mLen на детали ?
    const minPLen = pLen.slice(-1)[0];
    // первый ненулевой столбец, определяется на предыдущем шаге
    let startProductCol = 0;
    do {
        let mLenCur = mLen; // остаток
        const curProducts = new Int32Array(P_SIZE); // of products.lenght
        for (let k = startProductCol; k < P_SIZE && mLenCur > minPLen; k++) {
            // обходить изделия
            let next = false;
            let curQuantity = 0;
            if (k === startProductCol && wayIK.length) {
                // это первый ненулевой столбец, он точно входит
                curQuantity = wayIK.slice(-1)[0].way[startProductCol] - 1; // на 1 меньше предыдущей строки в первом ненулевом столбце
                mLenCur -= pLen[k] * curQuantity;
            }
            else {
                //	увеличивать количество_текущей_детали пока меньше длины материала и количества изделий
                // todo перелать на деление?
                while (mLenCur >= products[k][0] && products[k][1] > curQuantity) {
                    mLenCur -= pLen[k];
                    curProducts[k] = ++curQuantity;
                    // todo костыль. сделать аккуратнее
                    wayIK.push({
                        way: curProducts.slice(),
                        limited: mLenCur > minPLen,
                        rest: mLenCur,
                    });
                }
            }
            curProducts[k] = curQuantity;
            // if (curQuantity && !next) {
            // 	wayIK.push({
            // 		way: curProducts.slice(),
            // 		limited: mLenCur > minPLen,
            // 		rest: mLenCur,
            // 	});
            // }
        }
        startProductCol = curProducts.findIndex(pQuant => pQuant !== 0);
        // пока единственный ненулевой столбец - не последний
    } while (startProductCol !== P_SIZE - 1);
    return [mLen, wayIK];
}));
const json = JSON.stringify(a_jki);
const csv = products.map(([pLen, pCount]) => `${pLen}, ${pCount}`).join(';') + `;is_limited;Остаток\n` +
    // mLen, mCount \n
    // aij;...;is_limited;Остаток
    Object.entries(a_jki).map(([mLen, ways], index) => `${mLen}, ${materials[index][1]}\n` +
        ways.map(({ way, limited, rest }) => way.join(';') + `;${limited};${rest}\n`).join(''));
fs.writeFile('out/out.json', json).catch(e => {
    debugger;
});
fs.writeFile('out/out.csv', csv).catch(e => {
    debugger;
});
debugger;
//# sourceMappingURL=index.js.map