A reusable Tree Menu component in React that can accept an array of any dimension.

Using the new ES6-Babel-Webpack build process for React apps.

```bash
npm install babel -g
npm install
webpack-dev-server
```
Go to localhost:3333.

Usage:
```code
const data=[{
      label : "Option 1"
    },
    {
      label : "Option 2",
      children : []
    }
    ...
  ]; //the data array. MUST have a label
  
ReactDOM.render(<Tree data={data}/>,document.getElementById('foo'));
```
