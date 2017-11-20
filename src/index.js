/** @jsx h  */
import { render, h } from './render';

const log = (...msg) => {
  console.log('%cVDOM', 'color: green', msg);
};

const data = ['first'];

const removeData = index => {
  data.splice(index, 0);
  // render subscribe to data change
};

// TODO: component system
const List = ({ content, index }) => (
  <li>
    {content}
    <button onClick={() => {removeData(index)}}>
      Remove
    </button>
  </li>
);

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    log('submit', e.target.value);
    // TODO: do submit
    // clear input content
    e.target.value = '';
  }
}

const elem = (
  <div>
    Hello VDOM
    <div>
      <input
        onKeyPress={handleKeyPress}
        disabled={false}
      />
      <ul className="list">
        <li>Check email</li>
        <li>Finish project 1</li>
      </ul>
    </div>
  </div>
);

const elem2 = (
  <div>
    Hello VDOM!!!!
    <div>
      <input
        onKeyPress={handleKeyPress}
        disabled
      />
      <ul>
        <li>Check email</li>
        <li>Finish project 1</li>
      </ul>
    </div>
  </div>
);

console.log(elem);
const root = document.getElementById('app');
// remove white space inside root
root.innerHTML = '';

const swap = document.getElementById('swap');
swap.addEventListener('click', () => {
  render(root, elem2, elem);
});

render(root, elem);