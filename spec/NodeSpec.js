/**
 * Created by clarkrichey on 4/28/15.
 */
describe("Node", function () {
    var node;

    it("a simple node should produce a String with a name, a colon and the type", function () {
        node = new FactGem.Rexx.Node('p', 'Person');
        expect(node.toString()).toEqual('(p:Person)');

    });

    it("a node containing properties should also product a list of its properties", function () {
        node = new FactGem.Rexx.Node('p', 'Person');
        node.addProperty('gender', 'female');
        expect(node.toString()).toEqual('(p:Person {gender:female})');
        node.addProperty('age', '25');
        expect(node.toString()).toEqual('(p:Person {gender:female, age:25})');

    });

});