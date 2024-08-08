const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// Get home page
router.get('/home', folderController.getHomePage);

// Create home page
router.post('/home', folderController.createHomePage);

// Edit home page 
router.put('/home', folderController.editHomePage);

// Get a folder by ID
router.get('/:folderId', folderController.getFolderById);

// Get all folders
router.get('/', folderController.getAllFolders);



// Create a folder
router.post('/', folderController.createFolder);

// Delete a folder
router.delete('/:folderId', folderController.deleteFolder);

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