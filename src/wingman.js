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
     * @param direction {String} The direction of the node. Can be either incoming, outgoing, or both.
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
     * Creates a new Pattern. A Pattern describes at least one node and an optional relationship to another node.
     * @param startNode {Node} Required starting node for the match
     * @param relationship {Relationship} Optional relationship
     * @param endNode {Node} Required if relationship is present
     * @constructor
     */
    function Pattern(startNode, relationship, endNode) {
        this.start = startNode;
        this.rel = relationship;
        this.end = endNode;
    }

    /**
     * sets the Start node for the Match
     * @param startnode {Node}
     * @returns {Pattern}
     */
    Pattern.prototype.startNode = function (startnode) {
        this.start = startnode;
        return this;
    };

    /**
     * Sets the Relationship for the Match
     * @param relationship {FactGem.wingman.Relationship}
     * @returns {Pattern}
     */
    Pattern.prototype.relationship = function (relationship) {
        this.rel = relationship;
        return this;
    };

    /**
     * Sets the end node for the Match
     * @param endnode {FactGem.wingman.Node}
     * @returns {Pattern}
     */
    Pattern.prototype.endNode = function (endnode) {
        this.end = endnode;
        return this;
    };

    /**
     * @memberOf wingman
     * Creates a new Match clause
     * @param pattern {Pattern} Required pattern to match on
     * @constructor
     */
    function Match(pattern) {
        this.whereClause = null;
        this.patterns = [pattern];
    }

    /**
     * Adds another pattern to the match clause to further define the match
     * @param pattern
     * @returns {Match}
     */
    Match.prototype.addPattern = function (pattern) {
        this.patterns.push(pattern);
        return this;
    };

    /**
     * Removes a match clause from the cypher query
     * @param pattern {Match} Match clause to be removed
     * @returns {Cypher}
     */
    Match.prototype.removePattern = function (pattern) {
        var location = -1;
        for (var index = 0; index < this.patterns.length; index++) {
            if (this.patterns[index] === pattern) {
                location = index;
                break;
            }
        }
        if (location > -1) {
            // remove the item from the matches array and create a new array without the path so we don't end up with a sparse array
            var newPatterns = [];
            for (index = 0; index < this.patterns.length; index++) {
                if (index != location) {
                    newPatterns.push(this.patterns[index]);
                }
            }
            this.patterns = newPatterns;
        }
        return this;
    };

    /**
     * Cypher text for this Match and contained Match clauses. Should not be directly called.
     * @returns {string}
     */
    Match.prototype.toString = function () {
        var value = "";
        for (var index = 0; index < this.patterns.length; index++) {
            value = value + this.patterns[index].start.toString();
            if (this.patterns[index].rel) {
                value = value + this.patterns[index].rel.toString();
                if (this.patterns[index].end) { // don't even look for an end node if there is no rel
                    value = value + this.patterns[index].end.toString();
                }
            }
            if (index < this.patterns.length - 1) {
                value = value + ', '
            }
        }

        if (this.whereClause) {
            value += " where " + this.whereClause.toString();
        }
        return value;
    };

    /**
     * Cypher text for this Match and contained Match clauses. Should not be directly called.
     * @returns {string}
     */
    Match.prototype.toParameterizedString = function () {
        var value = "";
        for (var index = 0; index < this.patterns.length; index++) {
            value = value + this.patterns[index].start.toString();
            if (this.patterns[index].rel) {
                value = value + this.patterns[index].rel.toString();
                if (this.patterns[index].end) { // don't even look for an end node if there is no rel
                    value = value + this.patterns[index].end.toString();
                }
            }
            if (index < this.patterns.length - 1) {
                value = value + ', '
            }
        }

        if (this.whereClause) {
            value += " where " + this.whereClause.toParameterizedString();
        }
        return value;
    };

    /**
     * Creates a new Where clause that is associated with this match
     * @param name {String} The previously assigned name of the node to which this where clause pertains
     * @param property {String} The name of the property
     * @returns {Where}
     */
    Match.prototype.where = function (where) {
        this.whereClause = where;
        return this.whereClause;
    };

    /**
     * @memberof wingman
     * Creates a new Comparison
     * @param seed The variable name. Must match an existing name in the associated Match clause
     * @param property the name of the property on the variable for which the comparison will be performed
     * @param parent The {Match} clause to which this where belongs
     * @constructor
     */
    function Comparison(variable, property, operator, value) {
        this.comparisonVariable = variable;
        this.comparisonProperty = property;
        if (operator) {
            this.comparisonOperator = operator.toUpperCase();
        } else {
            this.comparisonOperator = "";
        }
        this.comparisonValue = value;
        this.joiner = "";
        this.parent = null;
        this.wrapWithHead = false;
    }

    Comparison.prototype.useHead = function () {
        this.wrapWithHead = true;
        return this;
    };

    Comparison.prototype.equals = function (value) {
        this.comparisonOperator = '=';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.notEqual = function (value) {
        this.comparisonOperator = '<>';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.greaterThan = function (value) {
        this.comparisonOperator = '>';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.greaterThanOrEqualTo = function (value) {
        this.comparisonOperator = '>=';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.lessThan = function (value) {
        this.comparisonOperator = '<';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.lessThanOrEqualTo = function (value) {
        this.comparisonOperator = '<=';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.regex = function (value) {
        this.comparisonOperator = '=~';
        this.comparisonValue = value;
        return this;
    };

    Comparison.prototype.exists = function () {
        this.comparisonOperator = 'HAS';
        return this;
    };

    Comparison.prototype.toString = function () {
        var value = "";
        switch (this.comparisonOperator) {
            case "=":
            case "<":
            case ">":
            case "<>":
            case "<=":
            case ">=":
            case "=~":
                var leftArg = this.comparisonVariable + "." + this.comparisonProperty;
                if (this.wrapWithHead) {
                    leftArg = 'HEAD(' + leftArg + ')';
                }
                value += leftArg + " " + this.comparisonOperator + " ";
                if (typeof this.comparisonValue == "string") {
                    value += "'" + this.comparisonValue + "'";
                } else {
                    value += this.comparisonValue;
                }
                break;
            case "HAS":
                value += "HAS(" + this.comparisonVariable + "." + this.comparisonProperty + ")";
                break;
            case "NOT HAS":
                value += "NOT HAS(" + this.comparisonVariable + "." + this.comparisonProperty + ")";
                break;
            default:
                value = "";
                break;
        }
        return value;
    };

    Comparison.prototype.toParameterizedString = function () {
        var value = "";
        switch (this.comparisonOperator) {
            case "=":
            case "<":
            case ">":
            case "<>":
            case "<=":
            case ">=":
            case "=~":
                var leftArg = this.comparisonVariable + "." + this.comparisonProperty;
                if (this.wrapWithHead) {
                    leftArg = 'HEAD(' + leftArg + ')';
                }
                value += leftArg + " " + this.comparisonOperator + " {";
                value += this.comparisonValue + "}";
                break;
            case "HAS":
                value += "HAS(" + this.comparisonVariable + "." + this.comparisonProperty + ")";
                break;
            case "NOT HAS":
                value += "NOT HAS(" + this.comparisonVariable + "." + this.comparisonProperty + ")";
                break;
            default:
                value = "";
                break;
        }
        return value;
    };


    /**
     * @memberof wingman
     *
     * @constructor
     */
    function Group(whereClause, joiner) {
        this.where = whereClause;
        this.joiner = joiner;
        this.parent = null;
        this.negated = false;
    }

    Group.prototype.not = function () {
        this.negated = true;
        return this;
    };

    Group.prototype.toString = function () {
        var value = '(' + this.where.toString() + ')';
        if (this.negated) {
            value = 'NOT' + value;
        }
        return value;
    };

    Group.prototype.toParameterizedString = function () {
        var value = '(' + this.where.toParameterizedString() + ')';
        if (this.negated) {
            value = 'NOT' + value;
        }
        return value;
    };

    /**
     * @memberof wingman
     * Creates a new Where clause
     * @param seed The variable name. Must match an existing name in the associated Match clause
     * @param property the name of the property on the variable for which the comparison will be performed
     * @param parent The {Match} clause to which this where belongs
     * @constructor
     */
    function Where(seed) {
        this.clauses = [seed];
        seed.parent = this;
    }

    /**
     * Adds a new Where clause that is joined to the previous clause via the AND operator
     * @param name {String} The variable name. Must match an existing name in the associated Match clause
     * @param property {String} the name of the property on the variable for which the comparison will be performed
     * @returns {Where}
     */
    Where.prototype.andWhere = function (clause) {
        this.clauses.push(clause);
        clause.parent = this;
        var numberOfCurrentClauses = this.clauses.length;
        if (numberOfCurrentClauses > 0) {
            // the previous clause in the array needs the correct joiner, AND in this case
            this.clauses[numberOfCurrentClauses - 2].joiner = "AND";
        }
        return this;
    };

    /**
     * Adds a new {Where} clause that is joined to the previous clause via the OR operator
     * @param name String} The variable name. Must match an existing name in the associated Match clause
     * @param property String} The name of the property on the variable for which the comparison will be performed
     * @returns {Where}
     */
    Where.prototype.orWhere = function (clause) {
        this.clauses.push(clause);
        clause.parent = this;
        var numberOfCurrentClauses = this.clauses.length;
        if (numberOfCurrentClauses > 0) {
            // the previous clause in the array needs the correct joiner, OR in this case
            this.clauses[numberOfCurrentClauses - 2].joiner = "OR";
        }
        return this;
    };

    /**
     * Generates the cypher for this where clause and all parent where clauses
     * @returns {string}
     */
    Where.prototype.toString = function () {
        var value = "";
        for (var index = 0; index < this.clauses.length; index++) {
            value += this.clauses[index].toString();
            if (index < this.clauses.length - 1) {
                value += " " + this.clauses[index].joiner + " ";
            }
        }
        return value;
    };

    /**
     * Generates the cypher for this where clause and all parent where clauses
     * @returns {string}
     */
    Where.prototype.toParameterizedString = function () {
        var value = "";
        for (var index = 0; index < this.clauses.length; index++) {
            value += this.clauses[index].toParameterizedString();
            if (index < this.clauses.length - 1) {
                value += " " + this.clauses[index].joiner + " ";
            }
        }
        return value;
    };


    /**
     * @memberof wingman
     * The primary class representing the cypher query
     * @constructor
     */
    function Cypher() {
        this.matchClause = null;
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
    Cypher.prototype.match = function (match) {
        this.matchClause = match;
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
     * Returns a cyhper representation of the current state of this object
     * @returns {string}
     */
    Cypher.prototype.toString = function () {
        var value = 'match ' + this.matchClause.toString();
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
     * Returns a cyhper representation of the current state of this object
     * @returns {string}
     */
    Cypher.prototype.toParameterizedString = function () {
        var value = 'match ' + this.matchClause.toParameterizedString();
        if (this.optionalMatches.length) {
            value += ' optional match ';
        }
        length = this.optionalMatches.length;
        for (index = 0; index < length; index++) {
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
        this.label = '';
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

    Return.prototype.as = function (label) {
        this.label = label;
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
        if (this.label) {
            value += ' AS ' + this.label;
        }
        return value;
    };


    // utility functions that will not be publicly exposed

    // Make the classes in the namespace publicly available
    return {
        Node: Node,
        Relationship: Relationship,
        Match: Match,
        Pattern: Pattern,
        Where: Where,
        Cypher: Cypher,
        Return: Return,
        Comparison: Comparison,
        Group: Group
    };
}());


