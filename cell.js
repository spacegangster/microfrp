// Generated by CoffeeScript 1.8.0
var Cell, ElementCell, IO, ImgCell, TextCell, UserInputSource, ca, cb, cc, ci, input1, input2, text_cell,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

IO = {
  input: {
    read: function(elem) {
      return elem.value;
    },
    write: function(elem, value) {
      return elem.value = value;
    }
  },
  div: {
    read: function(elem) {
      return elem.textContent;
    },
    write: function(elem, value) {
      return elem.textContent = value;
    }
  }
};

Cell = (function() {
  function Cell(val) {
    this.deps_all = [];
    this.val = val;
  }

  Cell.prototype.cell = function(o) {
    var cell, key, self, val, _results;
    self = this;
    val = this.val;
    _results = [];
    for (key in o) {
      cell = o[key];
      _results.push((function(key, cell) {
        return cell.depend(function(cell_val) {
          val[key] = cell_val;
          return self.set(val);
        });
      })(key, cell));
    }
    return _results;
  };

  Cell.prototype.depend = function(dep_fn) {
    var self;
    this.deps_all.push(dep_fn);
    self = this;
    return setTimeout(function() {
      return dep_fn(self.val);
    });
  };

  Cell.prototype["function"] = function(val) {
    return val;
  };

  Cell.prototype.set = function(val) {
    var self, val_transformed;
    val_transformed = this["function"](val);
    if (this.set_raw) {
      this.set_raw(val_transformed);
    }
    this.val = val_transformed;
    self = this;
    if (self.deps_all.length > 0) {
      return setTimeout(function() {
        var dependant_fn, _i, _len, _ref;
        _ref = self.deps_all;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dependant_fn = _ref[_i];
          dependant_fn(val_transformed);
        }
      });
    }
  };

  return Cell;

})();

ElementCell = (function(_super) {
  __extends(ElementCell, _super);

  function ElementCell(element, opts) {
    if (opts == null) {
      opts = {
        val: null
      };
    }
    this.element = element;
    this.set_io(element);
    ElementCell.__super__.constructor.call(this, opts.val);
  }

  ElementCell.prototype.set_io = function(input_element) {
    this.element = input_element;
    return this.io = 'INPUT' === input_element.tagName ? IO.input : IO.div;
  };

  ElementCell.prototype.set_raw = function(val) {
    return this.io.write(this.element, val);
  };

  return ElementCell;

})(Cell);

UserInputSource = (function(_super) {
  __extends(UserInputSource, _super);

  function UserInputSource(input_element) {
    var self;
    UserInputSource.__super__.constructor.call(this, input_element, {
      val: ''
    });
    this.set(this.io.read(input_element));
    self = this;
    self.element.addEventListener('input', function() {
      return self.set(self.io.read(self.element));
    });
  }

  UserInputSource.prototype["function"] = function(val) {
    return '' === val && '0' || val;
  };

  UserInputSource.prototype.set_raw = function(val) {
    return this.io.write(this.element, val);
  };

  return UserInputSource;

})(ElementCell);

TextCell = (function(_super) {
  __extends(TextCell, _super);

  function TextCell() {
    return TextCell.__super__.constructor.apply(this, arguments);
  }

  TextCell.prototype["function"] = function(_arg) {
    var cella, cellb;
    cella = _arg.cella, cellb = _arg.cellb;
    return parseInt(cella) + parseInt(cellb);
  };

  return TextCell;

})(ElementCell);

ImgCell = (function(_super) {
  __extends(ImgCell, _super);

  function ImgCell() {
    return ImgCell.__super__.constructor.apply(this, arguments);
  }

  ImgCell.prototype.set_raw = function(_arg) {
    var src;
    src = _arg.src;
    return this.element.src = src;
  };

  return ImgCell;

})(ElementCell);

ca = document.querySelector('.cell--a');

cb = document.querySelector('.cell--b');

cc = document.querySelector('.cell--c');

ci = document.querySelector('.cell--img');

input1 = new UserInputSource(ca);

input2 = new UserInputSource(cb);

text_cell = new TextCell(cc, {
  val: {
    cella: 0,
    cellb: 0
  }
});

text_cell.cell({
  cella: input1,
  cellb: input2
});