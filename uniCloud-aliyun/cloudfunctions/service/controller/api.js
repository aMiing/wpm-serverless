const Controller = require("uni-cloud-router").Controller;
const JwtUtil = require('./jwt');

module.exports = class apiController extends Controller {
	publicKey() {
		return {
			code: 200,
			msg: 'success',
			data: {
				mockServer: true,
				publicKey: '',
			},
		};
	}
	// 登录
	async login() {
		const {
			ctx,
			db
		} = this;
		const {
			username,
			password,
			from
		} = JSON.parse(ctx.event.body);

		// 数据库验证
		try {
			const {
				data
			} = await db.collection('user').where({
				usercode: username,
				password
			}).get({
				getOne: true
			});
			console.log('data', data)
			if (data.length) {
				// 角色字段role传入并生成token
				// const jwt = new JwtUtil(data[0]._id);
				// const token = jwt.generateToken();
				return {
					code: 200,
					msg: 'success',
					data: {
						accessToken: data[0]._id
					},
				}
			} else {
				return {
					code: 400,
					msg: '帐户或密码不正确。'
				}
			}
		} catch (err) {
			return {
				code: 500,
				msg: '接口异常，登陆失败',
				data: err,
			}
		}
		// 	// writeLogs(ctx, from)
	}
	// 用户信息获取
	async userInfo() {
		const {
			ctx,
			db
		} = this;
		const {
			accessToken
		} = JSON.parse(ctx.event.body);
		try {
			const {
				data
			} = await db.collection('user').where({
				_id: accessToken
			}).get({
				getOne: true
			});
			return {
				code: 200,
				msg: 'success',
				data: Object.assign(data[0], {
					permissions: JSON.parse(data[0].permissions || '[]'),
					avatar: 'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif',
				}),
			}
		} catch (err) {
			return {
				code: 500,
				msg: 'error',
				data: err,
			}
		}
	}
	// 分类数据获取
	async getTypeList() {
		const {
			ctx,
			db
		} = this;
		const {
			pageNo,
			pageSize
		} = JSON.parse(ctx.event.body);
		let skip = 0,
			limit = 500;
		if (pageNo && pageSize) {
			skip = (pageNo - 1) * pageSize;
			limit = pageSize;
		}
		const {
			data,
			count
		} = await db.collection('categories').orderBy('create_date desc')
			.skip(skip).limit(limit).get({
				getCount: true
			});
		try {
			return {
				code: 200,
				msg: "获取分类列表成功！",
				data: {
					data,
					total: count,
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
	// 获取商品列表
	async getList() {
		const {
			ctx,
			db
		} = this;

		const {
			pageNo,
			pageSize,
			type = ''
		} = JSON.parse(ctx.event.body);
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
			} = await db.collection('goods').where(`${new RegExp(type, 'i')}.test(category_id)`).skip(skip)
				.limit(limit).get({
					getCount: true
				})
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
};
