'use strict';


const Code = require('code');
const expect = Code.expect;

const Tools = require('../');



function createCalculator() {

	return Tools.EventCalculator()
		.setFeeDiscounts({
			siblings: .25,
			leaders: 1,
			welfares: .5
		})
		.setFactorizers({

			fix: true,

			pa: ['attendees'],
			papn: ['attendees', 'nights'],
			papd: ['attendees', 'days'],

			pp: ['participants'],
			pppn: ['participants', 'nights'],
			pppd: ['participants', 'days'],

			pl: ['leaders'],
			plpn: ['leaders', 'nights'],
			plpd: ['leaders', 'days']

		});

}



describe('EventCalculator', function() {



	it('should calculate with given factorizer(s) (string)', function() {


		let c = createCalculator()
			.setCtx({
				days: 10,
				nights: 9,
				attendees: 97,
				leaders: 3,
				siblings: 2,
				welfares: 4,
				get participants() {
					return this.attendees + this.leaders;
				}
			})
			.setItems([{
				type: 'cost',
				category: 'travel',
				value: 10,
				factorizer: 'pa'
			}, {
				type: 'cost',
				category: 'hotel',
				value: 11,
				factorizer: 'pppn',
				ctx: {
					nights: 2
				}
			}, {
				type: 'cost',
				category: 'hotel',
				value: 11,
				factorizer: 'papn',
				ctx: {
					nights: 7
				}
			}, {
				type: 'revenue',
				category: 'donation',
				value: 100,
				factorizer: 'fix'
			}]);



		let res = c.calculate();

		expect(res.details, 'Details')
			.to.equal({
				expenses: {
					categories: {
						travel: 97 * 10,
						hotel: (100 * 2 * 11) + (97 * 11 * 7)
					},
					total: 970 + 9669
				},
				revenues: {
					categories: {
						donation: 100
					},
					total: 100
				}
			});


		// important for coverage branch
		let fees = c.getParticipantFees();

		expect(fees)
			.to.equal(res.fees);



		expect(res.fees, 'Fees')
			.to.equal({
				standard: 111.53,
				siblings: 83.65,
				leaders: 0,
				welfares: 55.77
			});


		let totalCosts = res.details.expenses.total - res.details.revenues.total;

		expect(res.fees.standard * 91 + res.fees.siblings * 2 + res.fees.welfares * 4, 'FeeRevenue')
			.to.be.above(totalCosts)
			.to.be.below(totalCosts + 1)

	});



	it('should calculate with given factors (array)', function() {


		let c = createCalculator()
			.setCtx({
				days: 10,
				nights: 9,
				attendees: 97,
				leaders: 3,
				siblings: 2,
				welfares: 4,
				get participants() {
					return this.attendees + this.leaders;
				}
			})
			.setItems([{
				type: 'cost',
				category: 'travel',
				value: 10,
				factors: ['attendees']
			}, {
				type: 'cost',
				category: 'hotel',
				value: 11,
				factors: ['participants', 'nights'],
				ctx: {
					nights: 2
				}
			}, {
				type: 'cost',
				category: 'hotel',
				value: 11,
				factors: ['attendees', 'nights'],
				ctx: {
					nights: 7
				}
			}, {
				type: 'revenue',
				category: 'donation',
				value: 100,
				factors: []
			}]);



		let res = c.calculate();

		expect(res.details, 'Details')
			.to.equal({
				expenses: {
					categories: {
						travel: 97 * 10,
						hotel: (100 * 2 * 11) + (97 * 11 * 7)
					},
					total: 970 + 9669
				},
				revenues: {
					categories: {
						donation: 100
					},
					total: 100
				}
			});


		// important for coverage branch
		let fees = c.getParticipantFees();

		expect(fees)
			.to.equal(res.fees);



		expect(res.fees, 'Fees')
			.to.equal({
				standard: 111.53,
				siblings: 83.65,
				leaders: 0,
				welfares: 55.77
			});


		let totalCosts = res.details.expenses.total - res.details.revenues.total;

		expect(res.fees.standard * 91 + res.fees.siblings * 2 + res.fees.welfares * 4, 'FeeRevenue')
			.to.be.above(totalCosts)
			.to.be.below(totalCosts + 1)

	});



});
