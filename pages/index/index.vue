<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// 使用 uniCloud 访问
			uniCloud.callFunction({
			  name: 'service', // 要调用的云函数名称
			  data: {
			    action: 'api/login', // 路由地址，对应 controller 下 user.js 的 login 方法
			    // 参数列表
			    data: {
			      // controller 通过 this.ctx.data 获取
			      username: 'demo',
			      password: 'demo',
			    },
			  },
			})

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
