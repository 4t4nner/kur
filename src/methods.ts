import { WayIK } from "./types";

export function branchBoundMethod(matr: Float32Array[], solution: Float32Array) {
    const k0 = getK0(solution);
    if (!k0.length) {
        return solution;
    }


}

// получить нецелочисленные компоненты решения
function getK0(solution: Float32Array): [number, number][] {
    const k0s = [] as [number, number][];
    solution.forEach((n, i) => {
        if (!Number.isInteger(n)) {
            k0s.push([i, Math.floor(solution[i])]);
        }
    })
    return k0s;
}

function simplexMethod() {
    
}

export function getNestingMatrix(gen: Record<string, WayIK[]>, materials: number[][], products: number[][]) {
    materials = materials.sort(([aLen], [bLen]) => bLen - aLen); // по убываниию

    const s_1 = materials.length - 1; // s - 1 ( D (and Y) length )
    const m = products.length;

    const genVal = Object.values(gen);
    const longMatWayCount = gen[materials[0][0]].length;

    // generated ways size (n_i sum)
    const nLen = genVal.reduce(((lenSum, ways) => ways.length + lenSum), 0);
    // sum( n_i ) + s - 1 + s_1 + m + 1 // +1 = B one column
    const matrColLen = nLen + s_1 + m + 1;
    const matrStringLen = s_1 + m + 1; // for F

    const A = [] as Float32Array[];

    for (let i = 0; i < matrStringLen; i++) {
        A.push(new Float32Array(matrColLen));
    }

    debugger;
    // set Y strings
    {
        let j = longMatWayCount; // column
        materials.slice(1).forEach(([len, q], i) => {
            const genMat = gen[len];
            if (!genMat) {
                debugger;
                throw new Error('!genMat');
            }
            for (let k = j; k < j + genMat.length; k++) {
                A[i][k] = 1;
            }
            j += len;
        });
    }

    // generated block matrix
    {
        let k = 0; // col counter
        materials.forEach(([len, q], i) => {
            const genMat = gen[len];
            if (!genMat) {
                debugger;
                throw new Error('!genMat');
            }
            const mLen = i !== 0 ? len : 0;
            genMat.forEach(way => {
                for (let j = 0; j < m; j++) {
                    debugger;
                    A[j + s_1][k] = way.way[j];
                }
                A[m + s_1][k++] = way.rest - mLen;
            })

        });
    }

    // diagonal 1 block matrix
    {
        let j = nLen; // columns
        for (let i = 0; i < s_1 + m; i++) {
            A[i][j++] = 1;
            A[i][matrColLen - 1] = i < s_1
                ? materials[i + 1][1]
                : products[i - s_1][1];
        }
    }
    // sum of materials len * count without longest
    A[s_1 + m][matrColLen - 1] = materials.slice(1).reduce((sum, [len, count]) => sum + len * count, 0);

    debugger;
    return A;
}