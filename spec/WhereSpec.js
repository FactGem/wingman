/**
 * Created by clarkrichey on 5/11/15.
 */
describe("Where", function () {
    var where;

    it("should produce valid parameterized cypher for equals operator", function () {
        where = new FactGem.wingman.Where('n', 'gender').equals().value('gender');
        expect(where.toString()).toEqual('where n.gender={gender}')
    });

});
