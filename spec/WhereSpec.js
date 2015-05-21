/**
 * Created by clarkrichey on 5/11/15.
 */
describe("Where", function () {
    var where;

    it("should produce valid parameterized cypher for equals operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender');
        expect(where.toString()).toEqual('where n.gender={gender}')
    });

    it("should produce valid parameterized cypher for not equal operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').notEqual('gender');
        expect(where.toString()).toEqual('where n.gender<>{gender}')
    });

    it("should produce valid parameterized cypher for lessThan operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').lessThan('age');
        expect(where.toString()).toEqual('where n.age<{age}')
    });

    it("should produce valid parameterized cypher for greaterThan operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').greaterThan('age');
        expect(where.toString()).toEqual('where n.age>{age}')
    });

    it("should produce valid parameterized cypher for greaterThanOrEqualTo operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').greaterThanOrEqualTo('age');
        expect(where.toString()).toEqual('where n.age>={age}')
    });

    it("should produce valid parameterized cypher for lessThanOrEqualTo operator", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'age').lessThanOrEqualTo('age');
        expect(where.toString()).toEqual('where n.age<={age}')
    });

    it("should produce valid parameterized cypher for equals operator with another ANDed where", function () {
        var match = new FactGem.wingman.Match();
        where = match.where('n', 'gender').equals('gender').andWhere('n', 'age').greaterThanOrEqualTo('age');
        expect(where.toString()).toEqual('where n.gender={gender} AND n.age>={age}')
    });

});
