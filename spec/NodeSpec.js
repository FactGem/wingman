/**
 * Created by clarkrichey on 4/28/15.
 */
describe("Node", function () {
    var node;

    it("a simple node should produce a String with a name, a colon and the type", function () {
        node = new FactGem.wingman.Node('p', 'Person');
        expect(node.toString()).toEqual('(p:Person)');

    });

    it("can have just a name", function () {
        node = new FactGem.wingman.Node('p');
        expect(node.toString()).toEqual('(p)');

    });

    it("a node containing properties should also product a list of its properties", function () {
        node = new FactGem.wingman.Node('p', 'Person');
        node.addProperty('gender', 'gender1');
        expect(node.toString()).toEqual('(p:Person {gender:{gender1}})');
        node.addProperty('age', 'age1');
        expect(node.toString()).toEqual('(p:Person {gender:{gender1}, age:{age1}})');
        node = new FactGem.wingman.Node('x', 'Person');
        node.addProperty('gender', 'gender1').addProperty('age', 'age1'); // test fluid api
        expect(node.toString()).toEqual('(x:Person {gender:{gender1}, age:{age1}})');
    });

});