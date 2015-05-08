describe("Cypher", function () {
    var cypher;

    it("correctly removes matches", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var match = new FactGem.wingman.Match(node1);
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match2 = new FactGem.wingman.Match(node2);
        cypher.addMatch(match);
        expect(cypher.matches.length).toEqual(1);
        cypher.addMatch(match2);
        expect(cypher.matches.length).toEqual(2);
        cypher.removeMatch(match);
        expect(cypher.matches.length).toEqual(1);
        expect(cypher.matches[0]).toBe(match2);
    });

    it("correctly removes optional matches", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var match = new FactGem.wingman.Match(node1);
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match2 = new FactGem.wingman.Match(node2);
        cypher.addOptionalMatch(match);
        expect(cypher.optionalMatches.length).toEqual(1);
        cypher.addOptionalMatch(match2);
        expect(cypher.optionalMatches.length).toEqual(2);
        cypher.removeOptionalMatch(match);
        expect(cypher.optionalMatches.length).toEqual(1);
        expect(cypher.optionalMatches[0]).toBe(match2);
    });
});