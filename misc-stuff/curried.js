// function composition
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
let g = n => n+1;
let f = n => n+2;
let h = n => n+3;
let apply = compose(g, f, h)
apply(1) == 7 // g(f(h(x)))

// how to debug function composition
const trace = label => value => {
  console.log(`${ label }: ${ value }`);
  return value;
};

let a = compose(
  trace('after f'),
  f,
  trace('after g'),
  g
);


// ref: https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983

