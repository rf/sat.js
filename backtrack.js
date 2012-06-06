// This is an extremely simple implementation of the 'backtracking' algorithm for
// solving boolean satisfiability problems. It contains no optimizations.

// The input consists of a boolean expression in Conjunctive Normal Form.
// This means it looks something like this:
//
// `(A OR B) AND (B OR ~C)`
//
// We encode this as an array of arrays of integers ranging from 1 to n:
//
// `[[1, 2], [2, -3]]`
//
// A negative number implies `NOT`.

// ### solve
//
// * `count` is the total number of variables.
// * `clauses` is an array of clauses.
// * `values` is a set of variable assignments. 
// * `test` is a variable which we are attempting to set to `value`.

function solve (count, clauses, values, test, value) {
  values = (values && values.slice()) || [];

  // Set the value we're going to test.  On first run, this will set
  // values[undefined] = undefined, which doesn't matter.
  values[test] = value;

  // If every clause is satisfiable, return the values which worked.
  if (clauses.every(function (c) { return satisfiable(c, values); }))
    return values;

  // If any clause is **exactly** false, return `false`; this combination of
  // values will not work.
  if (clauses.some(function (c) { return satisfiable(c, values) === false; }))
    return false;

  // Choose a new value to test by simply looping over the possible variables
  // and checking to see if the variable has been given a value yet.  
  var choice;
  for (choice = 1; choice <= count; choice++) {
    if (values[choice] === undefined) break;
  }

  // Recurse into two cases. The variable we chose will need to be either
  // true or false for the expression to be satisfied.
  return solve(count, clauses, values, choice, true) ||
         solve(count, clauses, values, choice, false);
}

// ### satisfiable
// Determines whether a clause is satisfiable given a certain set of values.

function satisfiable (clause, values) {

  // Resolve some variable to its actual value, or undefined.
  function resolve (variable) {
    var value = values[Math.abs(variable)];
    if (value === undefined) return undefined;
    return variable < 0? value: !value;
  }

  // If every variable is false, then the clause is false.
  if (clause.every(function (v) { return resolve(v) === false; })) return false;
  // If any variable is true, then the clause is true.
  if (clause.some(function (v) { return resolve(v) === true;})) return true;

  // Otherwise, we don't know what the clause is.
  return undefined;
}

var input = [
  [2, 3, 1],
  [-1, -2, 3]
];

console.log(solve(3, input));
