// This is an extremely simple implementation of the DPLL algorithm for
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

// ### satisfiable
// Takes a clause and a set of values and determines if the clause is
// satisfiable given the values which are defined.  This will return one of
// `true`, `false`, or `undefined`, if it cannot be determined whether the
// clause is true or false.

function satisfiable (clause, values) {
  for (var i = 0; i < clause.length; i++) {
    var item = clause[i];
    var value = values[Math.abs(item)];

    // If the value is `undefined`, it isn't useful to us.  If it is `false`,
    // it does not affect the value of the clause.  Continue to the next item.
    if (!value) continue;

    // If we got here, then we have a value in the clause which is `true`;
    // this causes the whole clause to evaluate to `true`.
    return true;
  }

  // If we got here, we did not encounter a `true` value; so, we don't know
  // if the clause is `true` or `false`.
  return undefined;
}

// ### dpll
//
// * `count` is the total number of variables.
// * `clauses` is an array of clauses.
// * `values` is a set of variable assignments. 
// * `test` is a variable which we are attempting to set to `value`.

function dpll (count, clauses, values, test, value) {
  values = values? values.slice() : [];

  // Filter out satisfiable clauses.  These do not need to be considered.
  clauses = clauses.filter(function (clause) {
    return !satisfiable(clause, values);
  });

  // Take each clause, and ...
  clauses = clauses.map(function (clause) {

    // filter out literals which do not affect the value of the clause.
    return clause.filter(function (item) {

      // If the variable we're considering in the clause isn't the variable
      // we're testing, return `true`, keeping this variable in the clause.
      if (test !== Math.abs(item)) return true;

      // Respect negation of the variable in the clause, then return the value
      // it is set to. If the variable is set to false, it will be removed from
      // the clause because it no longer affects the clause.
      return item < 0? !value : value;
    });
  });

  // If there are no clauses left after the above filtering, return the set of
  // values which make the expression `true`.
  if (clauses.length === 0) return values;

  // If any of the clauses have no literals left, return `false`.
  if (clauses.some(function (c) { return c.length === 0; })) return false;

  // Choose a new variable to try pseudorandomly.  This is a common place for
  // optimizations.  We can make choices based on what's worked in the past.
  // For simplicity, we choose randomly.
  var choice = Math.floor(Math.random() * count) + 1;

  // Set the value we're going to try.
  values[test] = value;

  // Recurse.
  return dpll(count, clauses, values, choice, true) ||
         dpll(count, clauses, values, choice, false);
}

var input = [
  [2, 3, 1],
  [-1, -2, 3]
];

console.log(dpll(3, input));
