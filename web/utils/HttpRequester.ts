import {API_ENDPOINT} from '../../server/src/provider/routes.helper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios').default;

export class HttpRequester {
	public static async getHttp(url: string, params?: any) {
		try {
			const currentUserId = localStorage.getItem('user-id');
			const token = localStorage.getItem('login-token');
			const response = await axios.get(`/${API_ENDPOINT}/${url}`, {
				params: {
					'current-user-id': currentUserId,
					token,
					...params,
				},
			});
			return response.data;
		} catch (e) {
			console.error(e);
		}
	}

	public static async postHttp(url: string, data: any) {
		try {
			const currentUserId = localStorage.getItem('user-id');
			const token = localStorage.getItem('login-token');
			const response = await axios.post(`/${API_ENDPOINT}/${url}`, {
				'current-user-id': currentUserId,
				token,
				...data,
			});
			return response.data;
		} catch (e) {
			console.error(e);
		}
	}

	public static async deleteHttp(url: string, data?: any) {
		try {
			const currentUserId = localStorage.getItem('user-id');
			const token = localStorage.getItem('login-token');
			const response = await axios.delete(`/${API_ENDPOINT}/${url}`, {
				data: {
					'current-user-id': currentUserId,
					token,
					...data,
				},
			});
			return response.data;
		} catch (e) {
			console.error(e);
		}
	}
}
