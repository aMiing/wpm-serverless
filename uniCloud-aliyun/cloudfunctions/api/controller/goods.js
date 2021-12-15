const Controller = require("uni-cloud-router").Controller;

module.exports = class vipController extends Controller {
	// 获取商品列表
	async getList() {
		const {
			event,
			context
		} = this.ctx;

		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
			event,
			context
		})
		const {
			pageNo,
			pageSize,
			type
		} = JSON.parse(event.body || '{}');
		let skip = 0,
			limit = 500;
		if (pageNo && pageSize) {
			skip = (pageNo - 1) * pageSize;
			limit = pageSize;
		}
		try {
			let res;
			if (type) {
				res = await db.collection('goods').where({
						category_id: type
					}).skip(skip)
					.limit(limit).get({
						getCount: true
					})

			} else {
				res = await db.collection('goods').skip(skip)
					.limit(limit).get({
						getCount: true
					})
			}
			const {
				data,
				count
			} = res;
			return {
				code: 200,
				msg: '获取商品列表成功！',
				data: {
					data,
					total: count
				},
			};
		} catch (err) {
			return {
				code: 500,
				msg: 'error',
				data: err,
			};
		}
	}

}
