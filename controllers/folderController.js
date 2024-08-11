const Photo = require('../models/photoModel');
const Folder = require('../models/folderModel');
const HomePage = require('../models/homePageModel');

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
        await Folder.findByIdAndDelete(folderId);

        // Remove the folder from the favouriteFolders array in the homePage document
        const homePage = await HomePage.findOne();
        if (homePage.favouriteFolders.includes(folderId)) {
            const folderIndex = homePage.favouriteFolders.findIndex(folder => folder === folderId);
            homePage.favouriteFolders.splice(folderIndex, 1);
            await homePage.save();
        }

        res.json({ message: 'Folder deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a photo from a folder
exports.getPhotoFromFolder = async (req, res) => {
    const folderId = req.params.folderId;
    const photoId = req.params.photoId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        const photo = folder.photos.find(photo => photo._id.toString() === photoId);
        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }
        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Edit a folder
exports.editFolder = async (req, res) => {
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

// Get homePage
exports.getHomePage = async (req, res) => {
    try {
        const homePage = await HomePage.findOne();
        if (!homePage) {
            return res.status(404).json({ message: 'Home page not found' });
        }
        res.json(homePage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Create homePage
exports.createHomePage = async (req, res) => {
    const newHomePage = new HomePage(req.body);
    try {
        const savedHomePage = await newHomePage.save();
        res.status(201).json(savedHomePage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Edit homePage
exports.editHomePage = async (req, res) => {
    try {
        let homePage = await HomePage.findOne();
        if (!homePage) {
            homePage = new HomePage(req.body);
        } else {
            homePage.set(req.body);
        }
        await homePage.save();
        res.json(homePage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Delete homePage
exports.deleteHomePage = async (req, res) => {
    try {
        const homePage = await HomePage.findOne();
        if (!homePage) {
            return res.status(404).json({ message: 'Home page not found' });
        }
        await HomePage.findByIdAndDelete(homePage._id);
        res.json({ message: 'Home page deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



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
