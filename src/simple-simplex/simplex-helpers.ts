import assert from 'assert';
import mathjs from 'mathjs';

function mapVector (namedVector: Record<string, any>) {
    const varNames = Object.keys(namedVector).sort();
    const indicesToNames = {};
    const namesToIndices = {};
    const vectorValues = [];
    varNames.forEach((coefficientName, index) => {
      indicesToNames[`${index}`] = coefficientName;
      namesToIndices[coefficientName] = index;
      vectorValues.push(namedVector[coefficientName]);
    });
    return {
      varNames,
      indicesToNames,
      namesToIndices,
      vectorValues,
    };
  }
  