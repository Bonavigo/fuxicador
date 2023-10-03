const FUXICADOR = {
	startup() {
		document.getElementById("ano_footer").innerHTML = new Date().getFullYear();
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
	},
	verify_enter(event, nick, hotel) {
		var key = event.which || event.keyCode;
		if (key == 13 && nick) {
			FUXICADOR.getBasicData(nick, hotel);
		}
	},
	search(nick, hotel) {
		if (nick) {
			document.querySelector("#home_pesquisa").innerHTML = '<img src="assets/img/progress_bubbles.gif">';
			FUXICADOR.getBasicData(nick, hotel);	
		}
	},
	getBasicData(nick, hotel) {
		var success = function change_data(response) {
			response = JSON.parse(response);

			document.title = "Fuxicador Habbo - "+response.name;
			document.querySelector("#home_pesquisa").setAttribute('style', 'display:none !important;');
			document.querySelector("#home_resultado").style.display = 'block';
			document.querySelector("#home_sucesso").style.display = 'block';

			document.querySelector("#personagem").style.backgroundImage = 'url(http://www.habbo'+hotel+'/habbo-imaging/avatarimage?user='+response.name+'&action=std&direction=2&head_direction=2&gesture=std&size=b)';
			document.querySelector("#nick_usuario_titulo").innerText = response.name;
			document.querySelector("#nick_usuario").innerText = response.name;

			let timestamp = Date.parse(response.memberSince);
			let date = new Date(timestamp);
			date = date.toLocaleString();
			var split = date.split(" ");
			var split = date.split(",");
			date = split[0];
			document.querySelector("#data_home_criacao").innerText = date;

			document.querySelector("#missao_home").innerHTML = FUXICADOR.emojis(response.motto);

			if (response.online === true) {
				document.querySelector("#home_online").style.display = 'block';
			} else {
				document.querySelector("#home_offline").style.display = 'block';
			}
			let emblemas_favoritados = '';
			for (var i = response.selectedBadges.length - 1; i >= 0; i--) {
				emblemas_favoritados += '<img src="https://images.habbo.com/c_images/album1584/'+response.selectedBadges[i].code+'.png" class="emblemas pixelated" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+response.selectedBadges[i].name+' - '+response.selectedBadges[i].description+'">';
			}
			document.querySelector("#emblemas_favoritados").innerHTML = emblemas_favoritados;
			FUXICADOR.getAdvancedData(response.uniqueId, hotel);
		}

		var error = function error() {
			document.querySelector("#home_pesquisa").setAttribute('style', 'display:none !important;');
			document.querySelector("#home_resultado").style.display = 'block';
			document.querySelector("#home_loading_verification").style.display = 'block';
			document.querySelector("#ban_check").setAttribute('src', 'http://www.habbo'+hotel+'/habbo-imaging/avatarimage?user='+nick+'&action=std&direction=2&head_direction=2&gesture=std&size=b)');
			document.querySelector("#ban_check").setAttribute('onerror', 'FUXICADOR.userNotFound()');
			document.querySelector("#ban_check").setAttribute('onload', 'FUXICADOR.userBanned()');
		}
	
		var url = "https://www.habbo"+hotel+"/api/public/users?name="+nick;
		easyAJAX.GET(url, success, error);
	},
	getAdvancedData(uniqueId, hotel) {
		var xhttp = new XMLHttpRequest();
		url = 'https://www.habbo'+hotel+'/api/public/users/'+uniqueId+'/profile';
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				response = JSON.parse(xhttp.response);
				let grupos = response.groups.reverse();
				let amigos = response.friends.reverse();
				let quartos = response.rooms.reverse();
				let emblemas = response.badges.reverse();

				let emblemas_html = '';
				for (var i = emblemas.length - 1; i >= 0; i--) {
					emblemas_html += '<img src="https://images.habbo.com/c_images/album1584/'+emblemas[i].code+'.png" class="emblemas pixelated" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+emblemas[i].name+' - '+emblemas[i].description+'"></img>';
				}
				document.querySelector("#lista_emblemas").innerHTML = emblemas_html;

				let html_amigos = '';
				for (var i = amigos.length - 1; i >= 0; i--) {
					html_amigos += `
					<li class="list-group-item">
						<div class="d-flex">
							<div class="coluna-lista-amigos">
								<div class="personagem-lista-amigos" style="background: url(https://www.habbo${hotel}/habbo-imaging/avatarimage?img_format=png&user=${amigos[i].name}&direction=2&head_direction=2&size=s&action=std) no-repeat 0px -9px;"></div>
							</div>
							<div class="coluna-lista-texto">
								<a href="https://www.habbo${hotel}/profile/${amigos[i].name}" target="_blank" class="texto-nome-lista">${amigos[i].name}</a>
								<p class="texto-missao-lista">${FUXICADOR.emojis(amigos[i].motto)}</p>
							</div>
						</div>
					</li>
					`;
				}
				document.querySelector("#lista_amigos").innerHTML = html_amigos;

				let html_grupos = '';
				for (var i = grupos.length - 1; i >= 0; i--) {
					html_grupos += `
					<li class="list-group-item">
						<div class="d-flex">
							<div class="coluna-lista-imagem">
								<div class="imagem-grupos" style="background: url(https://www.habbo${hotel}/habbo-imaging/badge/${grupos[i].badgeCode}.gif), no-repeat;"></div>
							</div>
							<div class="coluna-lista-texto">
								<a href="https://www.habbo${hotel}/hotel?room=${grupos[i].roomId}" target="_blank" class="texto-nome-lista">${FUXICADOR.emojis(grupos[i].name)}</a>
								<p class="texto-missao-lista">${FUXICADOR.emojis(grupos[i].description)}</p>
							</div>
						</div>
					</li>`;
				}
				document.querySelector("#lista_grupos").innerHTML = html_grupos;

				let html_quartos = '';
				for (var i = quartos.length - 1; i >= 0; i--) {
					html_quartos += `
					<li class="list-group-item">
						<div class="d-flex">
							<div class="coluna-lista-imagem">
								<div class="imagem-quartos"></div>
							</div>
							<div class="coluna-lista-texto">
								<a href="https://www.habbo${hotel}/hotel?room=${quartos[i].uniqueId}" target="_blank" class="texto-nome-lista">${FUXICADOR.emojis(quartos[i].name)}</a>
								<p class="texto-missao-lista">${FUXICADOR.emojis(quartos[i].description)}</p>
							</div>
						</div>
					</li>
					`;
				}
				document.querySelector("#lista_quartos").innerHTML = html_quartos;

				document.querySelector("#num_emblemas").innerText = emblemas.length;
				document.querySelector("#num_amigos").innerText = amigos.length;
				document.querySelector("#num_grupos").innerText = grupos.length;
				document.querySelector("#num_quartos").innerText = quartos.length;
			} else if (xhttp.readyState == 4 && xhttp.status !== 200) {
				let emblemas_html = '<ul class="list-group lista_p" ><li class="list-group-item">O perfil deste Habbo é privado.</li></ul>';
				document.querySelector("#lista_emblemas").style.padding = '0px';
				document.querySelector("#lista_emblemas").innerHTML = emblemas_html;

				let html_amigos = '<li class="list-group-item">O perfil deste Habbo é privado.</li>';
				document.querySelector("#lista_amigos").innerHTML = html_amigos;
				let html_grupos = '<li class="list-group-item">O perfil deste Habbo é privado.</li>';
				document.querySelector("#lista_grupos").innerHTML = html_grupos;
				let html_quartos = '<li class="list-group-item">O perfil deste Habbo é privado.</li>';
				document.querySelector("#lista_quartos").innerHTML = html_quartos;

				document.querySelector("#num_emblemas").innerText = '?';
				document.querySelector("#num_amigos").innerText = '?';
				document.querySelector("#num_quartos").innerText = '?';
			}
			var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
			var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl)
			})
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	},
	userNotFound() {
		document.querySelector("#home_loading_verification").style.display = 'none';
		document.querySelector("#home_ban").style.display = 'none';
		document.querySelector("#home_erro").style.display = 'flex';
	},
	userBanned() {
		document.querySelector("#home_loading_verification").style.display = 'none';
		document.querySelector("#home_ban").style.display = 'block';
		document.querySelector("#home_erro").style.display = 'flex';
	},
	emojis(string) {
		string = string.replaceAll("†", '<span class="ubuntu">†</span>');
		string = string.replaceAll("µ", '<span class="ubuntu">µ</span>');
		string = string.replaceAll("ª", '<span class="ubuntu">ª</span>');
		string = string.replaceAll("‡", '<span class="ubuntu">‡</span>');
		string = string.replaceAll("•", '<span class="ubuntu">•</span>');
		string = string.replaceAll("ƒ", '<span class="ubuntu">ƒ</span>');
		string = string.replaceAll("|", '<span class="ubuntu">|</span>');
		string = string.replaceAll("»", '<span class="ubuntu">»</span>');
		string = string.replaceAll("º", '<span class="ubuntu">º</span>');
		string = string.replaceAll("¶", '<span class="ubuntu">¶</span>');
		string = string.replaceAll("‘", '<span class="ubuntu">‘</span>');
		string = string.replaceAll("—", '<span class="ubuntu">—</span>');
		string = string.replaceAll("¥", '<span class="ubuntu">¥</span>');
		return string;
	}
}

FUXICADOR.startup();