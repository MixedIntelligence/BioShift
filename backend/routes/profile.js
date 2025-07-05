const express = require('express');
const router = express.Router();
const {
  getUserSkills,
  addUserSkill,
  getUserEducation,
  addUserEducation,
  getUserPublications,
  addUserPublication,
  getUserDocuments,
  addUserDocument,
  findUserById,
  getApplicationStatus,
} = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  }
});

const upload = multer({ storage: storage });

// Consolidated user profile endpoint
router.get('/:userId', auth, async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const requester = req.user;

    // Start with the basic public profile
    const user = await findUserById(requestedUserId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const publicProfile = {
      name: user.username,
      headline: user.headline, // Assuming headline exists
      skills: await getUserSkills(requestedUserId),
    };

    // If the requester is a 'Lab', add the extended data
    if (requester && requester.role === 'Lab') {
      const applicationStatus = await getApplicationStatus(requestedUserId, requester.id);
      const extendedProfile = {
        ...publicProfile,
        education: await getUserEducation(requestedUserId),
        publications: await getUserPublications(requestedUserId),
        documents: await getUserDocuments(requestedUserId),
      };
      if (applicationStatus === 'accepted') {
        extendedProfile.email = user.email;
      }
      return res.json(extendedProfile);
    }

    // Otherwise, return only the public profile
    res.json(publicProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Documents
router.get('/documents/:userId', auth, async (req, res) => {
  try {
    const documents = await getUserDocuments(req.params.userId);
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/documents', auth, upload.single('document'), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const newDocument = await addUserDocument(req.user.id, filename, path);
    res.json(newDocument);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Skills
router.get('/skills/:userId', auth, async (req, res) => {
  try {
    const skills = await getUserSkills(req.params.userId);
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/skills', auth, async (req, res) => {
  const { skill } = req.body;
  try {
    const newSkill = await addUserSkill(req.user.id, skill);
    res.json(newSkill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Education
router.get('/education/:userId', auth, async (req, res) => {
  try {
    const education = await getUserEducation(req.params.userId);
    res.json(education);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/education', auth, async (req, res) => {
  try {
    const newEducation = await addUserEducation(req.user.id, req.body);
    res.json(newEducation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Publications
router.get('/publications/:userId', auth, async (req, res) => {
  try {
    const publications = await getUserPublications(req.params.userId);
    res.json(publications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/publications', auth, async (req, res) => {
  try {
    const newPublication = await addUserPublication(req.user.id, req.body);
    res.json(newPublication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;