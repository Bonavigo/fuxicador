/* Por Bruno Bonavigo, 2021. https://github.com/Bonavigo */
easyAJAX = {
	GET(url, func_success, func_error) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				func_success(xhttp.response);
			} else if (xhttp.readyState == 4 && xhttp.status !== 200) {
				func_error();
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	},
	POST(url, post, func_success, func_error) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				func_success(xhttp.response);
			} else if (xhttp.readyState == 4 && xhttp.status !== 200) {
				func_error();
			}
		};
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(post);
	}
}