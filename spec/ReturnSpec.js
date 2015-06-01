/**
 * Created by clarkrichey on 5/12/15.
 */
describe("Return", function () {
    var returnClause;

    it("should produce correct cypher when just returning a node", function () {
        returnClause = new FactGem.wingman.Return().variable('p');
        expect(returnClause.toString()).toEqual('p')
    });

    it("should produce correct cypher when just returning a node with a property", function () {
        returnClause = new FactGem.wingman.Return().variable('p').property('gender');
        expect(returnClause.toString()).toEqual('p.gender')
    });

    it("should produce correct cypher when returning count of node with a property", function () {
        returnClause = new FactGem.wingman.Return().countResults().variable('p').property('gender');
        expect(returnClause.toString()).toEqual('count(p.gender)')
    });


    it("should produce correct cypher when returning count of variable", function () {
        returnClause = new FactGem.wingman.Return().countResults().variable('p');
        expect(returnClause.toString()).toEqual('count(p)')
    });

});
