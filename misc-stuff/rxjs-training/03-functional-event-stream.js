console.clear();

var source = Rx.Observable.interval(400).take(9)
  .map(i => ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'][i]);

// TODO: Create an Observable `result` that emits the 
// sum of all numbers in source. Use pure functions
// such as map, filter, reduce, scan, merge, delay, 
// concat, take, etc.

let result = source.map(x=>parseInt(x))
                  .filter(num => !isNaN(num))
                  .reduce((sum, next) => sum + next, 0)

result.subscribe(x => console.log(x));
