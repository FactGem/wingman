/**
 * Created by clarkrichey on 5/1/15.
 */
describe("Match", function () {
    var match;

    it("should produce the start nodes toString when it just contains a start node", function () {
        var node = new FactGem.wingman.Node('p', 'Person');
        match = new FactGem.wingman.Match(new FactGem.wingman.Pattern(node));
        expect(match.toString()).toEqual('(p:Person)');

    });

    it("should produce correct cypher when it just contains a start node and a match clause", function () {
        var node = new FactGem.wingman.Node('p', 'Person');
        match = new FactGem.wingman.Match(new FactGem.wingman.Pattern(node));
        match.where(new FactGem.wingman.Where(new FactGem.wingman.Comparison('p', 'lastName', "=", "johnson")));
        expect(match.toString()).toEqual("(p:Person) where p.lastName = 'johnson'");

    });

    it("should produce the start nodes, rel and end nodes toString when it just contains a full path", function () {
        var startNode = new FactGem.wingman.Node('p', 'Person');
        startNode.addProperty('city', 'westminster');
        var endNodeNode = new FactGem.wingman.Node('pl', 'Place');
        var relationship = new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing');
        match = new FactGem.wingman.Match(new FactGem.wingman.Pattern(startNode, relationship, endNodeNode));
        expect(match.toString()).toEqual("(p:Person {city:'westminster'})-[r:hasResidentialAddress]->(pl:Place)");
    });

    it("correctly removes patterns", function () {
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var pattern1 = new FactGem.wingman.Pattern(node1);
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var pattern2 = new FactGem.wingman.Pattern(node2);
        match = new FactGem.wingman.Match(pattern1);
        expect(match.patterns.length).toEqual(1);
        match.addPattern(pattern2);
        expect(match.patterns.length).toEqual(2);
        match.removePattern(pattern1);
        expect(match.patterns.length).toEqual(1);
        expect(match.patterns[0]).toBe(pattern2);
    });

});