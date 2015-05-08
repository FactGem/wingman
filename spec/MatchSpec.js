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

    it("should produce the start nodes, relationship and end nodes toString when it just contains a full path", function () {
        var startNode = new FactGem.wingman.Node('p', 'Person');
        startNode.addProperty('city', 'Ada');
        var endNodeNode = new FactGem.wingman.Node('pl', 'Place');
        var relationship = new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing');
        match = new FactGem.wingman.Match(startNode, relationship, endNodeNode);
        expect(match.toString()).toEqual('(p:Person {city:Ada})-[r:hasResidentialAddress]->(pl:Place)');
    });

});