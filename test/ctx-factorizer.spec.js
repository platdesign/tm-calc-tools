'use strict';


const Code = require('code');
const expect = Code.expect;

const Tools = require('../');



describe('CtxFactorizer', function() {



	it('factorize fixed value (config: Boolean)', function() {

		let f = Tools.CtxFactorizer({
			fix: true
		});

		let res = f.factorize('fix', 10);

		expect(res)
			.to.equal(10);

	});



	it('factorize fixed value (config: empty Array)', function() {

		let f = Tools.CtxFactorizer({
			fix: []
		});

		let res = f.factorize('fix', 10);

		expect(res)
			.to.equal(10);

	});



	it('factorize ctx based value (config: array with single entry)', function() {

		let f = Tools.CtxFactorizer({
			pa: ['attendees']
		});

		let res = f.factorize('pa', 10, {
			attendees: 10
		});

		expect(res)
			.to.equal(100);

	});



	it('factorize ctx based value (config: array with multiple entries)', function() {

		let f = Tools.CtxFactorizer({
			papd: ['attendees', 'days']
		});

		let res = f.factorize('papd', 10, {
			attendees: 10,
			days: 2
		});

		expect(res)
			.to.equal(200);

	});



	it('factorize ctx based value (config: function)', function() {

		let f = Tools.CtxFactorizer({
			pa: (value, ctx) => value * ctx.attendees
		});

		let res = f.factorize('pa', 10, {
			attendees: 10
		});

		expect(res)
			.to.equal(100);

	});



	it('should throw error on unknwon factorizer', function() {

		let f = Tools.CtxFactorizer();

		expect(() => f.factorize('unknwon', 10))
			.to.throw(Error, `Unknown factorizer: 'unknwon'`);

	});



	it('should throw error on missing ctx attribute', function() {

		let f = Tools.CtxFactorizer({
			papd: ['attendees', 'days']
		});

		expect(() => f.factorize('papd', 10, {
				attendees: 10
			}))
			.to.throw(Error, `ctx.days needs to be a number`);

	});



	it('should use global ctx', function() {

		let f = Tools.CtxFactorizer({
			test: ['test']
		});

		f.setCtx({
			test: 123
		});

		let res = f.factorize('test', 10);

		expect(res)
			.to.equal(1230);

	});
});
