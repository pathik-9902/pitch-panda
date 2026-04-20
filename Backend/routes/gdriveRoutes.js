const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

const drive = google.drive({
  version: 'v3',
  auth: 'AIzaSyBVyaV0EEkg59U_yq3EVd6-jULTX84FOGg', 
});

router.get('/images', async (req, res) => {
  const { folderId } = req.query;
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
    });
    const files = response.data.files;
    if (!files.length) {
      console.warn('No images found in the specified folder.');
    }
    res.json(files);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Error fetching images');
  }
});

module.exports = router;
