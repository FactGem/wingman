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

    it("a relationship containing properties should also product a list of its properties", function () {
        relationship = new FactGem.wingman.Relationship('p', 'Person', "outgoing");
        relationship.addProperty('gender', 'female');
        expect(relationship.toString()).toEqual('-[p:Person {gender:female}]->');
        relationship.addProperty('age', '25');
        expect(relationship.toString()).toEqual('-[p:Person {gender:female, age:25}]->');
        relationship = new FactGem.wingman.Relationship('x', 'Person', "outgoing");
        relationship.addProperty('gender', 'female').addProperty('age', '25'); // test fluid api
        expect(relationship.toString()).toEqual('-[x:Person {gender:female, age:25}]->');
    });

});