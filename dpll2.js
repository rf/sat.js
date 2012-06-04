function copy (array) {
  return array.map(function (item) {
    if (Array.isArray(item)) return copy(item);
    else if (typeof item == 'number') return item + 0;
    else if (typeof item == 'boolean') return !!item;
  });
}

function satisfiable (clause, values) {
  for (var i = 0; i < clause.length; i++) {
    var item = clause[i];
    var value = values[Math.abs(item)];
    if (value === undefined) continue;
    return item < 0? !value : value;
  }
  return undefined;
}

function dpll (count, clauses, values, test, value) {
  values = (values && copy(values)) || [];

  clauses = clauses.filter(function (clause) {
    return !satisfiable(clause, values);
  }).map(function (clause) {
    return clause.filter(function (item) {
      if (test !== Math.abs(item)) return true;
      var negate = item < 0? true : false;
      if ((value && !negate) || (!value && negate)) return true;
      return false;
    });
  });

  values[test] = value;

  if (clauses.length === 0) return true;
  if (clauses.some(function (c) { return c.length === 0; })) return false;

  var choice = Math.floor(Math.random() * count) + 1;

  return dpll(count, clauses, values, choice, true) ||
         dpll(count, clauses, values, choice, false);
}

var input = [
  [1, -2, 4],
  [-1, -2, -3],
  [-1, 3, -4],
  [-1, 2, 3],
  [1, 4]
];

console.log(dpll(4, input));
