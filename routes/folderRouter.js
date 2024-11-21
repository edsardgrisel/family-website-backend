const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const multer = require('multer');
const AWS = require('aws-sdk');


// Upload to aws    
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    region: 'YOUR_REGION',
});

const s3 = new AWS.S3();

router.post('/upload', upload.array('photos'), async (req, res) => {
    try {
        const uploadPromises = req.files.map((file) => {
            const params = {
                Bucket: 'YOUR_BUCKET_NAME',
                Key: `${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            return s3.upload(params).promise();
        });

        const results = await Promise.all(uploadPromises);
        const urls = results.map((result) => result.Location);

        res.json({ urls });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get home page
router.get('/home', folderController.getHomePage);

// Create home page
router.post('/home', folderController.createHomePage);

// Edit home page 
router.put('/home', folderController.editHomePage);

// Delete home page
router.delete('/home', folderController.deleteHomePage);



// Get a folder by ID
router.get('/:folderId', folderController.getFolderById);

// Get all folders
router.get('/', folderController.getAllFolders);

// Create a folder
router.post('/', folderController.createFolder);

// Delete a folder
router.delete('/:folderId', folderController.deleteFolder);

// Edit a folder
router.put('/:folderId', folderController.editFolder);

// Get a photo from a folder
router.get('/:folderId/photos/:photoId', folderController.getPhotoFromFolder);

// Add a photo to a folder
router.post('/:folderId/photos', folderController.addPhotoToFolder);

// Delete a photo from a folder
router.delete('/:folderId/photos/:photoId', folderController.deletePhotoFromFolder);



// Edit folder details
router.put('/:folderId', folderController.editFolderDetails);






// Get all photos from a folder (not sure if needed)
// router.get('/:folderId/photos', folderController.getAllPhotosFromFolder);

// Delete folder
// Delete a photo from a folder
// etc.

module.exports = router;