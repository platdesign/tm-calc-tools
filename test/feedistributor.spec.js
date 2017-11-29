'use strict';


const Code = require('code');
const expect = Code.expect;

const Tools = require('../');



describe('FeeDistributor', function() {

	it('should distribute for a single discount', function() {

		let d = Tools.FeeDistributor({
			siblings: .25
		});

		let res = d.distribute(1000, 10, {
			siblings: 2
		});

		expect(res.siblings)
			.to.equal(d._round(res.standard * 0.75));

		expect(Math.round(res.siblings * 2 + res.standard * 8))
			.to.equal(1000);

	});


	it('should distribute for multiple discounts', function() {

		let d = Tools.FeeDistributor({
			siblings: .25,
			leaders: 1,
			welfare: .8
		});

		let res = d.distribute(2000, 20, {
			siblings: 2,
			leaders: 3,
			welfare: 4
		});

		expect(res.siblings)
			.to.equal(d._round(res.standard * 0.75));

		expect(res.leaders)
			.to.equal(0);

		expect(res.welfare)
			.to.equal(d._round(res.standard * .2));

		expect(Math.round(res.welfare * 4 + res.siblings * 2 + res.leaders * 3 + res.standard * 11))
			.to.equal(2000);

	});

});
