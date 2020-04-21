function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}var hyclas = /*#__PURE__*/function () {
  function hyclas(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    _classCallCheck(this, hyclas);

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.tags = [];
    this.typeSelected = undefined;

    if (options) {
      this.types = options.types;
    }

    this.setPredictions();
    this.handleEvents();
  }

  _createClass(hyclas, [{
    key: "getSelection",
    value: function getSelection(event) {
      var _this = this;

      if (!window.getSelection().toString().length) return;
      var selection = window.getSelection().getRangeAt(0);
      var selectionStart = selection.startOffset;
      var selectionEnd = selection.endOffset;
      var selectionString = selection.toString().trim();
      if (selectionEnd === selectionStart || selectionString.length === 0 || this.tags.find(function (item) {
        return item.label === selectionString && item.type === _this.typeSelected;
      })) return;
      var tag = this.createTagObject(selectionString, this.getTypeSelected());

      try {
        selection.surroundContents(this.createElementTag(tag));
        this.addTag(tag);
        console.log(this.element.querySelector("[data-tag-id=\"".concat(tag.id, "\"]")).childNodes);
      } catch (error) {
        console.log("Wrong selection: ".concat(error));
      }

      window.getSelection().removeAllRanges();
    }
  }, {
    key: "setPredictions",
    value: function setPredictions() {
      var _this2 = this;

      var types = this.types;
      var FLAGS = {
        "case": 'i',
        whitespace: 's'
      };
      types.forEach(function (type) {
        type.predictions.forEach(function (prediction) {
          var html = _this2.element.innerHTML;
          var defaultFlags = ['g'];
          var predictionMatch = Object.keys(prediction.match).filter(function (key) {
            return prediction.match[key];
          }).map(function (match) {
            return FLAGS[match];
          }).concat(defaultFlags).join('');
          var regex = new RegExp("".concat(prediction.text), predictionMatch);

          if (regex.test(html)) {
            var tag = _this2.createTagObject(prediction.text, type);

            var element = _this2.createElementTag(tag);

            _this2.element.innerHTML = html.replace(regex, element.outerHTML);

            _this2.addTag(tag);
          }
        });
      });
      this.tags.forEach(function (tag) {
        _this2.attachContextMenu(_this2.element.querySelector("[data-tag-id=\"".concat(tag.id, "\"]")));
      });
    }
  }, {
    key: "addTag",
    value: function addTag(tag) {
      this.tags.push(tag);
      this.createEvent(tag);
    }
  }, {
    key: "createElementTag",
    value: function createElementTag(tag) {
      var element = document.createElement("span");
      element.style.backgroundColor = tag.color;
      element.style.paddingLeft = '2px';
      element.style.paddingRight = '2px';
      element.setAttribute('data-tag-id', tag.id);
      element.innerHTML = tag.label;
      this.attachContextMenu(element);
      return element;
    }
  }, {
    key: "attachContextMenu",
    value: function attachContextMenu(element) {
      var _this3 = this;

      element.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this3.removeTag(event);
      });
    }
  }, {
    key: "removeTag",
    value: function removeTag(event) {
      var element = event.target;
      var tagId = element.getAttribute('data-tag-id');
      var parent = element.parentNode;
      var tagIndex = this.tags.findIndex(function (tag) {
        return tag.id === tagId;
      });

      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }

      try {
        parent.removeChild(element);
      } catch (error) {}

      this.removeEvent(this.tags[tagIndex]);
      this.tags.splice(tagIndex, 1);
    }
  }, {
    key: "setType",
    value: function setType(type) {
      this.typeSelected = type;
      this.getSelection();
    }
  }, {
    key: "getTypeSelected",
    value: function getTypeSelected() {
      var _this4 = this;

      return this.types.find(function (item) {
        return item.type === _this4.typeSelected;
      });
    }
  }, {
    key: "createTagObject",
    value: function createTagObject(text, type) {
      return {
        id: Math.random().toString(36).slice(2),
        label: text,
        type: type.type,
        color: type.color
      };
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        tags: this.tags
      };
    }
  }, {
    key: "handleEvents",
    value: function handleEvents() {
      var _this5 = this;

      this.element.addEventListener('mouseup', function (event) {
        if (_this5.typeSelected && event.button == 0) _this5.getSelection(event);
      });
    }
  }, {
    key: "createEvent",
    value: function createEvent(tag) {
      var event = new CustomEvent('createTag', {
        detail: tag
      });
      this.element.dispatchEvent(event);
    }
  }, {
    key: "removeEvent",
    value: function removeEvent(tag) {
      var event = new CustomEvent('removeTag', {
        detail: tag
      });
      this.element.dispatchEvent(event);
    }
  }]);

  return hyclas;
}();export{hyclas};