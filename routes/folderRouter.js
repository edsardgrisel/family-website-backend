const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const multer = require('multer');
const upload = multer();

// Delete a photo from a folder from s3
router.delete('/delete/:photoUrl', folderController.deletePhotoFromS3);

// Upload images to s3
router.post('/upload', upload.array('photos'), folderController.uploadPhotos);

// Get first photo from a folder from s3
router.get('/:folderId/photo', folderController.getFirstPhotoFromS3);

// Get all photos from a folder from s3 
router.get('/:folderId/photos', folderController.getPhotosFromS3);

// Get a photo from a folder from s3
router.get('/photo/:photoName', folderController.getPhotoFromS3);


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