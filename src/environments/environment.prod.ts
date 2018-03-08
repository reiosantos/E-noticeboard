export const environment = {
	production: true,
	userStorageKey: 'noticeBoardUser',
	api: 'http://localhost:3000/controller.php',
	generateDate: function () {
		const d = new Date();
		return (d.getFullYear().toString() + '-' +
			((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)).toString() + '-' +
			(d.getDate() < 10 ? '0' + d.getDate() : d.getDate()).toString() + ' ' +
			(d.getHours() < 10 ? '0' + d.getHours() : d.getHours()).toString() + ':' +
			(d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()).toString() + ':' +
			(d.getSeconds() < 10 ? '0' + d.getSeconds() :  d.getSeconds()).toString());
	}
};
