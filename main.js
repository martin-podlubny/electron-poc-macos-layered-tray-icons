const { app, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let currentMode = 'apple-with-indicator'; // 'apple-complex' or 'apple-with-indicator'
let animationInterval = null;
let isCycling = false; // Toggle for animation

// Load icons for 5-layer mode
const appleBodyTemplate = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-complex', 'apple-body-Template.png')
);

const appleLeafTemplate = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-complex', 'apple-leaf-Template.png')
);

const redDot = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-complex', 'red-dot.png')
);

const blueDot = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-complex', 'blue-dot.png')
);

const bellpeppers = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-complex', 'bellpeppers.png')
);

// Load icons for indicator mode
const appleTemplate = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-with-indicator', 'apple-Template.png')
);
// appleTemplate.setTemplateImage(true);

const appleRedDot = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-with-indicator', 'apple-red-dot.png')
);

// Load icons for indicator-reps mode
const appleRepsTemplate = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-with-indicator-reps', 'apple-repsTemplate.png')
);
// appleRepsTemplate.setTemplateImage(true);

const appleRedDotReps = nativeImage.createFromPath(
  path.join(__dirname, 'icons', 'apple-with-indicator-reps', 'apple-red-dot-reps.png')
);

function buildContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Layered Tray Icons Demo',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Apple with indicator',
      type: 'radio',
      checked: currentMode === 'apple-with-indicator',
      click: () => {
        currentMode = 'apple-with-indicator';
        updateMode();
        tray.setContextMenu(buildContextMenu());
      }
    },
    {
      label: 'Apple with indicator (1x vs. 2x reps)',
      type: 'radio',
      checked: currentMode === 'apple-with-indicator-reps',
      click: () => {
        currentMode = 'apple-with-indicator-reps';
        updateMode();
        tray.setContextMenu(buildContextMenu());
      }
    },
    {
      label: 'Apple complex',
      type: 'radio',
      checked: currentMode === 'apple-complex',
      click: () => {
        currentMode = 'apple-complex';
        updateMode();
        tray.setContextMenu(buildContextMenu());
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Enable Cycling',
      type: 'checkbox',
      checked: isCycling,
      click: () => {
        isCycling = !isCycling;
        updateMode();
        tray.setContextMenu(buildContextMenu());
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit();
      }
    }
  ]);
}

function updateMode() {
  // Clear any existing animation
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  // Determine which layers to use based on mode
  let layers;
  if (currentMode === 'apple-with-indicator') {
    layers = [appleTemplate, appleRedDot];
    console.log('Mode: Apple with indicator');
  } else if (currentMode === 'apple-with-indicator-reps') {
    layers = [appleRepsTemplate, appleRedDotReps];
    console.log('Mode: Apple with indicator (1x vs. 2x reps)');
  } else if (currentMode === 'apple-complex') {
    layers = [appleBodyTemplate, appleLeafTemplate, redDot, blueDot, bellpeppers];
    console.log('🎬 Mode: Apple complex');
  }

  if (isCycling) {
    // Start cycling animation
    let i = 0;
    animationInterval = setInterval(() => {
      const numLayers = (i++ % layers.length) + 1;
      tray.setImage({ layers: layers.slice(0, numLayers) });
    }, 1000);
    console.log('▶️  Cycling enabled');
  } else {
    // Show all layers statically
    tray.setImage({ layers: layers });
    console.log(`⏸️  Cycling disabled - showing all ${layers.length} layers`);
  }
}

app.whenReady().then(() => {
  try {
    tray = new Tray({
      layers: [
        appleTemplate,
        appleRedDot
      ]
    });

    tray.setToolTip('Layered Tray Icons Demo');
    tray.setContextMenu(buildContextMenu());

    console.log('✅ Tray icon created with layers!');

    // Start with current mode and cycling settings
    updateMode();

  } catch (error) {
    console.error('Failed to create tray icon:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => { });

