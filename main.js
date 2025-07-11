/**
 * main.js
 * PDBe Mol* viewer logic with support for local files and remote URLs
 * Author: Vijinim Mallawaarachchi
 */

const viewerContainer = document.getElementById('myViewer');
const fileInput = document.getElementById('pdbFileInput');
const urlInput = document.getElementById('pdbUrlInput');
const loadFromUrlBtn = document.getElementById('loadFromUrlBtn');

const viewerInstance = new PDBeMolstarPlugin();

// Render empty viewer on page load
// viewerInstance.render(viewerContainer, {
//   customData: null, // no structure on load
// });

// Load local file
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const options = {
    customData: {
      url: URL.createObjectURL(file),
      format: 'pdb',
      binary: false
    }
  };

  viewerInstance.render(viewerContainer, options);
});

// Load from URL
loadFromUrlBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    alert('Please enter a valid PDB file URL.');
    return;
  }

  const isGz = url.toLowerCase().endsWith('.gz');

  if (isGz) {
    // Call the decompression loader
    loadGzPdbToViewer(url);
  } else {
    // Load directly as normal
    const options = {
      customData: {
        url: url,
        format: 'pdb',
        binary: false
      }
    };
    viewerInstance.render(viewerContainer, options);
  }

});

async function loadGzPdbToViewer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const gzBuffer = await response.arrayBuffer();

    // Decompress using pako
    const decompressed = pako.inflate(gzBuffer, { to: 'string' });

    const blob = new Blob([decompressed], { type: 'text/plain' });
    const pdbUrl = URL.createObjectURL(blob);

    const options = {
      customData: {
        url: pdbUrl,
        format: 'pdb',
        binary: false
      }
    };

    viewerInstance.render(viewerContainer, options);
  } catch (err) {
    alert('Failed to load and decompress .pdb.gz:\n' + err.message);
    console.error(err);
  }
}

