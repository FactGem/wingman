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

    it("produces valid cypher with basic match clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var match = new FactGem.wingman.Match(node1);
        cypher.addMatch(match);

        expect(cypher.toString()).toBe('match (p:Person)');

        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match2 = new FactGem.wingman.Match(node2);
        cypher.addMatch(match2);
        expect(cypher.toString()).toBe('match (p:Person), (pl:Place)');
    });

    it("produces valid cypher with match and where clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var relationship1 = new FactGem.wingman.Relationship('hra', 'hasResidentialAddress', 'outgoing');
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match = new FactGem.wingman.Match(node1, relationship1, node2);
        match.where('pl', 'city').equals('city1');
        cypher.addMatch(match);
        expect(cypher.toString()).toEqual('match (p:Person)-[hra:hasResidentialAddress]->(pl:Place) where pl.city={city1}')
    });

    it("produces correct cypher using fluid match syntax", function () {
        cypher = new FactGem.wingman.Cypher().addMatch(new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place')));
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place)');
    });

    it("produces correct cypher using fluid match and where syntax", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match);
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1}');
    })
});