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

        expect(cypher.toString()).toBe('match (p:Person);');

        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match2 = new FactGem.wingman.Match(node2);
        cypher.addMatch(match2);
        expect(cypher.toString()).toBe('match (p:Person), (pl:Place);');
    });

    it("produces valid cypher with match and where clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var relationship1 = new FactGem.wingman.Relationship('hra', 'hasResidentialAddress', 'outgoing');
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match = new FactGem.wingman.Match(node1, relationship1, node2);
        match.where('pl', 'city').equals('city1');
        cypher.addMatch(match);
        expect(cypher.toString()).toEqual('match (p:Person)-[hra:hasResidentialAddress]->(pl:Place) where pl.city={city1};')
    });

    it("produces correct cypher using fluent match syntax", function () {
        cypher = new FactGem.wingman.Cypher().addMatch(new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place')));
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place);');
    });

    it("produces correct cypher using fluent match and where syntax", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match);
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1};');
    });

    it("produces correct cypher using fluent match, where and single return", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p');
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p;');
    });

    it("produces correct cypher using fluent match, where and multiple returns", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city');
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p, distinct pl.city;');
    });

    it("produces correct cypher using fluent match, where and multiple returns and order by", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName');
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p, distinct pl.city order by p.familyName;');
    });

    it("produces correct cypher using fluent match, where and multiple returns and order by desc", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').descending();
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p, distinct pl.city order by p.familyName desc;');
    });

    it("produces correct cypher using fluent match, where and multiple returns, order by and skip", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').skip(10).orderBy('p', 'familyName');
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p, distinct pl.city order by p.familyName skip 10;');
    });

    it("produces correct cypher using match, optional match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        var optionalMatch = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r2', 'hasMailingAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        optionalMatch.where('pl', 'city').notEqual('city1');
        cypher.addOptionalMatch(optionalMatch);
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} optional match (p:Person)-[r2:hasMailingAddress]->(pl:Place) where pl.city<>{city1} return p, distinct pl.city order by p.familyName skip 10 limit 100;');
    });

    it("produces correct cypher using fluent match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p, distinct pl.city order by p.familyName skip 10 limit 100;');
    });

    it("produces correct cypher using fluent match, multiple where clauses, multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .withStartNode(new FactGem.wingman.Node('p', 'Person'))
            .withRelationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .withEndNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1').andWhere('pl', 'county').equals('county');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} AND pl.county={county} return p, distinct pl.city order by p.familyName skip 10 limit 100;');
    });

    it("produces a map of all parameters when there are two where clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node = new FactGem.wingman.Node('p', 'Person');
        match = new FactGem.wingman.Match(node);
        var where = match.where('n', 'age').greaterThanOrEqualTo('age1').andWhere('n', 'gender').equals('gender1');
        cypher.addMatch(match);
        expect(cypher.parameters()['age']).toEqual('age1');
        expect(cypher.parameters()['gender']).toEqual('gender1');
    });
});