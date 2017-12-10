'use strict';

const applescript = require('applescript');
const spotify = require('spotify-node-applescript');

const PLAY = "PLAY";
const PAUSE = "PAUSE";
const STOP  = "STOP";
const PREVIOUS = "PREVIOUS";
const NEXT = "NEXT";
const VOLUME_UP = "VOLUME UP";
const VOLUME_DOWN = "VOLUME DOWN";
const MUTE_TOGGLE = "MUTE TOGGLE";
const POWER_ON = "POWER ON";
const POWER_OFF = "POWER OFF";
const CURSOR_LEFT = "CURSOR LEFT";
const CURSOR_RIGHT = "CURSOR RIGHT";
const CURSOR_ENTER = "CURSOR ENTER";


var artist, artworkUrl, trackName = "";
var audio_muted, audio_repeated, audio_shuffled = false;

/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onButtonPressed = function(action, deviceId) {
  console.log(`[CONTROLLER] ${action} button pressed for device ${deviceId}`);

  var script = "";
  switch (action) {
    case POWER_ON:
    case PLAY:
      console.log(`Spotify:PLAY ${deviceId}`);
      spotify.play(function(err){
          //update the artist name
          updateArtist()
      });
      break;
    case PAUSE:
      console.log(`Spotify:PAUSE ${deviceId}`);
      spotify.pause(function(err){});
      break;
    case POWER_OFF:
    case STOP:
      console.log(`Spotify:STOP  ${deviceId}`);
      spotify.pause(function(err){});
      break;
    case PREVIOUS:
    case CURSOR_LEFT:
      console.log(`Spotify:PREVIOUS  ${deviceId}`);
      spotify.previous(function(err){
        updateArtist()
      });
      break;
    case NEXT:
    case CURSOR_RIGHT:
      console.log(`Spotify:NEXT  ${deviceId}`);
      spotify.next(function(err){
        //update the artist name
        updateArtist();
      });
      break;
    case VOLUME_UP:
      console.log(`Spotify:VOLUME_UP  ${deviceId}`);
      spotify.volumeUp(function(err){});
      break;
    case VOLUME_DOWN:
      console.log(`Spotify:VOLUME_DOWN  ${deviceId}`);
      spotify.volumeDown(function(err){});
      break;
    case MUTE_TOGGLE:
      if (audio_muted) {
        spotify.unmuteVolume(function(err){});
        audio_muted = false;
      } else {
        spotify.muteVolume(function(err){});
        audio_muted = true;
      }
    break;
    case CURSOR_ENTER:
      console.log(`Spotify:TOGGLE PLAY/PAUSE ${deviceId}`);
      spotify.playPause(function(err){});
      break;


    default:
      console.log(`Unsupported button: ${action} for ${deviceId}`);
      return Promise.resolve(false);
  }

};

module.exports.getTrackInfo = function(deviceid) {

  console.log(`[CONTROLLER] get artist info on ${deviceid}!`);
  return artist + " / " + trackName;
}

module.exports.getImageUri = function(deviceid) {
  console.log(`[CONTROLLER] get image URI on ${deviceid}!`);
  return artworkUrl;
}

module.exports.init = function() {
  //start finding out the artist artist
  updateArtist();

  //is repeating enabled?
  spotify.isRepeating(function(err, repeating){
    setRepeated(repeating);
  });

  //is sbuffle enabled?
  spotify.isShuffling(function(err, shuffling){
    setShuffled(shuffling);
  });

}

module.exports.setRepeating = function(deviceid, value) {

  console.log(`[CONTROLLER] turn repeating to ` + value + ` for ${deviceid}!`);
  spotify.setRepeating(value, function(err) {});
  audio_repeated = value;
}

module.exports.getRepeating = function(deviceid) {
  return audio_repeated;
}

module.exports.setShuffling = function(deviceid, value) {

  console.log(`[CONTROLLER] turn shuffling to ` + value + ` for ${deviceid}!`);
  spotify.setShuffling(value, function(err) {});
  audio_shuffled = value;
}

module.exports.getShuffling = function(deviceid) {
  return audio_shuffled;
}

function setRepeated(value) {
  audio_repeated = value;
}

function setShuffled(value) {
  audio_shuffled = value;
}

function setArtist(name) {
  artist = name;
}

function setTrackName(name) {
  trackName = name;
}

function setArtworkUrl(url) {
  artworkUrl = url;
}

function updateArtist() {

  spotify.getTrack(function(err, track) {
    if (track != undefined) {
      setArtist(track.artist);
      setArtworkUrl(track.artwork_url);
      setTrackName(track.name);
    }
  });
}
