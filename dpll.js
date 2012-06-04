function copy (array) {
  return array.map(function (item) {
    if (Array.isArray(item)) return copy(item);
    else if (typeof item == 'number') return item + 0;
    else if (typeof item == 'boolean') return !!item;
  });
}

function dpll (num, clauses, values, variable, value) {
  // simplify here
  var that = this;
  this.num = num;

  this.values = (values && copy(values)) || [];

  this.clauses = clauses.filter(function (clause) {
    return !(that.satisfiable(clause));
  }).map(function (clause) {
    return clause.filter(function (item) {
      if (variable != Math.abs(item)) return true;
      var negate = item < 0? true : false;

      // this is an XOR but js doesn't have an XOR operator :(
      // Basically if we're setting the variable to true and not negating,
      // or if we're negating and setting it to false, then this var
      // affects the outcome of the clause and should be left in the clause
      if ((value && !negate) || !value && negate) return true;

      // Otherwise it's removed from the clause
      return false;
    });
  });
  this.values[variable] = !!value;
}

dpll.prototype.solve = function () {
  if (this.clauses.length === 0) return true;
  if (this.clauses.some(function (c) { return c.length === 0; })) return false;

  var test = Math.floor(Math.random() * this.num) + 1;

  return new dpll(this.num, this.clauses, this.values, test, true).solve() ||
         new dpll(this.num, this.clauses, this.values, test, false).solve();
};

dpll.prototype.satisfiable = function (clause) {
  for (var i = 0; i < clause.length; i++) {
    var item = clause[i];
    var variable = Math.abs(clause[i]);
    var value = this.values[variable];
    if (value === undefined) continue;
    value = item < 0? !value : value;
    return !!value;
  }
  return undefined;
};

var input = [
  [1, -2, 4],
  [-1, -2, -3],
  [-1, 3, -4],
  [-1, 2, 3]
];

var solver = new dpll(4, input);

console.log(solver.solve());
