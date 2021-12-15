const Controller = require("uni-cloud-router").Controller;

module.exports = class userController extends Controller {
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
};
