# mutate-dom

DOM mutator for A/B experiments.


# Installation

```
npm i --save mutate-dom
```


## Usage example

The HTML to mutate.

```html
<div class="user">
  <div class="name">John</div>
  <div class="ava-container">
    <img src="http://api.randomuser.me/portraits/thumb/men/39.jpg"/>
  </div>
</div>
```

The code that mutates the HTML.

```js
var mu = require('mutate-dom');

function toJQuery(fn) {
  return function(selector) {
    var $el = $(selector);
    return fn($el);
  };
}

mu.addClass = function(newClass) {
  return toJQuery(function($el) {
    $el.addClass(newClass);
  });
};

mu.src = function(src) {
  return toJQuery(function($el) {
    $el.attr('src', src);
  });
};

mu({
  '.user': {
    '.name': 'Bill',
    '.ava-container': [{
        'img': mu.src('http://api.randomuser.me/portraits/thumb/men/59.jpg')
      },
      mu.addClass('awesome-ava-container')
    ]
  }
});
```


## License

MIT
