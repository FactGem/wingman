/**
 * Created by clarkrichey on 5/12/15.
 */
describe("Return", function () {
    var returnClause;

    it("should produce correct cypher when just returning a node", function () {
        returnClause = new FactGem.wingman.Return().variable('p');
        expect(returnClause.toString()).toEqual('return p')
    });

});
