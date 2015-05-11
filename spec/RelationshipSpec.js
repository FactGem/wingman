/**
 * Created by clarkrichey on 4/29/15.
 */
describe("Relationship", function () {
    var relationship;

    it("a simple outgoing relationship should produce a String with a name, a colon, the type and direction", function () {
        relationship = new FactGem.wingman.Relationship('r', 'hasResidentialAddress', "OUTGOING");
        expect(relationship.toString()).toEqual('-[r:hasResidentialAddress]->');

    });

    it("a simple incoming relationship should produce a String with a name, a colon, the type and direction", function () {
        relationship = new FactGem.wingman.Relationship('r', 'hasResidentialAddress', "INCOMING");
        expect(relationship.toString()).toEqual('<-[r:hasResidentialAddress]-');

    });

    it("can have just a name and a direction", function () {
        relationship = new FactGem.wingman.Relationship('r', null, "INCOMING");
        expect(relationship.toString()).toEqual('<-[r]-');

    });

    it("a relationship containing properties should also product a list of its properties", function () {
        relationship = new FactGem.wingman.Relationship('p', 'Person', "outgoing");
        relationship.addProperty('gender', 'gender1');
        expect(relationship.toString()).toEqual('-[p:Person {gender:{gender1}}]->');
        relationship.addProperty('age', 'age1');
        expect(relationship.toString()).toEqual('-[p:Person {gender:{gender1}, age:{age1}}]->');
        relationship = new FactGem.wingman.Relationship('x', 'Person', "outgoing");
        relationship.addProperty('gender', 'gender1').addProperty('age', 'age1'); // test fluid api
        expect(relationship.toString()).toEqual('-[x:Person {gender:{gender1}, age:{age1}}]->');
    });

});