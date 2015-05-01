/**
 * Created by clarkrichey on 5/1/15.
 */
describe("Path", function () {
    var path;

    it("should produce the start nodes toString when it just contains a start node", function () {
        var node = new FactGem.wingman.Node('p', 'Person');
        path = new FactGem.wingman.Path(node);
        expect(path.toString()).toEqual('(p:Person)');

    });

    it("should produce the start nodes, relationship and endnodes toString when it just contains a full path", function () {
        var startNode = new FactGem.wingman.Node('p', 'Person');
        startNode.addProperty('city', 'Ada');
        var endNodeNode = new FactGem.wingman.Node('pl', 'Place');
        var relationship = new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing');
        path = new FactGem.wingman.Path(startNode, relationship, endNodeNode);
        expect(path.toString()).toEqual('(p:Person {city:Ada})-[r:hasResidentialAddress]->(pl:Place)');

    });

});