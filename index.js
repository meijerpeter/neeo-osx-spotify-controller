'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');


console.log('NEEO SDK "OSX Spotify" adapter');
console.log('------------------------------------------');

controller.init();

/*
 * Adapter - an Adapter contains one or more DEVICES. In this case we only use single volume device
 */

// first we set the device info, used to identify it on the Brain
const spotifyController = neeoapi.buildDevice('OSX Controller')
  .setManufacturer('Spotify')
  .addAdditionalSearchToken('music')
  .setType('MEDIAPLAYER')

  // Then we add the capabilities of the device
  .addButtonGroup('Transport')
  .addButtonGroup('Transport Scan')
  .addButtonGroup('VOLUME')
  .addButtonGroup('POWER')
  .addButtonGroup('Controlpad')
  .addButtonHandler(controller.onButtonPressed)

  .addSwitch(
    { name: 'repeat', label: 'Repeat' },
    { setter: controller.setRepeating, getter: controller.getRepeating }
  )

  .addSwitch(
    { name: 'shuffle', label: 'Shuffle' },
    { setter: controller.setShuffling, getter: controller.getShuffling }
  )

  //Add artist information
  .addTextLabel(
    { name: 'info', label: 'info' },
    controller.getTrackInfo
  )
  .addImageUrl(
    { name: 'albumcover', label: 'Cover for current album', size: 'large' },
    controller.getImageUri
  );

function startController(brain, port) {
  console.log('- Start server on port ' + port);

  neeoapi.startServer({
    brain,
    port: port,
    name: 'osx-spotify-controller',
    devices: [spotifyController]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "NEEO Accessory".');
  })
  .catch((error) => {
    //if there was any error, print message out to console
    console.error('ERROR!', error.message);
    process.exit(1);
  });
}

//Fetch the optional port number via the path argument variable
const portnumber = parseInt(process.argv.slice(2));

//START Brain discovery
const brainIp = process.env.BRAINIP;
if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startController(brainIp, portnumber);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      startController(brain, portnumber);
    });
}
