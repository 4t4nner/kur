import assert from 'assert';
import * as mathjs from 'mathjs';

function getColumn({
    tableau: tableau,
    columnNo: columnNo
}) {
    return tableau.map(row => row[columnNo]);
}

function getLastColumn(tableau) {
    const columnNo = tableau[0].length - 1;
    return getColumn({
        tableau: tableau,
        columnNo: columnNo
    });
}


function getLastRow(tableau) {
    return tableau[tableau.length - 1];
}

function getPivotColumnIndex(tableau) {
    const lastRow = getLastRow(tableau);
    const pivotColumnPair = lastRow.reduce((accMin, curEntry, curIndex) => {
        if (accMin.value <= curEntry) return accMin;
        return { value: curEntry, index: curIndex };
    }, { value: 0, index: -1 });
    return pivotColumnPair.index;
}

function getPivotRowIndex(tableau) {
    const lastColumn = getLastColumn(tableau);
    const lastConstraintColumn = lastColumn.slice(0, lastColumn.length - 1);
    const pivotColumnIndex = getPivotColumnIndex(tableau);
    const pivotColumn = getColumn({
        tableau: tableau,
        columnNo: pivotColumnIndex
    });
    const pivotConstraintColumn = pivotColumn.slice(0, pivotColumn.length - 1);
    const dividedLastColumn = lastConstraintColumn.map((entry, index) => entry / pivotConstraintColumn[index]);
    const pivotRowPair = dividedLastColumn.reduce((accMin, curEntry, curIndex) => {
        // can the acc min be negative?
        if (pivotConstraintColumn[curIndex] < 0) return accMin;
        if (accMin.value <= curEntry) return accMin;
        if (curEntry < 0) return accMin;
        return { value: curEntry, index: curIndex };
    }, { value: Infinity, index: -1 });
    return pivotRowPair.index;
}

function adjustNonPivotRow({
    nonPivotRow: nonPivotRow,
    adjustedPivotRow: adjustedPivotRow,
    pivotCoords: pivotCoords
  }) {
    const {
      colNo: colNo
    } = pivotCoords;
    const pivotRowMultiplier = nonPivotRow[colNo] * -1;
    const multipliedPivotRow = mathjs.multiply(adjustedPivotRow, pivotRowMultiplier);
    const adjustedInputRow = mathjs.add(nonPivotRow, multipliedPivotRow);
    adjustedInputRow[colNo] = 0;
    return adjustedInputRow;
}

function adjustPivotRow({
    pivotRow: pivotRow,
    pivotCoords: pivotCoords
  }) {
    const {
      colNo: colNo
    } = pivotCoords;
    const pivotEntry = pivotRow[colNo];
    const adjustedPivotRow = pivotRow.map(curEntry => curEntry / pivotEntry);
    adjustedPivotRow[colNo] = 1;
    return adjustedPivotRow;
}

function getPivotCoords(tableau) {
    return {
        rowNo: getPivotRowIndex(tableau),
        colNo: getPivotColumnIndex(tableau)
    };
}

function applyPivoting(tableau) {
    const pivotCoords = getPivotCoords(tableau);
    const {
        rowNo: rowNo
    } = pivotCoords;
    const pivotRow = tableau[rowNo];
    const adjustedPivotRow = adjustPivotRow({
        pivotRow: pivotRow,
        pivotCoords: pivotCoords
    });
    const nextTableau = tableau.map((curRow, curIndex) => {
        if (curIndex === rowNo) return pivotRow;
        return adjustNonPivotRow({
            nonPivotRow: curRow,
            adjustedPivotRow: adjustedPivotRow,
            pivotCoords: pivotCoords
        });
    });
    return nextTableau;
}


function isAllNonNegative(vector) {
    return vector.reduce((acc, curItem) => acc && curItem >= 0, true);
}

function isTableauOptimal(tableau) {
    const lastRow = getLastRow(tableau);
    return isAllNonNegative(lastRow);
}
  

export function simplex(tableau: (number[] | Float32Array)[], maxIterations = 50) {
    let curTableau = tableau;
    let curIteration = 0;
    const tableaus = [];
    while (!isTableauOptimal(curTableau) && curIteration < maxIterations) {
      tableaus.push(curTableau);
      curTableau = applyPivoting(curTableau);
      curIteration += 1;
    }
    return {
      finalTableau: curTableau,
      tableaus: tableaus,
      isOptimal: isTableauOptimal(curTableau)
    };
  
}