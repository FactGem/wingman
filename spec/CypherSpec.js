describe("Cypher", function () {
    var cypher;


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
        var match = new FactGem.wingman.Match(new FactGem.wingman.Pattern(node1));
        cypher.match(match);

        expect(cypher.toString()).toBe('match (p:Person);');

        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var pattern2 = new FactGem.wingman.Pattern(node2);
        match.addPattern(pattern2);
        expect(cypher.toString()).toBe('match (p:Person), (pl:Place);');
    });

    it("produces valid cypher with match and where clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var node1 = new FactGem.wingman.Node('p', 'Person');
        var relationship1 = new FactGem.wingman.Relationship('hra', 'hasResidentialAddress', 'outgoing');
        var node2 = new FactGem.wingman.Node('pl', 'Place');
        var match = new FactGem.wingman.Match(new FactGem.wingman.Pattern(node1, relationship1, node2));
        match.where('pl', 'city').equals('westminster');
        cypher.match(match);
        expect(cypher.toString()).toEqual("match (p:Person)-[hra:hasResidentialAddress]->(pl:Place) where pl.city='westminster';")
    });

    it("produces correct cypher using fluent match syntax", function () {
        cypher = new FactGem.wingman.Cypher().match(new FactGem.wingman.Match(new FactGem.wingman.Pattern()
            .startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'))));
        expect(cypher.toString()).toEqual('match (p:Person)-[r:hasResidentialAddress]->(pl:Place);');
    });

    it("produces correct cypher using fluent match and where syntax", function () {
        cypher = new FactGem.wingman.Cypher();
        var match = new FactGem.wingman.Match(new FactGem.wingman.Pattern()
            .startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place')));
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match);
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster';");
    });

    it("produces correct cypher using fluent match, where and single return", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match).andReturn().variable('p');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return p;");
    });

    it("produces correct cypher using fluent match, where and multiple returns", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city;");
    });

    it("produces correct cypher using fluent match, where and multiple returns and order by", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName;");
    });

    it("produces correct cypher using fluent match, where and multiple returns and order by desc", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').descending();
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName desc;");
    });

    it("produces correct cypher using fluent match, where and multiple returns, order by and skip", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').skip(10).orderBy('p', 'familyName');
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName skip 10;");
    });

    it("produces correct cypher using match, optional match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');

        var pattern2 = new FactGem.wingman.Pattern();
        pattern2.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r2', 'hasMailingAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl2', 'Place'));

        var optionalMatch = new FactGem.wingman.Match(pattern2);
        optionalMatch.where('pl2', 'city').notEqual('laurel');
        cypher.match(match).addOptionalMatch(optionalMatch).andReturn()
            .variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' optional match (p:Person)-[r2:hasMailingAddress]->(pl2:Place) where pl2.city<>'laurel' return distinct p, pl.city order by p.familyName skip 10 limit 100;");
    });

    it("produces correct cypher using fluent match, where and multiple returns, order by, skip and limit", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern();
        pattern.startNode(new FactGem.wingman.Node('p', 'Person'))
            .relationship(new FactGem.wingman.Relationship('r', 'hasResidentialAddress', 'outgoing'))
            .endNode(new FactGem.wingman.Node('pl', 'Place'));
        var match = new FactGem.wingman.Match(pattern);
        match.where('pl', 'city').notEqual('westminster');
        cypher.match(match).andReturn().variable('p').andReturn().distinctValues().variable('pl').property('city').orderBy('p', 'familyName').skip(10).limit(100);
        expect(cypher.toString()).toEqual("match (p:Person)-[r:hasResidentialAddress]->(pl:Place) where pl.city<>'westminster' return distinct p, pl.city order by p.familyName skip 10 limit 100;");
    });

    it("produces correct cypher when checking for existence of a property", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern = new FactGem.wingman.Pattern(new FactGem.wingman.Node('p', 'Person'));
        var match = new FactGem.wingman.Match(pattern);
        match.whereHasProperty('p', 'gender');
        cypher.match(match).andReturn().variable('p');
        expect(cypher.toString()).toEqual("match (p:Person) where has(p.gender) return p;");
    });

    it("produces correct cypher when handling more than 2 match clauses", function () {
        cypher = new FactGem.wingman.Cypher();
        var pattern1 = new FactGem.wingman.Pattern();
        pattern1.startNode(new FactGem.wingman.Node('sr1', 'SurveyResponse')).relationship(new FactGem.wingman.Relationship('r1', 'hasRespondant'))
            .endNode(new FactGem.wingman.Node('n1', 'Person'));

        var pattern2 = new FactGem.wingman.Pattern();
        pattern2.startNode(new FactGem.wingman.Node('sr1', 'SurveyResponse')).relationship(new FactGem.wingman.Relationship('r2', 'hasAnswer'))
            .endNode(new FactGem.wingman.Node('n3', 'Answer'));

        var pattern3 = new FactGem.wingman.Pattern();
        pattern3.startNode(new FactGem.wingman.Node('n3', 'Answer')).relationship(new FactGem.wingman.Relationship('r3', 'hasChoice'))
            .endNode(new FactGem.wingman.Node('n4', 'Choice'));

        var match = new FactGem.wingman.Match(pattern1).addPattern(pattern2).addPattern(pattern3);
        match.where('n4', 'value').equals('blue');

        cypher.match(match).andReturn().variable('n1');
        expect(cypher.toString()).toEqual("match (sr1:SurveyResponse)-[r1:hasRespondant]->(n1:Person), (sr1:SurveyResponse)-[r2:hasAnswer]->(n3:Answer), (n3:Answer)-[r3:hasChoice]->(n4:Choice) where n4.value='blue' return n1;");
    });
});