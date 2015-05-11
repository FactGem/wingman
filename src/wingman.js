// setup FactGem namespaces
//noinspection JSUnusedAssignment
var FactGem = FactGem || {};
FactGem.wingman = (function namespace() {

    // Node class
    /**
     * Creates a new node with a name and a type. Only a name is required.
     * @param name the name that will be used to identify this node
     * @param type The type of the node being represented. This parameter is optional.
     * @constructor
     */
    function Node(name, type) {
        this.name = name;
        this.type = type;
        this.properties = {};
    }

    /**
     * Provides a String representation of this node that is compatible with Cypher syntax
     * @returns {string}
     */
    Node.prototype.toString = function () {
        var value = "(" + this.name;
        if (this.type) {
            value = value + ":" + this.type;
        }
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

    /**
     * Adds a property to the node. Properties provide matching at the node level when constructing cypher queries
     * @param name The name of the node property that should be matched
     * @param value The value of the property
     * @returns {Node}
     */
    Node.prototype.addProperty = function (name, value) {
        this.properties[name] = value;
        return this;
    };

    // Relationship class

    /**
     * Creates a Relationship between two {Node} objects with a name, an optional type and a direction
     * @param name the name that will be used to identify this relationship
     * @param type The type of the relationship. Type is optional.
     * @param direction. The direction of the node. Can be either incoming or outgoing.
     * @constructor
     */
    function Relationship(name, type, direction) {
        this.name = name;
        this.type = type;
        this.direction = direction;
        this.properties = {};
    }

    /**
     * Provides a String representation of this Relationship that is compatible with Cypher syntax
     * @returns {string}
     */
    Relationship.prototype.toString = function () {
        var value = "";
        if (this.direction.toUpperCase() == "INCOMING") {
            value = "<-";
        } else {
            value = "-";
        }
        value = value + "[" + this.name;
        if (this.type) {
            value = value + ":" + this.type;
        }
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

    /**
     * Adds a property to the Relationship. Properties provide matching at the Relationship level when constructing cypher queries
     * @param name The name of the Relationship property that should be matched
     * @param value The value of the property
     * @returns {Relationship}
     */
    Relationship.prototype.addProperty = function (name, value) {
        this.properties[name] = value;
        return this;
    };

    // Match class
    function Match(startNode, relationship, endNode) {
        this.startNode = startNode;
        this.relationship = relationship;
        this.endNode = endNode;
    }

    Match.prototype.toString = function () {
        var value = this.startNode.toString();
        if (this.relationship) {
            value = value + this.relationship.toString();
            if (this.endNode) { // don't even look for an end node if there is no relationship
                value = value + this.endNode.toString();
            }
        }
        return value;
    };

    // Cypher class

    function Cypher() {
        this.matches = [];
        this.optionalMatches = []
    }

    Cypher.prototype.addMatch = function (match) {
        this.matches.push(match);
        return this;
    };

    Cypher.prototype.removeMatch = function (match) {
        var location = -1;
        for (var index = 0; index < this.matches.length; index++) {
            if (this.matches[index] === match) {
                location = index;
                break;
            }
        }
        if (location > -1) {
            // remove the item from the matches array and create a new array without the path so we don't end up with a sparse array
            var newMatches = [];
            for (index = 0; index < this.matches.length; index++) {
                if (index != location) {
                    newMatches.push(this.matches[index]);
                }
            }
            this.matches = newMatches;
        }
        return this;
    };

    Cypher.prototype.addOptionalMatch = function (match) {
        this.optionalMatches.push(match);
        return this;
    };

    Cypher.prototype.removeOptionalMatch = function (match) {
        var location = -1;
        for (var index = 0; index < this.optionalMatches.length; index++) {
            if (this.optionalMatches[index] === match) {
                location = index;
                break;
            }
        }
        if (location > -1) {
            // remove the item from the matches array and create a new array without the path so we don't end up with a sparse array
            var newMatches = [];
            for (index = 0; index < this.optionalMatches.length; index++) {
                if (index != location) {
                    newMatches.push(this.optionalMatches[index]);
                }
            }
            this.optionalMatches = newMatches;
        }
        return this;
    };

    /**
     *
     */
    Cypher.prototype.toString = function () {
        var matchCount = 0;
        var value = '';
        for (var index in this.matches) {
            value = value + 'match ' + this.matches[index];
            matchCount++;
            if (matchCount < length) {
                value = value + ", ";
            }
        }
        return value;
    };

    // utility functions that will not be publicly exposed

    // Make the classes in the namespace publicly available
    return {
        Node: Node,
        Relationship: Relationship,
        Match: Match,
        Cypher: Cypher
    };
}());


