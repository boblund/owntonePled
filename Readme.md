# OwntonePled

OwntonePled is a simple playlist editor for creating and editing owntone m3u playlists. It runs in a browser and must be served by a web server that properly serves ES6 modules (.mjs), which apache2 doesn't on Mac OS or raspberry pi debian. I use this [repo](https://github.com/boblund/localAwsApiGw) as a simple local web server:

```
PORT=XXX node localAwsGw.js --web=<dir where you installed this repo>
```

[Concepts](#concepts)

[Using](#using)

[License](#license)

# Concepts <a name="concepts"></a>

OwntonePled runs in a browser. It access owntone tracks and playlists via the owntone JSON API, which is assumed to be accessible at
```http://forked-daapd.local:3689```. Changed ```const href``` in songs3.mjs as necessary. The UI presents a list of tracks and playlists found in owntone. Tracks can be copied to playlists. Tracks can be copied or moved between playlists. Tracks can be reordered in playlisys and new playlists can be created. Changed playlists can be saved in m3u files.

# Using <a name="using"></a>

```
git clone git@github.com:boblund/owntonePled.git
```

Make the contents of the owntonePled directory available to your web server. Then browse to that location.

Tracks in the songs list can be dragged to a playlist. This does not change the contents of the songs list and tracks in the the songs list cannot be reordered or deleted. Dragging will reorder a track in a playlist. Dragging a track between playlists moves the track. A copy can be made by holding ```shift``` while dragging. A track can be deleted from a playlist be holding ```alt/option``` while dragging.

Playlist changes can be saved to an m3u file of the users choosing. If the chosen file is one read by owntone when it starts or updates then that will change the playlist in the owntone database.

A couple of limitations are imposed by HTML (or at least my knowledge of HTML). Multiple tracks cannot be dragged. It does not seem possible to implement copy/cut and paste along with drag and drop.

# License <a name="license"></a>

Creative Commons Attribution-NonCommercial 4.0 International
