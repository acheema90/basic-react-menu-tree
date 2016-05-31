import React from 'react';
import ReactDOM from 'react-dom';
import Tree from './Tree';

const data=[
    {
        label : "Option 1"
    },
    {
        label : "Option 2",
        children : [
            {
                label: "Sub Option A",
                children: [
                    {
                        label: "Third Level Option 1"

                    },
                    {
                        label: "Third Level Option 2"
                    }
                ]
            },
            {
                label: "Sub Option B"
            }
        ]
    }
];

ReactDOM.render(
    <Tree data={data}/>,document.getElementById('app'));