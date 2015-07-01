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

    it("produces valid parameterized cypher with match and where clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var relationship1 = new FactGem.wingman.Relationship('hra', 'hasResidentialAddress', 'outgoing');
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match = new FactGem.wingman.Match(node1, relationship1, node2);
        match.where('pl', 'city').equals('city1');
        cypher.addMatch(match);
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[hra:hasResidentialAddress]->(pl:Place) where pl.city={city1};')
    });

    it("produces valid cypher with match and where clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var relationship1 = new FactGem.wingman.Relationship('hra', 'hasResidentialAddress', 'outgoing');
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match = new FactGem.wingman.Match(node1, relationship1, node2);
        match.where('pl', 'city').equals('westminster');
        cypher.addMatch(match);
        expect(cypher.toString()).toEqual("match (p:Person)-[hra:hasResidentialAddress]->(pl:Place) where pl.city='westminster';")
    });

    it("produces correct cypher using fluent match syntax", function () {
        cypher = new FactGem.wingman.Cypher().addMatch(new FactGem.wingman.Match()
            .startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place')));
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place);');
    });

    it("produces correct parameterized cypher using fluent match and where syntax", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('city1');
        cypher.addMatch(match);
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1};');
    });

    it("produces correct cypher using fluent match and where syntax", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match()
            .startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        match.where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match);
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster';");
    });

    it("produces correct parameterized cypher using fluent match, where and single return", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p');
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return p;');
    });

    it("produces correct cypher using fluent match, where and single return", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match).andReturn().variable('p');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return p;");
    });

    it("produces correct parameterized cypher using fluent match, where and multiple returns", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city');
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return distinct p, pl.city;');
    });

    it("produces correct cypher using fluent match, where and multiple returns", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city;");
    });

    it("produces correct parameterized cypher using fluent match, where and multiple returns and order by", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName');
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return distinct p, pl.city order by p.familyName;');
    });

    it("produces correct cypher using fluent match, where and multiple returns and order by", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName;");
    });

    it("produces correct parameterized cypher using fluent match, where and multiple returns and order by desc", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').descending();
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return distinct p, pl.city order by p.familyName desc;');
    });

    it("produces correct cypher using fluent match, where and multiple returns and order by desc", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').descending();
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName desc;");
    });

    it("produces correct parameterized cypher using fluent match, where and multiple returns, order by and skip", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').skip(10).orderBy('p', 'familyName');
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return distinct p, pl.city order by p.familyName skip 10;');
    });

    it("produces correct cypher using fluent match, where and multiple returns, order by and skip", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').skip(10).orderBy('p', 'familyName');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName skip 10;");
    });

    it("produces correct parameterized cypher using match, optional match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        var optionalMatch = new FactGem.wingman.Match();
        optionalMatch.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r2', 'hasMailingAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl2', 'Place'))
            .where('pl2', 'city').notEqual('city2');
        cypher.addMatch(match).addOptionalMatch(optionalMatch).andReturn()
            .variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} optional match (p:Person)-[r2:hasMailingAddress]->(pl2:Place) where pl2.city<>{city2} return distinct p, pl.city order by p.familyName skip 10 limit 100;');
    });

    it("produces correct cypher using match, optional match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        var optionalMatch = new FactGem.wingman.Match();
        optionalMatch.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r2', 'hasMailingAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl2', 'Place'))
            .where('pl2', 'city').notEqual('laurel');
        cypher.addMatch(match).addOptionalMatch(optionalMatch).andReturn()
            .variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' optional match (p:Person)-[r2:hasMailingAddress]->(pl2:Place) where pl2.city<>'laurel' return distinct p, pl.city order by p.familyName skip 10 limit 100;");
    });

    it("produces correct parameterized cypher using fluent match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('city1');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toParameterizedString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>{city1} return distinct p, pl.city order by p.familyName skip 10 limit 100;');
    });

    it("produces correct cypher using fluent match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))
            .where('pl', 'city').notEqual('westminster');
        cypher.addMatch(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName skip 10 limit 100;");
    });

    it("produces correct cypher when checking for existence of a property", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match();
        match.startNode(new FactGem.wingman.Node('p', 'Person')).whereHasProperty('p', 'gender');
        cypher.addMatch(match).andReturn().variable('p');
        expect(cypher.toString()).toEqual("match (p:Person) where has(p.gender) return p;");
    });

    it("produces correct cypher when handling more than 2 match clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var match1 = new FactGem.wingman.Match();
        match1.startNode(new FactGem.wingman.Node('sr1', 'SurveyResponse')).relationship(new FactGem.wingman.Relationship('r1', 'hasRespondant'))
            .endNode(new FactGem.wingman.Node('n1', 'Person'));
        var match2 = new FactGem.wingman.Match();
        match2.startNode(new FactGem.wingman.Node('sr1', 'SurveyResponse')).relationship(new FactGem.wingman.Relationship('r2', 'hasAnswer'))
            .endNode(new FactGem.wingman.Node('n3', 'Answer'));
        var match3 = new FactGem.wingman.Match();
        match3.startNode(new FactGem.wingman.Node('n3', 'Answer')).relationship(new FactGem.wingman.Relationship('r3', 'hasChoice'))
            .endNode(new FactGem.wingman.Node('n4', 'Choice')).where('n4', 'value').equals('blue');
        cypher.addMatch(match1).addMatch(match2).addMatch(match3).andReturn().variable('n1');
        expect(cypher.toString()).toEqual("match (sr1:SurveyResponse)-[r1:hasRespondant]->(n1:Person), (sr1:SurveyResponse)-[r2:hasAnswer]->(n3:Answer), (n3:Answer)-[r3:hasChoice]->(n4:Choice) where n4.value='blue' return n1;");
    });
});