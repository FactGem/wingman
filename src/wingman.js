// setup FactGem namespaces
//noinspection JSUnusedAssignment

var FactGem = FactGem || {};
/** @namespace **/
FactGem.wingman = (function namespace() {

    /**
     * @memberOf wingman
     * Creates a new node with a name and a type. Only a name is required.
     * @param name {String} the name that will be used to identify this node
     * @param type {String} The type of the node being represented. This parameter is optional.
     * @constructor
     */
    function Node(name, type) {
        this.name = name;
        this.type = type;
        this.properties = {};
    }

    /**
     * Provides a String representation of this node that is compatible with parameterized Cypher syntax
     * @returns {string}
     */
    Node.prototype.toParameterizedString = function () {
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
     * Returns the cypher representation of this node
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
                    if (typeof this.properties[property] == 'string') {
                        value = value + property + ":'" + this.properties[property] + "'";
                    } else {
                        value = value + property + ":" + this.properties[property];
                    }
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
     * @param name {String} The name of the node property that should be matched
     * @param value {String} The value of the property
     * @returns {Node}
     */
    Node.prototype.addProperty = function (name, value) {
        this.properties[name] = value;
        return this;
    };

    /**
     * @memberOf wingman
     * Creates a Relationship between two {Node} objects with a name, an optional type and a direction
     * @param name {String} the name that will be used to identify this rel
     * @param type {String} The type of the rel. Type is optional.
     * @param direction {String} The direction of the node. Can be either incoming or outgoing.
     * @constructor
     */
    function Relationship(name, type, direction) {
        this.name = name;
        this.type = type;
        if (typeof(direction) === 'undefined') {
            this.direction = 'OUTGOING';
        } else {
            this.direction = direction;
        }
        this.properties = {};
    }

    /**
     * Provides a parameterized String representation of this Relationship that is compatible with Cypher syntax
     * @returns {string}
     */
    Relationship.prototype.toParameterizedString = function () {
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
                    if (typeof this.properties[property] == 'string') {
                        value = value + property + ":'" + this.properties[property] + "'";
                    } else {
                        value = value + property + ":" + this.properties[property];
                    }
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
     * @param name {String} The name of the Relationship property that should be matched
     * @param value {{}} The value of the property
     * @returns {Relationship}
     */
    Relationship.prototype.addProperty = function (name, value) {
        this.properties[name] = value;
        return this;
    };

    /**
     * @memberOf wingman
     * Creates a new Match clause
     * @param startNode {Node} Required starting node for the match
     * @param relationship {Relationship} Optional relationship
     * @param endNode {Node} Required if relationship is present
     * @constructor
     */
    function Match(startNode, relationship, endNode) {
        this.start = startNode;
        this.rel = relationship;
        this.end = endNode;
        this.whereClause = null;
    }

    /**
     * Returns the parameters for this Match and all child Match clauses. Should not be called externally.
     * @returns {{}}
     */
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
     * sets the Start node for the Match
     * @param startnode {Node}
     * @returns {Match}
     */
    Match.prototype.startNode = function (startnode) {
        this.start = startnode;
        return this;
    };

    /**
     * Sets the Relationship for the Match
     * @param relationship {Relationship}
     * @returns {Match}
     */
    Match.prototype.relationship = function (relationship) {
        this.rel = relationship;
        return this;
    };

    /**
     * Sets the end node for the Match
     * @param endnode {Node}
     * @returns {Match}
     */
    Match.prototype.endNode = function (endnode) {
        this.end = endnode;
        return this;
    };

    /**
     * Cypher text for this Match and contained Match clauses. Should not be directly called.
     * @returns {string}
     */
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
     * Parameterized Cypher text for this Match and contained Match clauses. Should not be directly called.
     * @returns {string}
     */
    Match.prototype.toParameterizedString = function () {
        var value = this.start.toParameterizedString();
        if (this.rel) {
            value = value + this.rel.toString();
            if (this.end) { // don't even look for an end node if there is no rel
                value = value + this.end.toParameterizedString();
            }
        }

        if (this.whereClause) {
            value += " " + this.whereClause.toParameterizedString();
        }
        return value;
    };

    /**
     * Creates a new Where clause that is associated with this match
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Match.prototype.where = function (name, property) {
        var whereClause = new Where(name, property, this);
        this.whereClause = whereClause;
        return whereClause;
    };

    /**
     * Creates a new Where clause associated with this Match that is based on the existence of a property
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Match.prototype.whereHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkHasProperty = true;
        this.whereClause = whereClause;
        return whereClause;
    };

    /**
     * Creates a new Where clause associated with this Match that is based on the non-existence of a property
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Match.prototype.whereNotHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkNotHasProperty = true;
        this.whereClause = whereClause;
        return whereClause;
    };

    /**
     * @memberof wingman
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

    /**
     * Creates a new Where clause that is based on the existence of a property
     * and is joined to the current where clause with an AND
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Where.prototype.andWhereHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'AND';
        return this.whereClause;
    };

    /**
     * Creates a new Where clause that is based on the non-existence of a property
     * and is joined to the current where clause with an AND
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Where.prototype.andWhereNotHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkNotHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'AND';
        return this.whereClause;
    };

    /**
     * Creates a new Where clause that is based on the existence of a property
     * and is joined to the current where clause with an OR
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Where.prototype.orWhereHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'OR';
        return this.whereClause;
    };

    /**
     * Creates a new Where clause that is based on the non-existence of a property
     * and is joined to the current where clause with an OR
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Where.prototype.orWhereNotHasProperty = function (name, property) {
        var whereClause = new Where(name, property, this);
        whereClause.checkNotHasProperty = true;
        this.whereClause = whereClause;
        this.joiningOperator = 'OR';
        return this.whereClause;
    };

    /**
     * Adds a new Where clause that is joined to the previous clause via the AND operator
     * @param name {String} The variable name. Must match an existing name in the associated Match clause
     * @param property {String} the name of the property on the variable for which the comparison will be performed
     * @returns {Where}
     */
    Where.prototype.andWhere = function (name, property) {
        this.whereClause = new Where(name, property, this);
        this.joiningOperator = 'AND';
        return this.whereClause;
    };

    /**
     * Adds a new {Where} clause that is joined to the previous clause via the OR operator
     * @param name String} The variable name. Must match an existing name in the associated Match clause
     * @param property String} The name of the property on the variable for which the comparison will be performed
     * @returns {Where}
     */
    Where.prototype.orWhere = function (name, property) {
        this.whereClause = new Where(name, property, this);
        this.joiningOperator = 'OR';
        return this.whereClause;
    };

    /**
     * Sets the operator of the Where clause to =
     * @returns {Where}
     */
    Where.prototype.equals = function (value) {
        this.operator = '=';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the Where clause to <
     * @returns {Where}
     */
    Where.prototype.lessThan = function (value) {
        this.operator = '<';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the Where clause to >
     * @returns {Where}
     */
    Where.prototype.greaterThan = function (value) {
        this.operator = '>';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the Where clause to <>
     * @returns {Where}
     */
    Where.prototype.notEqual = function (value) {
        this.operator = '<>';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the Where clause to <=
     * @returns {Where}
     */
    Where.prototype.lessThanOrEqualTo = function (value) {
        this.operator = '<=';
        this.valueReference = value;
        return this;
    };

    /**
     * Sets the operator of the Where clause to >=
     * @returns {Where}
     */
    Where.prototype.greaterThanOrEqualTo = function (value) {
        this.operator = '>=';
        this.valueReference = value;
        return this;
    };

    /**
     * Generates the parameterized cypher for this where clause and all parent where clauses
     * @returns {string}
     */
    Where.prototype.toParameterizedString = function () {
        var firstWhere = this;
        var foundFirstWhere = false;
        while (!foundFirstWhere) {
            if (firstWhere.parent && firstWhere.parent instanceof Where) {
                firstWhere = firstWhere.parent;
            } else {
                foundFirstWhere = true;
            }
        }

        return firstWhere.parameterizedStringValue();
    };

    /**
     * Generates the cypher for this where clause and all parent where clauses
     * @returns {string}
     */
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
     * Recursive function to return the parameterized String value of this {Where} clause. Should only be called internally by to toString() method
     * @returns {string}
     */
    Where.prototype.parameterizedStringValue = function () {
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
            var childString = this.whereClause.parameterizedStringValue();
            value += " " + this.joiningOperator + childString.substr(5, childString.length); // remove initial 'where'
        }
        return value;
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
                if (typeof this.valueReference == 'string') {
                    value += this.name + '.' + this.property + this.operator + "'" + this.valueReference + "'";
                } else {
                    value += this.name + '.' + this.property + this.operator + this.valueReference;
                }
            }
        }
        if (this.whereClause) {
            var childString = this.whereClause.stringValue();
            value += " " + this.joiningOperator + childString.substr(5, childString.length); // remove initial 'where'
        }
        return value;
    };

    /**
     * Returns the parameters of the where clause and all child clauses
     * @returns {{}}
     */
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

    /**
     * @memberof wingman
     * The primary class representing the cypher query
     * @constructor
     */
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

    /**
     * Adds a match clause to the query
     * @param match {Match} Match clause to be added
     * @returns {Cypher}
     */
    Cypher.prototype.addMatch = function (match) {
        this.matches.push(match);
        return this;
    };

    /**
     * Removes a match clause from the cypher query
     * @param match {Match} Match clause to be removed
     * @returns {Cypher}
     */
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

    /**
     * Adds an optional match clause to the query
     * @param match {Match} Match clause to be added
     * @returns {Cypher}
     */
    Cypher.prototype.addOptionalMatch = function (match) {
        this.optionalMatches.push(match);
        return this;
    };

    /**
     * Removes an optional match clause from the query
     * @param match {Match} Match clause to be removed
     * @returns {Cypher}
     */
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
     * @param skip {int} The number of results to skip before returning results
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
     * @param limit {int} The maximum number of results to return
     * @returns {Cypher}
     */
    Cypher.prototype.limitTo = function (limit) {
        if (limit > 0) {
            this.limit = limit;
        }
        return this;
    };


    /**
     * Adds a new empty return clause to the Cypher statement
     * @returns {Return}
     */
    Cypher.prototype.andReturn = function () {
        var returnClause = new Return(this);
        this.returns.push(returnClause);
        return returnClause;
    };

    /**
     * Generates the parameters for this cypher statement
     * @returns {{}}
     */
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
     * Returns a parameterized cyhper representation of the current state of this object
     * @returns {string}
     */
    Cypher.prototype.toParameterizedString = function () {
        var value = 'match ';
        for (var index in this.matches) {
            //noinspection JSUnfilteredForInLoop
            value = value + this.matches[index].toParameterizedString();
            if (index + 1 < this.matches.length) {
                value = value + ", ";
            }
        }
        if (this.optionalMatches.length) {
            value += ' optional match ';
        }
        for (index in this.optionalMatches) {
            //noinspection JSUnfilteredForInLoop
            value = value + this.optionalMatches[index].toParameterizedString();
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
     * Returns a cyhper representation of the current state of this object
     * @returns {string}
     */
    Cypher.prototype.toString = function () {
        var value = 'match ';
        var length = this.matches.length;
        for (var index = 0; index < length; index++) {
            //noinspection JSUnfilteredForInLoop
            value = value + this.matches[index];
            if (index + 1 < length) {
                value = value + ", ";
            }
        }
        if (this.optionalMatches.length) {
            value += ' optional match ';
        }
        length = this.optionalMatches.length;
        for (index = 0; index < length; index++) {
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
            length = this.returns.length;
            for (index = 0; index < length; index++) {
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
     * @memberof wingman
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
     * @param variable {String} The variable to be returned
     * @returns {Return}
     */
    Return.prototype.variable = function (variable) {
        this.variableName = variable;
        return this;
    };

    /**
     * Sets the property of the provided variable to be returned
     * @param property {String} The property to be returned
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
     * @param variable {String} the variable previously assigned that should now be used for ordering
     * @param property {String} the property of the identified node to use for ordering results
     */
    Return.prototype.orderBy = function (variable, property) {
        this.containingCypher.orderByVariable = variable;
        this.containingCypher.orderByProperty = property;
        return this;
    };

    /**
     * Sets the sort order to descending
     * @returns {Return}
     */
    Return.prototype.descending = function () {
        this.containingCypher.orderDescending = true;
        return this;
    };

    /**
     * Sets the number of results to skip when returning results. Defaults to 0
     * @param skip {int} the number of results to skip before returning results
     * @returns {Return}
     */
    Return.prototype.skip = function (skip) {
        this.containingCypher.skip = skip;
        return this;
    };

    /**
     * Sets the maximum number of results to return. Is not set by default meaning that all results will be returned
     * @param limit {int} the maximum number of results to return
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
     * Generates cypher text
     * @returns {string}
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


