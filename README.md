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
var mutator = require('mutate-dom').mutator;

mu.addClass = mutator(function($el, newClass) {
  $el.addClass(newClass);
}, $);

mu.src = mutator(function($el, src) {
  $el.attr('src', src);
}, $);

mu({
  '.user': {
    '.name': 'Bill',
    '.ava-container': [{
        img: mu.src('http://api.randomuser.me/portraits/thumb/men/59.jpg')
      },
      mu.addClass('awesome-ava-container')
    ]
  }
});
```


## License

MIT