module.exports = {

	name: "Get Song Lyrics",

	section: "Audio Control",

	subtitle: function (data) {
		const info = ['Title', 'Artist', 'Lyrics', 'URL'];
		return `Get Lyrics - ${info[parseInt(data.info)]}`;
	},

	author: "NetLuis",

	version: "1.9.1",

	short_description:  "Gets lyrics of any song.",

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Song Type';
		switch (info) {
			case 0:
				dataType = "Song Name";
				break;
			case 1:
				dataType = "Song Artist";
				break;
			case 2:
				dataType = "Song Lyrics";
                break;
            case 3:
				dataType = "Song URL";
				break;
		}
		return ([data.varName, dataType]);
	},

	fields: ["song", "key", "info", "storage", "varName"],

	html: function (isEvent, data) {
        return `
        <div style="width: 550px; height: 350px; overflow-y: scroll;">
        <div>
		<div class="embed">
            <embedleftline style="background-color: #2b9696;"></embedleftline>
        <div class="embedinfo">
	    <span class="embed-auth"><u>Mod Info:</u><br>Made by <b>${this.author}</b></span><br>
	    <span class="embed-desc">${this.short_description}<br>Version: ${this.version}</span>
        </div>
        </div><br>
 <div style="width: 95%; padding-top: 8px;">
		Song to Search:<br>
		<textarea id="song" rows="2" placeholder="Write a song name here or use variables..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	 </div>
	 <div style="width: 95%; padding-top: 8px;">
	 	API Key:<br>
	 	<textarea id="key" rows="2" placeholder="Write your key. Get one from Genius." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  	</div>
	<div style="float: left; width: 55%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0" selected>Song Title</option>
			<option value="1">Song Artist</option>
			<option value="2">Song Lyrics</option>
			<option value="3">Song URL</option>
		</select>
        </div><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>
	<div style="float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			To get an API key, create a new app on https://genius.com/api-clients/new or check a tutorial by clicking <a href="https://www.youtube.com/watch?v=1IvpIJzCdto">here</a>.
		</p>
	<div>
</div>
        
        <style>
        /* START OF EMBED CSS */
        div.embed { /* <div class="embed"></div> */
            position: relative;
        }
            embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
                background-color: #eee;
                width: 4px;
                border-radius: 3px 0 0 3px;
                border: 0;
                height: 100%;
                margin-left: 4px;
                position: absolute;
            }
            div.embedinfo { /* <div class="embedinfo"></div> */
                background: rgba(46,48,54,.45) fixed;
                border: 1px solid hsla(0,0%,80%,.3);
                padding: 10px;
                margin:0 4px 0 7px;
                border-radius: 0 3px 3px 0;
            }
                span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
                    color: rgb(255, 255, 255);
                }
                span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
                    color: rgb(128, 128, 128);
                }
        
                span { /* Only making the text look, nice! */
                    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }
                </style>`
	},

	init: function () {
		const { glob, document } = this;
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function (cache) {
		const _this = this
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
        const geniustoken = this.evalMessage(data.key, cache);
        const songname = this.evalMessage(data.song, cache)

		const WrexMODS = this.getWrexMods();
		WrexMODS.CheckAndInstallNodeModule('analyrics');
		const analyrics = WrexMODS.require('analyrics');
        
        analyrics.setToken(`${geniustoken}`);

		analyrics.getSong(`${songname}`, function(song) {
			switch (info) {
				case 0:
					result = song.title;
					break;
				case 1:
					result = song.artist;
					break;
				case 2:
					result = song.lyrics;
                    break;
                case 3:
                    result = song.url;
					break;
				default:
					break;
			}
			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(result, storage, varName2, cache);
			}
			_this.callNextAction(cache);
		})
	},

	mod: function (DBM) {
	}

};
