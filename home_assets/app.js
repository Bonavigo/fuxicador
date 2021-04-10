var ano = document.getElementById("ano_footer").innerHTML = new Date().getFullYear();
function verify_enter(event, nick) {
	var key = event.which || event.keyCode;
	if (key == 13) {
		search(nick);
	}
}
function motto(motto) {
	motto = motto.replaceAll("†", '<span class="ubunto_habbo">†</span>');
	motto = motto.replaceAll("µ", '<span class="ubunto_habbo">µ</span>');
	motto = motto.replaceAll("ª", '<span class="ubunto_habbo">ª</span>');
	motto = motto.replaceAll("‡", '<span class="ubunto_habbo">‡</span>');
	motto = motto.replaceAll("•", '<span class="ubunto_habbo">•</span>');
	motto = motto.replaceAll("ƒ", '<span class="ubunto_habbo">ƒ</span>');
	motto = motto.replaceAll("|", '<span class="ubunto_habbo">|</span>');
	motto = motto.replaceAll("»", '<span class="ubunto_habbo">»</span>');
	motto = motto.replaceAll("º", '<span class="ubunto_habbo">º</span>');
	motto = motto.replaceAll("¶", '<span class="ubunto_habbo">¶</span>');
	motto = motto.replaceAll("‘", '<span class="ubunto_habbo">‘</span>');
	motto = motto.replaceAll("—", '<span class="ubunto_habbo">—</span>');
	motto = motto.replaceAll("¥", '<span class="ubunto_habbo">¥</span>');
	return motto;
}
function search(nick, hotel) {
	document.getElementById("home_pesquisa").innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
	var success = function change_data(response) {
		response = JSON.parse(response);
		document.getElementById("home_pesquisa").setAttribute('style', 'display:none !important;');
		document.getElementById("home_resultado").style.display = 'block';
		document.getElementById("home_sucesso").style.display = 'block';

		document.getElementById("personagem").style.backgroundImage = 'url(http://www.habbo'+hotel+'/habbo-imaging/avatarimage?user='+response.name+'&action=std&direction=2&head_direction=2&gesture=std&size=b)';
		document.getElementById("nick_usuario").innerText = response.name;
		document.getElementById("home_usuario").innerText = response.name;
		let timestamp = Date.parse(response.memberSince);
		let date = new Date(timestamp);
		date = date.toLocaleString();
		var split = date.split(" ");
		date = split[0];
		document.getElementById("data_home_criacao").innerText = date;
		document.getElementById("missao_home").innerHTML = motto(response.motto);
		if (response.online === true) {
			document.getElementById("home_online").style.display = 'block';
		} else {
			document.getElementById("home_offline").style.display = 'block';
		}
		let emblemas_favoritados = '';
		for (var i = response.selectedBadges.length - 1; i >= 0; i--) {
			emblemas_favoritados += '<img src="https://images.habbo.com/c_images/album1584/'+response.selectedBadges[i].code+'.png" class="emblemas pixelated" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+response.selectedBadges[i].name+' - '+response.selectedBadges[i].description+'">';
		}
		document.getElementById("emblemas_favoritados").innerHTML = emblemas_favoritados;
		advanced_data(response.uniqueId, hotel);
	}
	var error = function error() {
		document.getElementById("home_pesquisa").setAttribute('style', 'display:none !important;');
		document.getElementById("home_resultado").style.display = 'block';
		document.getElementById("home_erro").style.display = 'block';
	}
	var url = "https://www.habbo"+hotel+"/api/public/users?name="+nick;
	easyAJAX.GET(url, success, error);
}
function advanced_data(uniqueId, hotel) {
	var xhttp = new XMLHttpRequest();
	url = 'https://www.habbo'+hotel+'/api/public/users/'+uniqueId+'/profile';
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			response = JSON.parse(xhttp.response);
			document.title = "Fuxicador Habbo - "+response.user.name;
			let grupos = response.groups.reverse();
			let amigos = response.friends.reverse();
			let quartos = response.rooms.reverse();
			let emblemas = response.badges.reverse();

			let emblemas_html = '';
			for (var i = emblemas.length - 1; i >= 0; i--) {
				emblemas_html += '<img src="https://images.habbo.com/c_images/album1584/'+emblemas[i].code+'.png" class="emblemas pixelated" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+emblemas[i].name+' - '+emblemas[i].description+'">';
			}
			document.getElementById("lista_emblemas").innerHTML = emblemas_html;

			let html_amigos = '';
			for (var i = amigos.length - 1; i >= 0; i--) {
				html_amigos += '<li class="list-group-item"><div class="pixelated" style="float:left;width:33px;height:48px;background: url(https://www.habbo'+hotel+'/habbo-imaging/avatarimage?img_format=png&amp;user='+amigos[i].name+'&amp;direction=2&amp;head_direction=2&amp;size=s&amp;action=std) no-repeat 0px -9px;"></div><div style="float:left;" class="text-preto-verdana"><a href="https://www.habbo'+hotel+'/profile/'+amigos[i].name+'" class="home_link_exbr">'+amigos[i].name+'</a><br><span class="break_word">'+motto(amigos[i].motto)+'</span></div><div style="clear:both;"></div></li>';
			}
			document.getElementById("lista_amigos").innerHTML = html_amigos;

			let html_quartos = '';
			for (var i = quartos.length - 1; i >= 0; i--) {
				html_quartos += '<li class="list-group-item"><div class="pixelated" style="float:left;width:44px;height:47px;background: url(https://exbrhbofc.net/arquivos/2021/02/room_icon_open.gif) -3px no-repeat"></div><div style="float:left;font-size:11px;color:#000;"><strong>'+quartos[i].name+'</strong><br>'+quartos[i].description+'</small></div><div style="clear:both;"></div></li>';
			}
			document.getElementById("lista_quartos").innerHTML = html_quartos;

			document.getElementById("num_emblemas").innerText = emblemas.length;
			document.getElementById("num_amigos").innerText = amigos.length;
			document.getElementById("num_quartos").innerText = quartos.length;
		} else if (xhttp.readyState == 4 && xhttp.status !== 200) {
			let emblemas_html = '<ul class="list-group lista_p" ><li class="list-group-item">O perfil deste Habbo é privado.</li></ul>';
			document.getElementById("lista_emblemas").style.padding = '0px';
			document.getElementById("lista_emblemas").innerHTML = emblemas_html;

			let html_amigos = '<li class="list-group-item">O perfil deste Habbo é privado.</li>';
			document.getElementById("lista_amigos").innerHTML = html_amigos;
			let html_quartos = '<li class="list-group-item">O perfil deste Habbo é privado.</li>';
			document.getElementById("lista_quartos").innerHTML = html_quartos;

			document.getElementById("num_emblemas").innerText = '?';
			document.getElementById("num_amigos").innerText = '?';
			document.getElementById("num_quartos").innerText = '?';
		}
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}