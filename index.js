// Core library

function s(spec) {
  return function(path, obj) {
    if (obj === undefined) {
      obj = path;
      path = '';
    }
    if (typeof spec === 'function') {
      return spec(path, obj);
    } else if (typeof spec === 'object') {
      return s.object(spec)(path, obj)
    }
  };
};

function leaf(matcher) {
  return function (path, value) {
    var err = matcher(value);
    if (err) {
      return [{
        path: path,
        value: value,
        message: err
      }];
    }
  };
}

function flatten(arrays) {
  return Array.prototype.concat.apply([], arrays);
}

// Complex matchers

s.object = function(opts) {
  var spec = opts;
  return function (path, obj) {
    var errors = [];
    for (key in spec) {
      var subpath = path ? (path + '.' + key) : key;
      var matcher = s(spec[key]);
      var err = matcher(subpath, obj[key]);
      if (err) errors.push(err)
    }
    return flatten(errors);
  };
};

// Leaf matchers

s.string = function (opts) {
  return s(leaf(function(value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
  }));
};

s.number = function (opts) {
  return s(leaf(function(value) {
    if (typeof value !== 'number') {
      return 'should be a number';
    }
  }));
};

module.exports = s;
