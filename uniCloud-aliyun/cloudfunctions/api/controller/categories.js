const Controller = require("uni-cloud-router").Controller;

module.exports = class categoriesController extends Controller {
	// 分类数据获取
	async getTypeList() {
		const {
			ctx,
			db
		} = this;
		const {
			pageNo,
			pageSize
		} = JSON.parse(ctx.event.body || '{}');
		let skip = 0,
			limit = 500;
		if (pageNo && pageSize) {
			skip = (pageNo - 1) * pageSize;
			limit = pageSize;
		}
		// .orderBy('create_date')
		// .field('_id as id')
		const {
			data
		} = await db.collection('categories')
			.skip(skip).limit(limit).get();
		const {
			total
		} = await db.collection('categories')
			.skip(skip).limit(limit).count();
		try {
			return {
				code: 200,
				msg: "获取分类列表成功！",
				data: {
					data: data.map(e => {
						return {
							...e,
							uuid: e._id
						}
					}),
					total,
				},
			};
		} catch (err) {
			return {
				code: 500,
				msg: "error",
				data: err,
			};
		}
	};
	//新增分类列表
	async addTypeList() {
		const {
			ctx,
			db
		} = this;

		const row = JSON.parse(ctx.event.body);

		try {

			db.collection('categories').add(row)
			return {
				code: 200,
				msg: "新增分类成功！",
				data: _row,
			};
		} catch (err) {
			return {
				code: 500,
				msg: "error",
				data: err,
			};
		}
	}

}
