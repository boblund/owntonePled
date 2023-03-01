export {addSongs, addPlaylists, newPlaylist, savePlaylists};
import {allowDrop, dragStart, dragOver, olDrop} from './dragdrop.mjs';

const href = 'http://forked-daapd.local:3689/';
const liAttrs = {draggable: true};
let playlists = [];

async function addSongs(songsElement) {
	let songs = [],
		artists = JSON.parse(await curl(`api/library/artists`)).items
			.map(e => {const {name, id} = e; return {name, id};})
			.sort((a,b) => a.name > b.name ? 1 : -1);

	for(const artist of artists) {
		for(const album of JSON.parse(await curl(`api/library/artists/${artist.id}/albums`)).items.sort((a,b) => a.name > b.name ? 1 : -1)) {
			JSON.parse(await curl(`api/library/albums/${album.id}/tracks`)).items.forEach(track => {
				songs.push({
					trackName: `${track.artist}/${track.album}/${track.title}`,
					trackPath: track.path
				});
			});
		}
	}

	songs.forEach((entry) => {
		songsElement.append(newTrackElement(entry.trackName, entry.trackPath));
	});
}

async function addPlaylists(playlistsElement) {
	playlists = JSON.parse(await curl(`api/library/playlists`)).items
		.map(e => {const {name, id} = e; return {name, id, tracks: []};})
		.sort((a,b) => a.name > b.name ? 1 : -1);

	for(const playlist of playlists) {
		JSON.parse(await curl(`api/library/playlists/${playlist.id}/tracks`)).items.forEach(track => {
			playlist.tracks.push({
				trackName: `${track.artist}/${track.album}/${track.title}`,
				trackPath: track.path
			});
		});
	}

	for(const playlist of playlists) {
		playlistsElement.append(newPlaylistEntry(playlist));
	}
}

function newTrackElement(name, path) {
	const li = document.createElement('LI');
	// the event listers must be kept in sync with those in LI drop event handler on node copy
	li.addEventListener('dragover', dragOver);
	li.addEventListener('dragstart', dragStart);
	Object.keys(liAttrs).forEach(attribute => li.setAttribute(attribute, liAttrs[attribute]));
	li.innerHTML = name;
	li.setAttribute('path', path);
	return li;
}

function newPlaylistEntry(playlist){
	const details = document.createElement('DETAILS');
	const summary = document.createElement('SUMMARY');
	const ul = document.createElement('UL');

	summary.innerHTML = `<b> ${playlist.name} </b>`;
	details.append(summary);

	ul.setAttribute('id', playlist.name);
	ul.addEventListener('drop', olDrop);
	ul.addEventListener('dragover', allowDrop);
	ul.setAttribute('changed', 'no');
	details.append(ul);
	if(playlist.tracks) {
		playlist.tracks.forEach((entry) => {
			ul.append(newTrackElement(entry.trackName, entry.trackPath));
		});
	}
	return details;
}

function newPlaylist(plName) {
	let idx = playlists.findIndex(playlist => plName < playlist.name);
	let entry = document.querySelector('#Playlists').childNodes.item(idx);
	document.querySelector('#Playlists').insertBefore(newPlaylistEntry({name: plName}), entry);
}

function savePlaylists() {
	for(const playlist of document.querySelector('#Playlists').childNodes) {
		if(playlist.childNodes[1].getAttribute('changed') === 'yes') {
			const m3uName = playlist.childNodes[1].getAttribute('id') + '.m3u';
			let out = '#EXTM3U\n';
			for(const li of playlist.childNodes[1].childNodes) {
				out += li.getAttribute('path') + '\n';
			}
			out += '#EXTM3U\n';
			var textBlob = new Blob([out], {type:'text/plain'});
			var downloadLink = document.createElement("a");
			downloadLink.download = m3uName;
			downloadLink.innerHTML = "Download File";
			downloadLink.href = window.URL.createObjectURL(textBlob);
			downloadLink.click();
			downloadLink = null;
			textBlob = null;
			playlist.childNodes[1].setAttribute('changed', 'no');
		}
	}
	document.querySelector('#savePlBtn').hidden = true;
}

function curl(cmd, method='GET', headers={}, body='') {
	return new Promise((resolve, reject) => {
		const http = new XMLHttpRequest();
		http.open(method, `${href}${cmd}`);
		http.send();
		http.onreadystatechange = function() {
			if(this.readyState === 4) {
				if(this.status === 200) {
					resolve(http.responseText);
				} else {
					reject(new Error('Failed to load page, status code: ' + this.status));
				}
			}
		};
	});
};
