declare module 'simple-simplex' {
    export default class SimpleSimplex {
        constructor(p: {
            optimizationType: 'max', // for min set z_negative = -z
            objective: Record<string, number>, //  { a: 5, b: 4, c: 4 }
            constraints: {
                namedVector: Record<string, number> //  { a: 5, b: 4, c: 4 }
                constraint: '<=' | '=' | '>=',
                constant: number
            }[]
        }){}

        solve(p: {
            methodName: string,
        }): Record<string, any>;
    }
}