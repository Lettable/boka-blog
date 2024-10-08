const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const connectDB = require('../config/db');
const nodemailer = require('nodemailer');


router.get('/', async (req, res) => {
  try {
    const locals = {
      title: 'Home - Boka',
      description: 'Blogging website using Node.js, Express.js and MongoDB.'
    };

    let perPage = 10;
    let page = req.query.page || 1;
    
    await connectDB();
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


router.get('/contact', (req, res) => {
  const locals = {
    title: 'Contact - Boka',
    description: 'Blogging website using Node.js, Express.js and MongoDB.'
  };
  res.render('contact', { locals });
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'mirzyadev@gmail.com',
      pass: 'iras jjgk xwie pehz'
    },
    timeout: 30000
  });

  console.log('Transporter created');

  const mailOptions = {
    from: 'mirzyadev@gmail.com',
    to: 'hassanimtiaz7722@gmail.com',
    subject: `Someone Contacted you from Boka!`,
    text: `Name: ${name}\nE-mail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending message!');
    }
    res.send('Message sent successfully!');
  });
});

router.get('/about', (req, res) => {
  const locals = {
    title: 'About - Boka',
    description: 'Blogging website using Node.js, Express.js and MongoDB.'
  };
  res.render('about', { locals });
});

router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: `${data.title} - Mirzya`,
      description: "Blogging website using Node.js, Express.js and MongoDB.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }
});

module.exports = router;