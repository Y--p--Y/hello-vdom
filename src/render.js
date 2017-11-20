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

  function isCustomProp(name) {
    return false;
  }

  function removeBooleanProp(elem, name) {
    elem.setAttribute(name, false);
    elem[name] = false;
  }

  function removeProp(elem, name, oldVal) {
    if (isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      elem.removeAttribute('class');
    } else if (isEventListener(name)) { // event listener
      elem.removeEventListener(extractEventName(key));
    } else if (typeof oldVal === 'boolean') {
      removeBooleanProp(elem, name);
    } else {
      elem.removeAttribute(name);
    }
  }

  function setProp(elem, name, value) {
    if (isCustomProp(name)) {
      return;
    } else if (name === 'className') { // className, don't setAttribute
      elem.className = value;
    } else if (isEventListener(name)) { // event listener
      elem.addEventListener(extractEventName(name), value);
    } else if (typeof value === 'object') { // normal attributes
      elem.setAttribute(name,
        Object.keys(value).reduce((acc, prop) => `${acc};${prop}:${value[prop]}`, ''));
    } else {
      elem.setAttribute(name, value);
      // bool value
      if (typeof value === 'boolean') {
        elem[name] = value;
      }
    }
  }

  function setProps(elem, props) {
    Object.keys(props).forEach((key) => {
      setProp(elem, key, props[key]);
    });
  }

  function updateProp(elem, prop, newVal, oldVal) {
    if (!newVal) {
      removeProp(elem, prop, oldVal);
    } else if (oldVal && isEventListener(name)) { // event listener
      if (newVal != oldVal) {
        removeProp(elem, props, oldVal);
        setProp(elem, props, newVal);
      }
    } else {
      setProp(elem, prop, newVal);
    }
  }

  function updateProps(elem, newProps, oldProps) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach((prop) => {
      updateProp(elem, prop, newProps[prop], oldProps[prop]);
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
      const elem = parent.childNodes[index];
      // update props
      updateProps(elem, newVdom.props, oldVdom.props);

      // nothing changes, update childNodes
      const newChildren = newVdom.children;
      const oldChildren = oldVdom.children;
      const len = Math.max(newChildren.length, oldChildren.length);

      console.log('next parent', elem, index, ' which corresponds to', newVdom);
      for (let i = 0; i < len; i++) {
        // TODO: use key to identify rather then index
        render(
          elem,
          newChildren[i],
          oldChildren[i],
          i
        );
      }
    }
  }