const Photo = require('../models/photoModel');
const Folder = require('../models/folderModel');

// Get all folders
exports.getAllFolders = async (req, res) => {
    try {
        const folders = await Folder.find();
        res.json(folders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a folder by ID
exports.getFolderById = async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.json(folder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a folder
exports.createFolder = async (req, res) => {
    // Maybe new Folder() not needed
    const newFolder = new Folder(req.body);
    try {
        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a folder
exports.deleteFolder = async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        await folder.remove();
        res.json({ message: 'Folder deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a photo to a folder
exports.addPhotoToFolder = async (req, res) => {
    const folderId = req.params.folderId;
    // Maybe new Photo() not needed
    const newPhoto = new Photo(req.body);
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        folder.photos.push(newPhoto);
        await folder.save();

        res.status(201).json(newPhoto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a photo from a folder
exports.deletePhotoFromFolder = async (req, res) => {
    const folderId = req.params.folderId;
    const photoId = req.params.photoId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            console.log('Folder not found');
            return res.status(404).json({ message: 'Folder not found' });
        }
        const photoIndex = folder.photos.findIndex(photo => photo._id.toString() === photoId);
        if (photoIndex === -1) {
            console.log('Photo not found');
            return res.status(404).json({ message: 'Photo not found' });
        }
        folder.photos.splice(photoIndex, 1); // Remove the photo from the array
        await folder.save(); // Save the parent document
        await Photo.findByIdAndDelete(photoId); // Delete the photo document
        console.log('Photo deleted');
        res.json({ message: 'Photo deleted' });
    } catch (err) {
        console.log('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Edit folder details
exports.editFolderDetails = async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        folder.set(req.body);
        await folder.save();
        res.json(folder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get all photos from a folder (maybe not needed)
// exports.getAllPhotosFromFolder = async (req, res) => {
//     const folderId = req.params.folderId;
//     try {
//         const folder = await Folder.findById(folderId);
//         if (!folder) {
//             return res.status(404).json({ message: 'Folder not found' });
//         }
//         res.json(folder.photos);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
