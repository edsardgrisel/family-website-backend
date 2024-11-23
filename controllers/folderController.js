const Photo = require('../models/photoModel');
const Folder = require('../models/folderModel');
const HomePage = require('../models/homePageModel');

const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Delete a photo from a folder from s3
exports.deletePhotoFromS3 = async (req, res) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: req.params.photoUrl,
        };
        await s3.deleteObject(params).promise();
    } catch (err) {
        console.error('Error deleting photo from s3:', err);
        res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Photo deleted' });
};


// Get first photo from a folder from s3
exports.getFirstPhotoFromS3 = async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        if (folder.photos.length === 0) {
            res.json({ photoUrl: null });
        }

        const firstPhotoUrl = folder.photos[0];
        const url = new URL(firstPhotoUrl);
        const params = {
            Bucket: url.hostname.split('.')[0],
            Key: url.pathname.substring(1),
            Expires: 60 * 60, // URL expires in 1 hour
        };
        const photoUrl = s3.getSignedUrl('getObject', params);

        res.json({ photoUrl });
    } catch (err) {
        console.error('Error generating pre-signed URLs:', err);
        res.status(500).json({ message: err.message });
    }
}

// Get all photos from folder from s3
exports.getPhotosFromS3 = async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        const photoUrlTuples = folder.photos.map((photoUrl) => {
            const url = new URL(photoUrl);
            const params = {
                Bucket: url.hostname.split('.')[0],
                Key: url.pathname.substring(1),
                Expires: 60 * 60, // URL expires in 1 hour
            };
            const signedPhotoUrl = s3.getSignedUrl('getObject', params);
            return [photoUrl, signedPhotoUrl];
        });

        res.json({ photoUrlTuples });
    } catch (err) {
        console.error('Error generating pre-signed URLs:', err);
        res.status(500).json({ message: err.message });
    }
}


// Upload photos to s3
exports.uploadPhotos = async (req, res) => {
    try {
        const uploadPromises = req.files.map((file) => {
            const params = {
                Bucket: process.env.BUCKET_NAME,
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
};

exports.getPhotoFromS3 = async (req, res) => {
    const photoName = req.params.photoName;
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: photoName,
            Expires: 60 * 60, // URL expires in 1 hour
        };
        const signedPhotoUrl = s3.getSignedUrl('getObject', params);

        res.json({ signedPhotoUrl });
    } catch (err) {
        console.error('Error generating pre-signed URL:', err);
        res.status(500).json({ message: err.message });
    }
};

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
            return res.status(404).json({ message: 'Folder not found' });
        }
        folder.photos = folder.photos.filter(url => !url.includes(photoId));
        await folder.save();
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
