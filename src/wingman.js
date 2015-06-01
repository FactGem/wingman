// setup FactGem namespaces
//noinspection JSUnusedAssignment

/** @namespace **/
var FactGem = FactGem || {};
FactGem.wingman = (function namespace() {

    /**
     * @memberOf wingman
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

    /**
     * @memberOf wingman
     * Creates a Relationship between two {Node} objects with a name, an optional type and a direction
     * @param name (String} the name that will be used to identify this rel
     * @param type {String} The type of the rel. Type is optional.
     * @param direction. {String} The direction of the node. Can be either incoming or outgoing.
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
        this.start = startNode;
        this.rel = relationship;
        this.end = endNode;
        this.whereClause = null;
    }

    Match.prototype.parameters = function () {
        var params = {};
        if (this.whereClause) {
            params[this.whereClause.property] = this.whereClause.valueReference;
            var childWhere = this.whereClause.whereClause;
            while (childWhere) {
                params[childWhere.property] = childWhere.valueReference;
                childWhere = childWhere.whereClause;
            }
        }
        return params;

    };

    /**
     * sets the Start node for the {Match}
     * @param startnode
     * @returns {Match}
     */
    Match.prototype.startNode = function (startnode) {
        this.start = startnode;
        return this;
    };

    /**
     * sets the {Relationship} for the {Match}
     * @param relationship
     * @returns {Match}
     */
    Match.prototype.relationship = function (relationship) {
        this.rel = relationship;
        return this;
    };

    /**
     * sets the end node for the {Match}
     * @param endnode
     * @returns {Match}
     */
    Match.prototype.endNode = function (endnode) {
        this.end = endnode;
        return this;
    };

    Match.prototype.toString = function () {
        var value = this.start.toString();
        if (this.rel) {
            value = value + this.rel.toString();
            if (this.end) { // don't even look for an end node if there is no rel
                value = value + this.end.toString();
            }
        }

        if (this.whereClause) {
            value += " " + this.whereClause.toString();
        }
        return value;
    };

    /**
     * Creates a new Where clause that is associated with this match
     * @param name
     * @param property
     * @returns {Where}
     */
    Match.prototype.where = function (name, property) {
        var whereClause = new Where(name, property, this);
        this.whereClause = whereClause;
        return whereClause;
    };

    Match.prototype.whereHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkHasProperty = true;
        this.whereClause = whereClause;
        return whereClause;
    };

    Match.prototype.whereNotHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkNotHasProperty = true;
        this.whereClause = whereClause;
        return whereClause;
    };

    /**
     * Creates a new Where clause
     * @param name The variable name. Must match an existing name in the associated Match clause
     * @param property the name of the property on the variable for which the comparison will be performed
     * @param parent The {Match} clause to which this where belongs
     * @constructor
     */
    function Where(name, property, parent) {
        this.name = name;
        this.property = property;
        this.operator = null;
        this.valueReference = null;
        this.parent = parent;
        this.whereClause = null;
        this.joiningOperator = null;
        this.checkHasProperty = false;
        this.checkNotHasProperty = false;
    }

    Where.prototype.andWhereHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'AND';
        return this.whereClause;
    };

    Where.prototype.andWhereNotHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkNotHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'AND';
        return this.whereClause;
    };

    Where.prototype.orWhereHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'OR';
        return this.whereClause;
    };

    Where.prototype.orWhereNotHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkNotHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'OR';
        return this.whereClause;
    };

    /**
     * Adds a new {Where} clause that is joined to the previous clause via the AND operator
     * @param name The variable name. Must match an existing name in the associated Match clause
     * @param property the name of the property on the variable for which the comparison will be performed
     * @returns {Where}
     */
    Where.prototype.andWhere = function (name, property) {
        this.whereClause = new Where(name, property, this);
        this.joiningOperator = 'AND';
        return this.whereClause;
    };

    /**
     * Adds a new {Where} clause that is joined to the previous clause via the OR operator
     * @param name The variable name. Must match an existing name in the associated Match clause
     * @param property the name of the property on the variable for which the comparison will be performed
     * @returns {Where}
     */
    Where.prototype.orWhere = function (name, property) {
        this.whereClause = new Where(name, property, this);
        this.joiningOperator = 'OR';
        return this.whereClause;
    };

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
        var firstWhere = this;
        var foundFirstWhere = false;
        while (!foundFirstWhere) {
            if (firstWhere.parent && firstWhere.parent instanceof Where) {
                firstWhere = firstWhere.parent;
            } else {
                foundFirstWhere = true;
            }
        }

        return firstWhere.stringValue();
    };

    /**
     * Recursive function to return the String value of this {Where} clause. Should only be called internally by to toString() method
     * @returns {string}
     */
    Where.prototype.stringValue = function () {
        var value = "where ";
        if (this.checkHasProperty) {
            value += "has(" + this.name + '.' + this.property + ")";
        } else {
            if (this.checkNotHasProperty) {
                value += "NOT has(" + this.name + '.' + this.property + ")";
            } else {
                value += this.name + '.' + this.property + this.operator + '{' + this.valueReference + '}';
            }
        }
        if (this.whereClause) {
            var childString = this.whereClause.stringValue();
            value += " " + this.joiningOperator + childString.substr(5, childString.length);
        }
        return value;
    };

    Where.prototype.params = function () {
        var params = {};
        params[this.property] = this.valueReference;
        if (this.whereClause) {
            var childparams = this.whereClause.params();
            for (var property in childparams) {
                if (childparams.hasOwnProperty(property)) {
                    params[property] = childparams[property];
                }
            }
        }
        return params;
    };

    // Cypher class
    function Cypher() {
        this.matches = [];
        this.optionalMatches = [];
        this.orderByVariable = null;
        this.orderByProperty = null;
        this.skip = 0;
        this.limit = null;
        this.returns = [];
        this.orderDescending = false;
        this.distinct = false;
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
     * Sets the number of results to skip before returning data
     * @param skip
     * @returns {Cypher}
     */
    Cypher.prototype.andSkip = function (skip) {
        if (skip > 0) {
            this.skip = skip;
        }
        return this;
    };

    /**
     * Sets the maximum number of results to return
     * @param limit
     * @returns {Cypher}
     */
    Cypher.prototype.limitTo = function (limit) {
        if (limit > 0) {
            this.limit = limit;
        }
        return this;
    };


    /**
     * Adds a new return clause to the Cypher statement
     * @returns {Return}
     */
    Cypher.prototype.andReturn = function () {
        var returnClause = new Return(this);
        this.returns.push(returnClause);
        return returnClause;
    };

    Cypher.prototype.parameters = function () {
        var params = {};
        for (var index in this.matches) {
            //noinspection JSUnfilteredForInLoop
            var childParams = this.matches[index].parameters();
            for (var param in childParams) {
                params[param] = childParams[param];
            }
        }
        return params;
    };

    /**
     * Returns a cyhper representation of the current state of this object
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
        if (this.optionalMatches.length) {
            value += ' optional match ';
        }
        for (index in this.optionalMatches) {
            //noinspection JSUnfilteredForInLoop
            value = value + this.optionalMatches[index];
            if (index + 1 < this.optionalMatches.length) {
                value = value + ", ";
            }
        }
        if (this.returns.length) {
            value += ' return ';
            if (this.distinct) {
                value += 'distinct ';
            }
            for (index in this.returns) {
                //noinspection JSUnfilteredForInLoop
                value += this.returns[index];
                if (index + 1 < this.returns.length) {
                    value = value + ", ";
                }
            }
        }
        if (this.orderByVariable) {
            value += ' order by ' + this.orderByVariable;
            if (this.orderByProperty) {
                value += '.' + this.orderByProperty;
            }
            if (this.orderDescending) {
                value += ' desc'
            }
        }

        if (this.skip) {
            value += ' skip ' + this.skip;
        }

        if (this.limit) {
            value += ' limit ' + this.limit;
        }

        value += ';';
        return value;
    };

    /**
     * Create a new, empty Return clause
     * @constructor
     */
    function Return(cypher) {
        this.variableName = null;
        this.propertyName = null;
        this.count = false;
        this.containingCypher = cypher;
    }

    /**
     * Sets the variable to be returned
     * @param variable The variable to be returned
     * @returns {Return}
     */
    Return.prototype.variable = function (variable) {
        this.variableName = variable;
        return this;
    };

    /**
     * Sets the property of the provided variable to be returned
     * @param property The property to be returned
     * @returns {Return}
     */
    Return.prototype.property = function (property) {
        this.propertyName = property;
        return this;
    };

    /**
     * Adds another return clause to the cypher statement
     * @returns {Return}
     */
    Return.prototype.andReturn = function () {
        var returnClause = new Return();
        returnClause.containingCypher = this.containingCypher;
        this.containingCypher.returns.push(returnClause);
        return returnClause;
    };

    /**
     * Sets the property of a node for use in ordering the results in ascending order
     * @param variable the variable previously assigned that should now be used for ordering
     * @param property the property of the identified node to use for ordering results
     */
    Return.prototype.orderBy = function (variable, property) {
        this.containingCypher.orderByVariable = variable;
        this.containingCypher.orderByProperty = property;
        return this;
    };

    Return.prototype.descending = function () {
        this.containingCypher.orderDescending = true;
        return this;
    };

    /**
     * Sets the number of results to skip when returning results. Defaults to 0
     * @param skip
     * @returns {Return}
     */
    Return.prototype.skip = function (skip) {
        this.containingCypher.skip = skip;
        return this;
    };

    /**
     * Sets the maximum number of results to return. Is not set by default meaning that all results will be returned
     * @param limit
     * @returns {Return}
     */
    Return.prototype.limit = function (limit) {
        this.containingCypher.limit = limit;
        return this;
    };

    /**
     * Used to indicate if this return clause should only return distinct values
     * @returns {Return}
     */
    Return.prototype.distinctValues = function () {
        this.containingCypher.distinct = true;
        return this;
    };

    /**
     * Used to indicate that this return clause should return a count of the results
     * @returns {Return}
     */
    Return.prototype.countResults = function () {
        this.count = true;
        return this;
    };

    /**
     * Outputs Return as valid cypher
     */
    Return.prototype.toString = function () {
        var value = '';
        if (this.count) { // count statement
            value += 'count(';
        }  // plain vanilla return
        value += this.variableName;
        if (this.propertyName) {
            value += '.' + this.propertyName;
        }
        if (this.count) { // count statement
            value += ')'
        }
        return value;
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


