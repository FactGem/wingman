// setup FactGem namespaces
var FactGem = FactGem || {};
FactGem.Rexx = (function namespace() {

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
    };

    return {
        Node: Node
    };
}());

