/**
 * Created by clarkrichey on 5/1/15.
 */
describe("Match", function () {
    var match;

    it("should produce the start nodes toString when it just contains a start node", function () {
        var node = new FactGem.wingman.Node('p', 'Person');
        match = new FactGem.wingman.Match(node);
        expect(match.toString()).toEqual('(p:Person)');

    });

    it("should produce correct cypher when it just contains a start node and a match clause", function () {
        var node = new FactGem.wingman.Node('p', 'Person');
        match = new FactGem.wingman.Match(node);
        match.where('p', 'lastName').equals('lastName');
        expect(match.toString()).toEqual('(p:Person) where p.lastName={lastName}');

    });

    it("should produce the start nodes, relationship and end nodes toString when it just contains a full path", function () {
        var startNode = new FactGem.wingman.Node('p', 'Person');
        startNode.addProperty('city', 'city1');
        var endNodeNode = new FactGem.wingman.Node('pl', 'Place');
        var relationship = new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing');
        match = new FactGem.wingman.Match(startNode, relationship, endNodeNode);
        expect(match.toString()).toEqual('(p:Person {city:{city1}})-[r:hasResidentialAddress]->(pl:Place)');
    });

    it("should work with the fluid api syntax for setting nodes and relationship", function () {
        match = new FactGem.wingman.Match().withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        expect(match.toString()).toEqual('(p:Person)-[r:hasResidentialAddress]->(pl:Place)');
    });

});