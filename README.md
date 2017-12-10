# NEEO's Mac spotify Controller
Controls the spotify of an Apple Mac via the NEEO remote controller

## Setup

1. Install NodeJS
2. Open Terminal and then:

`npm install -g meijerpeter/neeo-osx-spotify-controller`

This installs the NodeJS module globally in `/usr/local/lib/node_modules/neeo-osx-spotify-controller/` on your Mac.

3. To run the application, type:

`npm run start`

or:

`node /usr/local/lib/node_modules/neeo-osx-spotify-controller/index.js`

or:

`node neeo-osx-spotify-controller`

### Installation

Usage of the Mac's LaunchAgent is recommended to keep the NodeJS server running. Create the following file in a text editor of choice and place it in `~/Library/LaunchAgents` and name it: `com.meijerpeter.neeoosxspotifycontroller.plist`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>com.meijerpeter.neeoosxspotifycontroller</string>
	<key>ProgramArguments</key>
	<array>
		<string>/usr/local/bin/node</string>
		<string>/usr/local/lib/node_modules/neeo-osx-spotify-controller/index.js</string>
		<string>6337</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
</dict>
</plist>
```

With every reboot or new login the NodeJS server will start the `neeo-osx-spotify-controller` application on port 6336. Increment the port number if you have other NEOO modules running.
