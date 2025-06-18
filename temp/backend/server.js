const express   = require('express');
const multer    = require('multer');
const path      = require('path');
const fs        = require('fs');
const { exec }  = require('child_process');
const cors     = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });


const uploadsDir     = path.join(__dirname, 'uploads');
const sampleXsdPath  = path.join(uploadsDir, 'sample.xsd');
const publicDir      = path.join(__dirname, 'public');
const schemaJsonPath = path.join(publicDir, 'schema.json');


[uploadsDir, publicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
app.use(cors());
app.use(express.static(publicDir));

app.post('/upload', upload.single('xsdFile'), (req, res) => {

  [sampleXsdPath, schemaJsonPath].forEach(fp => {
    if (fs.existsSync(fp)) {
      try { fs.unlinkSync(fp); }
      catch (err) { console.warn(`Could not delete ${fp}:`, err); }
    }
  });


  fs.rename(req.file.path, sampleXsdPath, (renameErr) => {
    if (renameErr) {
      console.error('Error moving uploaded file:', renameErr);
      return res.status(500).json({ error: 'Failed to process upload' });
    }

    console.log(`Converting XSD: ${sampleXsdPath} → JSON Schema: ${schemaJsonPath}`);
    exec(`xjc ${sampleXsdPath} ${schemaJsonPath}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Conversion error:', stderr);
        return res.status(500).json({ error: 'Failed to convert XSD' });
      }
      console.log('Conversion successful:', stdout);
      res.json({ message: 'Conversion successful' });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
