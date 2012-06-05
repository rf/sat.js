function copy (array) {
  return array.map(function (item) {
    if (Array.isArray(item)) return copy(item);
    else if (typeof item == 'number') return item + 0;
    else if (typeof item == 'boolean') return !!item;
  });
}

// clauses looks like:
// [ [1, 3, 2], [-3, 3, 1], ..., [-4, 2, 3] ]
// variables start from 1!

var dpll = module.exports = function (count, clauses) {
  this.assignment = [];
  this.clauses = clauses;
  this.count = count;
};

dpll.prototype.go = function () {
  return this.dpll(this.clauses, this.assignment);
};

dpll.prototype.dpll = function dpll (clauses, assignment) {
  if (clauses.length === 0)
    return true;
  if (clauses.some(function (clause) { return clause.length === 0; }))
    return false;

  var variable = this.choose();

  return dpll.apply(this, this.simplify(copy(clauses), copy(assignment), variable, true)) ||
         dpll.apply(this, this.simplify(copy(clauses), copy(assignment), variable, false));
};

dpll.prototype.simplify = function (clauses, assignment, variable, value) {
  var that = this;
  clauses = clauses.filter(function (clause) {
    return !(that.satisfiable(clause, assignment));
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
  assignment[variable] = !!value;

  return [clauses, assignment];
};

dpll.prototype.satisfiable = function (clause, assignment) {
  for (var i = 0; i < clause.length; i++) {
    var item = clause[i];
    var variable = Math.abs(clause[i]);
    var value = assignment[Math.abs(variable)];
    if (value === undefined) continue;

    value = item < 0? !value : value;
    return !!value;
  }

  return undefined;
};

dpll.prototype.choose = function () {
  return Math.floor(Math.random() * this.count) + 1;
};

var input = [
  [1, -2, 4],
  [-1, -2, -3],
  [-1, 3, -4],
  [-1, 2, 3]
];

var solver = new dpll(4, input);

console.log(solver.go());
