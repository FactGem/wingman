/**
 * Created by clarkrichey on 5/11/15.
 */
describe("Where", function () {
    var where;

    it("should produce valid parameterized cypher for equals operator", function () {
        where = new FactGem.wingman.Where('n', 'gender').equals('gender');
        expect(where.toString()).toEqual('where n.gender={gender}')
    });

    it("should produce valid parameterized cypher for not equal operator", function () {
        where = new FactGem.wingman.Where('n', 'gender').notEqual('gender');
        expect(where.toString()).toEqual('where n.gender<>{gender}')
    });

    it("should produce valid parameterized cypher for lessThan operator", function () {
        where = new FactGem.wingman.Where('n', 'age').lessThan('age');
        expect(where.toString()).toEqual('where n.age<{age}')
    });

    it("should produce valid parameterized cypher for greaterThan operator", function () {
        where = new FactGem.wingman.Where('n', 'age').greaterThan('age');
        expect(where.toString()).toEqual('where n.age>{age}')
    });

    it("should produce valid parameterized cypher for greaterThanOrEqualTo operator", function () {
        where = new FactGem.wingman.Where('n', 'age').greaterThanOrEqualTo('age');
        expect(where.toString()).toEqual('where n.age>={age}')
    });

    it("should produce valid parameterized cypher for lessThanOrEqualTo operator", function () {
        where = new FactGem.wingman.Where('n', 'age').lessThanOrEqualTo('age');
        expect(where.toString()).toEqual('where n.age<={age}')
    });

});
