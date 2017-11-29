'use strict';



class CtxFactorizer {

	constructor() {
		this._factorizers = {};

		this.setCtx({});
	}

	setCtx(ctx) {
		this._ctx = ctx;
		return this;
	}

	register(key, factors) {
		this._factorizers[key] = factors;
		return this;
	}

	registerBulk(obj) {
		Object.keys(obj).forEach(key => this.register(key, obj[key]));
		return this;
	}

	factorize(key, value, ctx) {

		if (ctx) {
			ctx = Object.assign({}, this._ctx, ctx);
		} else {
			ctx = Object.assign({}, this._ctx);
		}

		let factors = this._factorizers[key];

		if (!factors) {
			throw new Error(`Unknown factorizer: '${key}'`);
		}

		if (factors === true || factors.length === 0) {
			return value;
		}

		if (typeof factors === 'function') {
			return factors(value, ctx);
		}

		return factors.reduce((sum, factorKey) => {

			let factor = ctx[factorKey];

			if (typeof factor !== 'number') {
				throw new Error(`ctx.${factorKey} needs to be a number`);
			}

			return sum * factor;
		}, value);

	}

}

module.exports = function(bulk = {}) {
	let instance = new CtxFactorizer();
	instance.registerBulk(bulk);
	return instance;
}
