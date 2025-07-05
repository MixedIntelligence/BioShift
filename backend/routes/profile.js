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
  updateUserProfile,
  markProfileCompleted,
  markOnboardingCompleted,
  getUserProfile,
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

// Get complete user profile
router.get('/complete/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Users can only access their own complete profile
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const profile = getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/update', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    updateUserProfile(userId, profileData);
    
    // Get updated profile
    const updatedProfile = getUserProfile(userId);
    res.json(updatedProfile);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Mark profile as completed
router.post('/complete', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    markProfileCompleted(userId);
    res.json({ success: true, message: 'Profile marked as completed' });
  } catch (err) {
    console.error('Mark profile complete error:', err);
    res.status(500).json({ error: 'Failed to mark profile as completed' });
  }
});

// Mark onboarding as completed
router.post('/onboarding/complete', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    markOnboardingCompleted(userId);
    res.json({ success: true, message: 'Onboarding marked as completed' });
  } catch (err) {
    console.error('Mark onboarding complete error:', err);
    res.status(500).json({ error: 'Failed to mark onboarding as completed' });
  }
});

// Update user profile with new fields
router.put('/update', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    // Update the profile
    updateUserProfile(userId, profileData);
    
    // Get the updated profile
    const updatedProfile = await getUserProfile(userId);
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;