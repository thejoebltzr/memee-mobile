import _ from 'lodash';
import superagent from 'superagent';
import {urls} from './urls';

export default {
	get(url, query = {}) {
		return new Promise(function (resolve, reject) {
			superagent
				.get(`${urls.baseUrl}/${url}`)
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('authToken', global.token)
				.accept('json')
				.query(query)
				.end((error, result) => {
					if (error) {
						return reject({
							error: error,
							result: result
						});
					}
					// if (need logout on app) {
					// 	handle logic here
					// 	return;
					// }
					resolve(JSON.parse(result.text));
				});
		});
	},
	post(url, body = {}) {
		return new Promise(function (resolve, reject) {
			superagent
				.post(`${urls.baseUrl}/${url}`)
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('authToken', global.token)
				.accept('json')
				.send(body)
				.end((error, result) => {
					if (error) {
						return reject({
							error: error,
							result: result
						});
					}
					// if (need logout on app) {
					// 	handle logic here
					// 	return;
					// }
					resolve(JSON.parse(result.text));
				});
		});
	},
	patch(url, body = {}) {
		return new Promise(function (resolve, reject) {
			superagent
				.patch(`${urls.baseUrl}/${url}`)
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('authToken', global.token)
				.accept('json')
				.send(body)
				.end((error, result) => {
					if (error) {
						return reject({
							error: error,
							result: result
						});
					}
					// if (need logout on app) {
					// 	handle logic here
					// 	return;
					// }
					resolve(JSON.parse(result.text));
				});
		});
	},
	delete(url, body = {}) {
		return new Promise(function (resolve, reject) {
			superagent
				.del(`${urls.baseUrl}/${url}`)
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('authToken', global.token)
				.accept('json')
				.send(body)
				.end((error, result) => {
					if (error) {
						return reject({
							error: error,
							result: result
						});
					}
					// if (need logout on app) {
					// 	handle logic here
					// 	return;
					// }
					resolve(JSON.parse(result.text));
				});
		});
	}
};
