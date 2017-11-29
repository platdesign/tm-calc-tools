'use strict';



class FeeDistributor {

	constructor(discounts = {}) {
		this._discounts = Object.assign({}, discounts);
	}

	registerDiscount(key, discount) {
		this._discounts[key] = discount;
		return this;
	}

	registerDiscounts(discounts) {
		Object.keys(discounts).forEach(key => this.registerDiscount(key, discounts[key]));
		return this;
	}

	_round(value) {
		return Math.ceil(value * 100) / 100;
	}

	distribute(costs, cTotal, discounted) {


		// sanitize discounted object to only contain knwon discounting carriers
		discounted = Object.keys(this._discounts).reduce((acc, key) => {
			/* istanbul ignore else */
			if (discounted[key]) {
				acc[key] = discounted[key];
			}
			return acc;
		}, {});


		let res = {};

		let cDis = Object.keys(discounted).reduce((sum, key) => sum + discounted[key], 0);
		let cStd = cTotal - cDis;

		let vcDis = Object.keys(discounted).reduce((sum, key) => sum + (discounted[key] * (1 - this._discounts[key])), 0);

		let pStd = res.standard = this._round(costs / (vcDis + cStd));

		Object.keys(discounted).forEach(key => {
			res[key] = this._round(pStd * (1 - this._discounts[key]));
		});

		return res;
	}

}

module.exports = discounts => new FeeDistributor(discounts);
