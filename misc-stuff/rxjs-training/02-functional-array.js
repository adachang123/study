console.clear();

var source = ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'];

// TODO: Create a var `result` that contains the sum
// of all numbers in source. Use pure array functions
// such as map, filter, reduce, reduceRight.

var result

Rx.Observable.from(source)
    .map(x=>parseInt(x))
    .filter(num => !isNaN(num))
    .reduce((sum, next) => sum + next, 0)
    .subscribe(x => {result = x})

console.log(result);
