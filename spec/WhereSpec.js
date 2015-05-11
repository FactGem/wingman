/**
 * Created by clarkrichey on 5/11/15.
 */
describe("Where", function () {
    var where;

    it("should produce valid parameterized cypher for equals operator", function () {
        where = new FactGem.wingman.Where('n', 'gender').equals().value('gender');
        expect(where.toString()).toEqual('where n.gender={gender}')
    });

    it("should produce valid parameterized cypher for not equal operator", function () {
        where = new FactGem.wingman.Where('n', 'gender').notEqual().value('gender');
        expect(where.toString()).toEqual('where n.gender<>{gender}')
    });

    it("should produce valid parameterized cypher for lessThan operator", function () {
        where = new FactGem.wingman.Where('n', 'age').lessThan().value('age');
        expect(where.toString()).toEqual('where n.age<{age}')
    });

    it("should produce valid parameterized cypher for greaterThan operator", function () {
        where = new FactGem.wingman.Where('n', 'age').greaterThan().value('age');
        expect(where.toString()).toEqual('where n.age>{age}')
    });

    it("should produce valid parameterized cypher for greaterThanOrEqualTo operator", function () {
        where = new FactGem.wingman.Where('n', 'age').greaterThanOrEqualTo().value('age');
        expect(where.toString()).toEqual('where n.age>={age}')
    });

    it("should produce valid parameterized cypher for lessThanOrEqualTo operator", function () {
        where = new FactGem.wingman.Where('n', 'age').lessThanOrEqualTo().value('age');
        expect(where.toString()).toEqual('where n.age<={age}')
    });

});
