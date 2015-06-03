/**
 * Created by clarkrichey on 5/11/15.
 */
describe("Where", function () {
    var where;

    it("should produce valid parameterized cypher for equals operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender}')
    });

    it("should produce valid cypher for equals operator with string value", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male');
        expect(where.toString()).toEqual("where n.gender='male'")
    });

    it("should produce valid cypher for equals operator with int value", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').equals(50);
        expect(where.toString()).toEqual("where n.age=50")
    });

    it("should produce valid cypher for equals operator with boolean value", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'alive').equals(true);
        expect(where.toString()).toEqual("where n.alive=true")
    });

    it("should produce valid parameterized cypher for not equal operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').notEqual('gender');
        expect(where.toParameterizedString()).toEqual('where n.gender<>{gender}')
    });

    it("should produce valid cypher for not equal operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').notEqual('male');
        expect(where.toString()).toEqual("where n.gender<>'male'")
    });

    it("should produce valid parameterized cypher for lessThan operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').lessThan('age');
        expect(where.toParameterizedString()).toEqual('where n.age<{age}')
    });

    it("should produce valid cypher for lessThan operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').lessThan(40);
        expect(where.toString()).toEqual('where n.age<40')
    });

    it("should produce valid parameterized cypher for greaterThan operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').greaterThan('age');
        expect(where.toParameterizedString()).toEqual('where n.age>{age}')
    });

    it("should produce valid cypher for greaterThan operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').greaterThan('age');
        expect(where.toParameterizedString()).toEqual('where n.age>{age}')
    });

    it("should produce valid parameterized cypher for greaterThanOrEqualTo operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').greaterThanOrEqualTo(40);
        expect(where.toString()).toEqual('where n.age>=40')
    });

    it("should produce valid parameterized cypher for lessThanOrEqualTo operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').lessThanOrEqualTo('age');
        expect(where.toParameterizedString()).toEqual('where n.age<={age}')
    });

    it("should produce valid cypher for lessThanOrEqualTo operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').lessThanOrEqualTo(33);
        expect(where.toString()).toEqual('where n.age<=33')
    });

    it("should produce valid parameterized cypher for equals operator with another ANDed where", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').andWhere('n', 'age').greaterThanOrEqualTo('age');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender} AND n.age>={age}')
    });

    it("should produce valid cypher for equals operator with another ANDed where", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male').andWhere('n', 'age').greaterThanOrEqualTo(40);
        expect(where.toString()).toEqual("where n.gender='male' AND n.age>=40")
    });

    it("should produce valid parameterized cypher for equals operator with another ORed where", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').orWhere('n', 'age').greaterThanOrEqualTo('age');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender} OR n.age>={age}')
    });

    it("should produce valid cypher for equals operator with another ORed where", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male').orWhere('n', 'age').greaterThanOrEqualTo(40);
        expect(where.toString()).toEqual("where n.gender='male' OR n.age>=40")
    });

    it("should produce valid parameterized cypher for equals operator with another ORed where followed and an AND", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').orWhere('n', 'age').greaterThanOrEqualTo('age').andWhere('n', 'givenName').equals('name');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender} OR n.age>={age} AND n.givenName={name}')
    });

    it("should produce valid cypher for equals operator with another ORed where followed and an AND", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male').orWhere('n', 'age').greaterThanOrEqualTo(40).andWhere('n', 'givenName').equals('bob');
        expect(where.toString()).toEqual("where n.gender='male' OR n.age>=40 AND n.givenName='bob'")
    });

    it("should produce valid cypher for hasProperty operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.whereHasProperty('n', 'age');
        expect(where.toString()).toEqual('where has(n.age)')
    });

    it("should produce valid cypher for hasProperty operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.whereNotHasProperty('n', 'age');
        expect(where.toString()).toEqual('where NOT has(n.age)')
    });

    it("should produce valid parameterized cypher for equals operator with ORed has Property", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').orWhereHasProperty('n', 'age');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender} OR has(n.age)')
    });

    it("should produce valid cypher for equals operator with ORed has Property", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male').orWhereHasProperty('n', 'age');
        expect(where.toString()).toEqual("where n.gender='male' OR has(n.age)")
    });

    it("should produce valid parameterized cypher for equals operator with ANDed has Property", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').andWhereHasProperty('n', 'age');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender} AND has(n.age)')
    });

    it("should produce valid cypher for equals operator with ANDed has Property", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male').andWhereHasProperty('n', 'age');
        expect(where.toString()).toEqual("where n.gender='male' AND has(n.age)")
    });

    it("should produce valid parameterized cypher for equals operator with  ANDed has Property followed and an AND", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').andWhereHasProperty('n', 'age').andWhere('n', 'givenName').equals('name');
        expect(where.toParameterizedString()).toEqual('where n.gender={gender} AND has(n.age) AND n.givenName={name}')
    });

    it("should produce valid cypher for equals operator with  ANDed has Property followed and an AND", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('male').andWhereHasProperty('n', 'age').andWhere('n', 'givenName').equals('bob');
        expect(where.toString()).toEqual("where n.gender='male' AND has(n.age) AND n.givenName='bob'")
    });
});
