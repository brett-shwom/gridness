getSync = function (url) {
	var request = new XMLHttpRequest()
	request.open('GET', url, false)

	request.send()

	return request.responseText
}