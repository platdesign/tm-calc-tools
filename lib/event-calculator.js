'use strict';


const CtxFactorizer = require('./ctx-factorizer');
const FeeDistributor = require('./feedistributor');

class EventCalculator {

	constructor() {
		this._factorizer = CtxFactorizer();
		this._feeDistributor = FeeDistributor();
		this._ctx = {};
		this._items = [];
	}

	setFactorizers(data) {
		this._factorizer.registerBulk(data);
		return this;
	}

	setCtx(ctx) {
		this._ctx = Object.assign({}, ctx);
		this._factorizer.setCtx(this._ctx);
		return this;
	}

	setItems(items) {
		this._items = items;
		return this;
	}

	setFeeDiscounts(discounts) {
		this._feeDistributor.registerDiscounts(discounts);
		return this;
	}



	_getItemsSum(items) {
		/* istanbul ignore if */
		if (!items || !items.length) {
			return 0;
		}

		return items.reduce((sum, i) => {
			return sum + this._factorizer.factorize(i.factorizer || i.factors, i.value, i.ctx);
		}, 0);
	}


	_getCategorySum(items, category) {
		return this._getItemsSum(items.filter(i => i.category === category))
	}

	_getCategoriesSums(items, categories) {
		return categories.reduce((res, cat) => {
			res[cat] = this._getCategorySum(items, cat)
			return res;
		}, {});
	}

	_getCategories(items) {
		return items.reduce((acc, i) => {
			if (!acc.includes(i.category)) {
				acc.push(i.category);
			}
			return acc;
		}, []);
	}

	getCalcDetails() {

		let costItems = this._items.filter(i => i.type === 'cost');
		let revenueItems = this._items.filter(i => i.type === 'revenue');

		let costCategories = this._getCategories(costItems);
		let revenueCategories = this._getCategories(revenueItems);

		let res = {

			expenses: {
				categories: this._getCategoriesSums(costItems, costCategories),
				total: this._getItemsSum(costItems),
			},

			revenues: {
				categories: this._getCategoriesSums(revenueItems, revenueCategories),
				total: this._getItemsSum(revenueItems)
			}

		};

		return res;
	}

	getParticipantFees(details) {
		details = details || this.getCalcDetails();
		return this._feeDistributor.distribute(details.expenses.total - details.revenues.total, this._ctx.participants, this._ctx);
	}

	calculate() {

		let details = this.getCalcDetails();

		return {
			details,
			fees: this.getParticipantFees(details)
		}
	}

}



module.exports = () => new EventCalculator();
