const Controller = require("uni-cloud-router").Controller;

module.exports = class goodsController extends Controller {
	// 获取订单列表
	async getList() {
		const {
			event,
			context
		} = this.ctx;
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
			event,
			context
		})
		try {
			const {
				data,
				count
			} = await db.collection('vip').where({
				delete: 1
			}).orderBy('create_date desc').get({
				getCount: true
			})
			return {
				code: 200,
				msg: '获取会员列表成功！',
				data: {
					list: data,
					count
				},
			};
		} catch (err) {
			return {
				code: 500,
				msg: 'error',
				data: err,
			};
		}
	};
	// 新增、更新会员
	async updateOrCreate() {
		const {
			event,
			context
		} = this.ctx;
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
			event,
			context
		})

		const {
			row
		} = JSON.parse(event.body || '{}')
		try {
			const {
				id
			} = await db.collection.doc('vip').set(row);
			return {
				code: 200,
				msg: (row._id ? '更新' : '新增') + '会员成功！',
				data: id,
			};
		} catch (err) {
			return {
				code: 500,
				msg: 'error',
				data: err,
			};
		}
	};

	// 删除会员
	async deleteItem() {
		const {
			event,
			context
		} = this.ctx;
		const db = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
			event,
			context
		})

		const {
			ids
		} = JSON.parse(event.body || '{}')
		const sql = `UPDATE vip SET deleted=2 WHERE uuid=?`;
		try {
			const dbCmd = db.command
			await collection.where({
				_id: dbCmd.in(ids)
			}).update({
				deleted: 2,
			})
			return {
				code: 200,
				msg: '删除会员成功！',
			};
		} catch (err) {
			return {
				code: 500,
				msg: 'error',
				data: err,
			};
		}
	};

}
