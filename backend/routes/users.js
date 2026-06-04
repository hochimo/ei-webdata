import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';
import Follow from '../entities/follow.js';
import Ratings from '../entities/ratings.js';


const router = express.Router();

router.get('/', async function (req, res) {
  const followerId = req.query.followerId
    ? parseInt(req.query.followerId, 10)
    : null;

  try {
    const users = await appDataSource.getRepository(User).find({});
    let followedIds = [];

    if (followerId) {
      const followRows = await appDataSource
        .getRepository(Follow)
        .find({ where: { followerId } });
      followedIds = followRows.map((row) => row.followedId);
    }

    const usersWithFollow = users.map((user) => ({
      ...user,
      isFollowed: followerId ? followedIds.includes(user.id) : false,
    }));

    res.json({ users: usersWithFollow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while fetching users' });
  }
});

router.get('/user_id/ratings', function (req, res) {
  appDataSource
    .getRepository(Ratings)
    .find({
  relations: {
    movie: true,
    user: true
  },
  where: {
    user: { 
      id : parseInt(req.params.user_id) }, 
    }
  
})
    .then(function (rating) {
      if (rating) {
        res.json(rating);
      } else {
        res.status(404).json({ message: 'Rating not found' });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching the rating' });
    });
});


router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'User successfully created',
        id: savedUser.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

router.post('/:userId/follow', async function (req, res) {
  const followedId = parseInt(req.params.userId, 10);
  const followerId = req.body.followerId
    ? parseInt(req.body.followerId, 10)
    : null;

  if (!followerId) {
    return res.status(400).json({ message: 'Missing followerId' });
  }

  if (followerId === followedId) {
    return res.status(400).json({ message: 'Users cannot follow themselves' });
  }

  try {
    const followRepository = appDataSource.getRepository(Follow);
    const existingFollow = await followRepository.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      return res.status(200).json({ message: 'Already following' });
    }

    await followRepository.save({ followerId, followedId });
    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while following user' });
  }
});

router.delete('/:userId/follow', async function (req, res) {
  const followedId = parseInt(req.params.userId, 10);
  const followerId = req.body.followerId
    ? parseInt(req.body.followerId, 10)
    : null;

  if (!followerId) {
    return res.status(400).json({ message: 'Missing followerId' });
  }

  if (followerId === followedId) {
    return res.status(400).json({ message: 'Users cannot unfollow themselves' });
  }

  try {
    const result = await appDataSource.getRepository(Follow).delete({
      followerId,
      followedId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while unfollowing user' });
  }
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
