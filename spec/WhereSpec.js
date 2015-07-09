/**
 * Created by clarkrichey on 5/11/15.
 */
describe("Where", function () {
    var where;

    it("should produce valid cypher for basic equals comparison", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female'));
        expect(where.toString()).toEqual("n.gender = 'female'")
    });

    it("should produce valid cypher for two basic equals comparisons joined by AND", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')).andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12));
        expect(where.toString()).toEqual("n.gender = 'female' AND n.age = 12")
    });

    it("should produce valid cypher for has comparisons with = comparison joined by AND", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', 'has')).andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12));
        expect(where.toString()).toEqual("HAS(n.gender) AND n.age = 12")
    });

    it("should produce valid cypher for not has comparisons with = comparison joined by AND", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', 'not has')).andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12));
        expect(where.toString()).toEqual("NOT HAS(n.gender) AND n.age = 12")
    });


    it("should produce valid cypher for three basic equals comparisons joined by AND", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')).andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
            .andWhere(new FactGem.wingman.Comparison('n', 'givenName', '<>', 'Bob'));
        expect(where.toString()).toEqual("n.gender = 'female' AND n.age = 12 AND n.givenName <> 'Bob'")
    });

    it("should produce valid cypher for two basic equals comparisons joined by OR", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')).orWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12));
        expect(where.toString()).toEqual("n.gender = 'female' OR n.age = 12")
    });

    it("should produce valid cypher for two basic equals comparisons joined by OR", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')).orWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12));
        expect(where.toString()).toEqual("n.gender = 'female' OR n.age = 12")
    });

    it("should produce valid cypher for three basic equals comparisons joined by OR", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')).orWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
            .orWhere(new FactGem.wingman.Comparison('n', 'givenName', '<>', 'Bob'));
        expect(where.toString()).toEqual("n.gender = 'female' OR n.age = 12 OR n.givenName <> 'Bob'")
    });

    it("should produce valid cypher for three basic equals comparisons joined by mixed operators", function () {
        where = new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')).andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
            .orWhere(new FactGem.wingman.Comparison('n', 'givenName', '<>', 'Bob'));
        expect(where.toString()).toEqual("n.gender = 'female' AND n.age = 12 OR n.givenName <> 'Bob'")
    });

    it("should produce valid cypher for one group", function () {
        var group = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female')));
        where = new FactGem.wingman.Where(group);
        expect(where.toString()).toEqual("(n.gender = 'female')")
    });

    it("should produce valid cypher for one group containing two comparisons", function () {
        var group = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
        );
        where = new FactGem.wingman.Where(group);
        expect(where.toString()).toEqual("(n.gender = 'female' AND n.age = 12)")
    });

    it("should produce valid cypher for two groups joined by AND containing two comparisons", function () {
        var group = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
        );
        var group2 = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'male'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '>', 12))
        );
        where = new FactGem.wingman.Where(group).andWhere(group2);
        expect(where.toString()).toEqual("(n.gender = 'female' AND n.age = 12) AND (n.gender = 'male' AND n.age > 12)")
    });

    it("should produce valid cypher for three groups joined by varying joiners each containing two comparisons", function () {
        var group = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
        );
        var group2 = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'male'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '>', 12))
        );

        var group3 = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'firstName', '=', 'Clark'))
                .orWhere(new FactGem.wingman.Comparison('n', 'age', '>', 12))
        );
        where = new FactGem.wingman.Where(group).andWhere(group2).orWhere(group3);
        expect(where.toString()).toEqual("(n.gender = 'female' AND n.age = 12) AND (n.gender = 'male' AND n.age > 12) OR (n.firstName = 'Clark' OR n.age > 12)")
    });

    it("should produce valid cypher for one group containing two other groups", function () {
        var group = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'female'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '=', 12))
        );
        var group2 = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'gender', '=', 'male'))
                .andWhere(new FactGem.wingman.Comparison('n', 'age', '>', 12))
        );
        var group3 = new FactGem.wingman.Group(
            new FactGem.wingman.Where(new FactGem.wingman.Comparison('n', 'firstName', '=', 'Clark'))
                .orWhere(new FactGem.wingman.Comparison('n', 'age', '>', 12))
        );

        var group4 = new FactGem.wingman.Group(
            new FactGem.wingman.Where(group2).orWhere(group3));
        where = new FactGem.wingman.Where(group).andWhere(group4);
        expect(where.toString()).toEqual("(n.gender = 'female' AND n.age = 12) AND ((n.gender = 'male' AND n.age > 12) OR (n.firstName = 'Clark' OR n.age > 12))")
    });

});
