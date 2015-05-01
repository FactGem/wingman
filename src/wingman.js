// setup FactGem namespaces
//noinspection JSUnusedAssignment
var FactGem = FactGem || {};
FactGem.wingman = (function namespace() {

    // Node class
    function Node(name, type) {
        this.name = name;
        this.type = type;
        this.properties = {};
    }

    Node.prototype.toString = function () {
        var value = "(" + this.name + ":" + this.type;
        var length = Object.keys(this.properties).length;
        if (length) {
            value = value + " {";
            var propertyCount = 0;
            for (var property in this.properties) {
                if (this.properties.hasOwnProperty(property)) {
                    value = value + property + ":" + this.properties[property];
                    propertyCount++;
                    if (propertyCount < length) {
                        value = value + ", ";
                    }
                }
            }
            value = value + "}";
        }
        value = value + ")";
        return value;
    };

    Node.prototype.addProperty = function (name, value) {
        this.properties[name] = value;
        return this;
    };

    // Relationship class

    function Relationship(name, type, direction) {
        this.name = name;
        this.type = type;
        this.direction = direction;
        this.properties = {};
    }

    Relationship.prototype.toString = function () {
        var value = "";
        if (this.direction.toUpperCase() == "INCOMING") {
            value = "<-";
        } else {
            value = "-";
        }
        value = value + "[" + this.name + ":" + this.type;
        var length = Object.keys(this.properties).length;
        if (length) {
            value = value + " {";
            var propertyCount = 0;
            for (var property in this.properties) {
                if (this.properties.hasOwnProperty(property)) {
                    value = value + property + ":" + this.properties[property];
                    propertyCount++;
                    if (propertyCount < length) {
                        value = value + ", ";
                    }
                }
            }
            value = value + "}";
        }
        value = value + "]";
        if (this.direction.toUpperCase() == "OUTGOING") {
            value = value + "->";
        } else {
            value = value + "-";
        }
        return value;
    };


    Relationship.prototype.addProperty = function (name, value) {
        this.properties[name] = value;
        return this;
    };

    // Path class
    function Path(startNode, relationship, endNode) {
        this.startNode = startNode;
        this.relationship = relationship;
        this.endNode = endNode;
    }

    Path.prototype.toString = function () {
        var value = this.startNode.toString();
        if (this.relationship) {
            value = value + this.relationship.toString();
            if (this.endNode) { // don't even look for an end node if there is no relationship
                value = value + this.endNode.toString();
            }
        }
        return value;
    };


    // utility functions that will not be publicly exposed

    // Make the classes in the namespace publicly available
    return {
        Node: Node,
        Relationship: Relationship,
        Path: Path
    };
}());


