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
                    value = value + property + ":{" + this.properties[property] + '}';
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
                    value = value + property + ":{" + this.properties[property] + '}';
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
        this.whereClause = null;
    }

    /**
     * sets the Start node for the {Match}
     * @param startnode
     * @returns {Match}
     */
    Match.prototype.withStartNode = function (startnode) {
        this.startNode = startnode;
        return this;
    };

    /**
     * sets the {Relationship} for the {Match}
     * @param relationship
     * @returns {Match}
     */
    Match.prototype.withRelationship = function (relationship) {
        this.relationship = relationship;
        return this;
    };

    /**
     * sets the end node for the {Match}
     * @param endnode
     * @returns {Match}
     */
    Match.prototype.withEndNode = function (endnode) {
        this.endNode = endnode;
        return this;
    };

    Match.prototype.toString = function () {
        var value = this.startNode.toString();
        if (this.relationship) {
            value = value + this.relationship.toString();
            if (this.endNode) { // don't even look for an end node if there is no relationship
                value = value + this.endNode.toString();
            }
        }
        if (this.whereClause) {
            value = value + " " + this.whereClause.toString();
        }
        return value;
    };

    /**
     * Creates a new Where clause that is associated with this match
     * @param name
     * @param property
     */
    Match.prototype.where = function (name, property) {
        this.whereClause = new Where(name, property);
        return this.whereClause;
    };

    /**
     * Creates a new Where clause
     * @param name The variable name. Must match an existing name in the associated Match clause
     * @param property the name of the property on the variable for which the comparison will be performed
     * @constructor
     */
    function Where(name, property) {
        this.name = name;
        this.property = property;
        this.operator = null;
        this.valueReference = null;
    }

    /**
     * Sets the operator of the {Where} clause to =
     * @returns {Where}
     */
    Where.prototype.equals = function (value) {
        this.operator = '=';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the {Where} clause to <
     * @returns {Where}
     */
    Where.prototype.lessThan = function (value) {
        this.operator = '<';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the {Where} clause to >
     * @returns {Where}
     */
    Where.prototype.greaterThan = function (value) {
        this.operator = '>';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the {Where} clause to <>
     * @returns {Where}
     */
    Where.prototype.notEqual = function (value) {
        this.operator = '<>';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the {Where} clause to <=
     * @returns {Where}
     */
    Where.prototype.lessThanOrEqualTo = function (value) {
        this.operator = '<=';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the {Where} clause to >=
     * @returns {Where}
     */
    Where.prototype.greaterThanOrEqualTo = function (value) {
        this.operator = '>=';
        this.valueReference = value;
        return this;
    };

    Where.prototype.toString = function () {
        return 'where ' + this.name + '.' + this.property + this.operator + '{' + this.valueReference + '}';
    };

    // Cypher class
    function Cypher() {
        this.matches = [];
        this.optionalMatches = [];
        this.orderByName = null;
        this.orderByProperty = null;
        this.skip = 0;
        this.limit = null;
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
     * @returns {string}
     */
    Cypher.prototype.toString = function () {
        var value = 'match ';
        for (var index in this.matches) {
            //noinspection JSUnfilteredForInLoop
            value = value + this.matches[index];
            if (index + 1 < this.matches.length) {
                value = value + ", ";
            }
        }
        return value;
    };


    /**
     * Create a new, empty Return clause
     * @constructor
     */
    function Return() {
        this.name = null;
        this.property = null;
        this.orderBy = null;
        this.skip = null;
        this.limit = null;
        this.distince = false;
        this.orderDescending = false;
    }

    /**
     * Sets the property of a node for use in ordering the results in ascending order
     * @param name the name previously assigned to the node that should now be used for ordering
     * @param property the property of the identified node to use for ordering results
     */
    Return.prototype.orderBy = function (name, property) {
        this.orderBy = name;
        return this;
    };

    /**
     * Sets the number of results to skip when returning results. Defaults to 0
     * @param skip
     */
    Return.prototype.skip = function (skip) {
        this.skip = skip;
        return this;
    };

    /**
     * Sets the maximum number of results to return. Is not set by default meaning that all results will be returned
     * @param limit
     * @returns {Cypher}
     */
    Return.prototype.limit = function (limit) {
        this.limit = limit;
        return this;
    };


    // utility functions that will not be publicly exposed

    // Make the classes in the namespace publicly available
    return {
        Node: Node,
        Relationship: Relationship,
        Match: Match,
        Where: Where,
        Cypher: Cypher,
        Return: Return
    };
}());


