const Controller = require("uni-cloud-router").Controller;

module.exports = class goodsController extends Controller {
	// 获取商品列表
	async getList() {
		const {
			ctx,
			db
		} = this;

		const {
			pageNo,
			pageSize,
			type
		} = JSON.parse(ctx.event.body || '{}');
		let skip = 0,
			limit = 500;
		if (pageNo && pageSize) {
			skip = (pageNo - 1) * pageSize;
			limit = pageSize;
		}
		try {
			const {
				data,
				count
			} = await db.collection('goods').where(type ? {
					category_id: type
				} : '').skip(skip)
				.limit(limit).get()
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
