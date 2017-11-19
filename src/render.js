export function h(type, props, ...children) {
    return {
      type,
      props: props || {},
      children
    };
  }
  
  function changed(newVdom, oldVdom) {
    // type, 
    return typeof newVdom !== typeof oldVdom || 
      (typeof newVdom === 'string' && newVdom !== oldVdom) ||
      newVdom.type !== oldVdom.type;
  }

  function isEventListener(prop) {
    return /^on[A-Z]/.test(prop);
  }
  
  function extractEventName(prop) {
    return prop.replace(/^on/, '').toLocaleLowerCase();
  }

  function setProps(elem, props) {
    Object.keys(props).forEach((key) => {
      // TODO: is custom props
      // TODO: diff props
      // TODO: remove unused event listener
      const val = props[key];
      if (key === 'className') { // className, don't setAttribute
        elem.className = val;
      } else if (isEventListener(key)) { // event listener
        elem.addEventListener(extractEventName(key), val);
      } else if (typeof val === 'object') { // normal attributes
        elem.setAttribute(key, Object.keys(val).reduce((acc, prop) => `${acc};${prop}:${val[prop]}`, ''));
      } else {
        elem.setAttribute(key, val);
        // bool value
        if (typeof val === 'boolean') {
          elem[key] = val;
        }
      }
    });
  }
  
  function createElement(vdom) {
    let child;
    if (typeof vdom === 'string') {
      // text node
      child = document.createTextNode(vdom);
    } else {
      // create element
      child = document.createElement(vdom.type);
      setProps(child, vdom.props);

      for (let i = 0; i < vdom.children.length; i++) {
        child.appendChild(
          createElement(vdom.children[i])
        );
      }
    }
  
    return child;
  }
  
  function removeElement(parent, index) {
    const child = parent.childNodes[index];
    parent.removeChild(child);
  }
  
  export function render(parent, newVdom, oldVdom, index = 0) {
    console.log('render', parent, newVdom, oldVdom, index);
    if (!newVdom) {
      // remove
      removeElement(parent, index);
    } else if (!oldVdom) {
      // create
      parent.appendChild(
        createElement(newVdom)
      );
    } else if (changed(newVdom, oldVdom)) {
      // replace
      parent.replaceChild(
        createElement(newVdom),
        parent.childNodes[index],
      );
    } else if (newVdom.type) {
      // nothing changes, update childNodes
      const newChildren = newVdom.children;
      const oldChildren = oldVdom.children;
      const len = Math.max(newChildren.length, oldChildren.length);

      console.log('next parent',parent.childNodes[index], index,
        ' which corresponds to', newVdom);
      for (let i = 0; i < len; i++) {
        // TODO: use key to identify rather then index
        render(
          parent.childNodes[index],
          newChildren[i],
          oldChildren[i],
          i
        );
      }
    }
  }