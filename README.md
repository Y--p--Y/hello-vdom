# Hello VDOM
Try to implement Virtual DOM.

## Reference
 - https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060
 - https://medium.com/@deathmood/write-your-virtual-dom-2-props-events-a957608f5c76

### childNodes vs children
`childNodes` includes all child nodes, including non-element nodes like text and comment nodes. To get a collection of only elements, use `ParentNode.children` instead.