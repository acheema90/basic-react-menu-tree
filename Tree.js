import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import invariant from 'invariant';

class Node extends React.Component{
    getRootCssClass(){
        return this.props.classNamePrefix + "-node";
    }
    getAncestry(){
        return this.props.ancestor.concat(this.props.id);
    }

    isStateful(){
        return this.props.stateful ? true : false;
    }
    getLabelNode(){
        var props = this.props,
            labelClassName = props.classNamePrefix + "-node-label";

        var displayLabel = props.label;

        if (props.labelFilter)
            displayLabel = props.labelFilter(displayLabel);

        return this.props.labelFactory(labelClassName, displayLabel, this.getAncestry());
    }
    getChildrenNode(){
        var props = this.props;
        var children = props.children;
        if (this.isStateful()) {
            var state = this.state;
            children = React.Children.map(props.children, function (child) {
                return React.cloneElement(child, {
                    key: child.key,
                    ref: child.ref
                })
            });
        }
        return (
            <div className={this.getRootCssClass() + "-children"}>
                {children}
            </div>
        );
    }
    render(){
        return (
            <div className={this.getRootCssClass()}>
                <span >
                    {this.getLabelNode()}
                </span>
                {this.getChildrenNode()}
            </div>
        );
    }
}

Node.propTypes={
    stateful: React.PropTypes.bool,
    classNamePrefix: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    labelFilter: React.PropTypes.func,
    labelFactory: React.PropTypes.func,
    onClick: React.PropTypes.func
};

Node.defaultProps={
    stateful: false,
    labelFactory: function (labelClassName, displayLabel) {
        return <label className={labelClassName}>{displayLabel}</label>;
    },
    onClick: function(lineage) {
        console.log("Tree Node clicked: " + lineage.join(" > "));
    }
};

let NodeFactory= React.createFactory(Node);

class Tree extends  React.Component{
    getDataFromChildren(children) {
        var iterableChildren = Array.isArray(children) ? children : [children];

        var self = this;
        return _.map(iterableChildren,function (child) {

            var data = _.clone(_.omit(child.props, "children"));

            if (child.props.children) {
                data.children = self.getDataFromChildren(child.props.children);
            }

            return data;
        });
    }
    getTreeNodeProps (rootProps, props, ancestor, isRootNode, childIndex) {
        return _.assignIn({
            ancestor: ancestor,
            onClick: rootProps.onTreeNodeClick,
            id: this.getNodeId(rootProps, props, childIndex),
            key: "tree-node-" + ancestor.join(".") + childIndex
        }, _.pick(rootProps, "classNamePrefix", "stateful",'labelFilter','labelFactory'));
    }

    getNodeId (rootProps, props, childIndex) {
        return rootProps.identifier && props[rootProps.identifier] ? props[rootProps.identifier] : childIndex;
    }
    getTreeNodes(){
        var treeMenuProps = this.props,
            treeData;

        invariant(!treeMenuProps.children || !treeMenuProps.data,
            "Either children or data props are expected in TreeMenu, but not both");

        if (treeMenuProps.children) {
            treeData = this.getDataFromChildren(treeMenuProps.children);
        } else {
            treeData = treeMenuProps.data;
        }

        var thisComponent = this;


        function dataToNodes(data, ancestor) {

            var isRootNode = false;
            if (!ancestor) {
                isRootNode = true;
                ancestor = [];
            }

            var nodes = _.map(data, function(dataForNode, i) {

                var nodeProps = _.omit(dataForNode, ["children", "onClick"]),
                    children = [];

                nodeProps.label = nodeProps.label || i;

                if (dataForNode.children) {
                    children = dataToNodes(dataForNode.children, ancestor.concat(thisComponent.getNodeId(treeMenuProps, nodeProps, i)));
                }

                nodeProps = Object.assign(nodeProps, thisComponent.getTreeNodeProps(treeMenuProps, nodeProps, ancestor, isRootNode, i));

                return NodeFactory(nodeProps, children);

            });

            return nodes;

        }

        if (treeData) {
            return dataToNodes(treeData);
        }

    }

    render(){
        var props = this.props;
        return (
            <div className={props.classNamePrefix}>
                {this.getTreeNodes()}
            </div>);
    }
}

Tree.propTypes={
    stateful: React.PropTypes.bool,
    classNamePrefix: React.PropTypes.string,
    identifier: React.PropTypes.string,
    onTreeNodeClick: React.PropTypes.func,
    labelFilter: React.PropTypes.func,
    labelFactory: React.PropTypes.func,
    data: React.PropTypes.array
};
Tree.defaultProps={
    classNamePrefix: "tree-view",
    stateful: false
};

export default Tree;