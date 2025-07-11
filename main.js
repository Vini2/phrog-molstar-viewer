const viewerContainer = document.getElementById('myViewer');
const fileInput = document.getElementById('pdbFileInput');
const urlInput = document.getElementById('pdbUrlInput');
const loadFromUrlBtn = document.getElementById('loadFromUrlBtn');

const viewerInstance = new PDBeMolstarPlugin();

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

  const options = {
    customData: {
      url: url,
      format: 'pdb',
      binary: false
    }
  };

  viewerInstance.render(viewerContainer, options);
});
