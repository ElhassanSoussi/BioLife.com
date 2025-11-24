const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3000;
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const PROMOS_FILE = path.join(__dirname, 'data', 'promos.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOADS_DIR));

// Endpoint to get all products
app.get('/api/products', (req, res) => {
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).send('Error reading products file');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update products
app.post('/api/products', (req, res) => {
    const newProducts = req.body;
    fs.writeFile(PRODUCTS_FILE, JSON.stringify(newProducts, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing products file:', err);
            return res.status(500).send('Error writing products file');
        }
        res.send('Products updated successfully');
    });
});

// Endpoint to get all promos
app.get('/api/promos', (req, res) => {
    fs.readFile(PROMOS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading promos file:', err);
            return res.status(500).send('Error reading promos file');
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            console.error('Error parsing promos.json:', parseErr);
            res.status(500).send('Error parsing promotions data');
        }
    });
});

// Endpoint to update promos
app.post('/api/promos', (req, res) => {
    const newPromos = req.body;
    fs.writeFile(PROMOS_FILE, JSON.stringify(newPromos, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing promos file:', err);
            return res.status(500).send('Error writing promos file');
        }
        res.send('Promotions updated successfully');
    });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
