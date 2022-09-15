const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const { v4: uuid4 } = require('uuid');

// 1- Multer configuration.------------------------
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName =
      `${ Date.now() }-${ Math.round(Math.random() * 1E9) }${ path.extname(file.originalname) }`;
      // 3425896352-4000000000.jpg/png/zip/txt;
      cb(null, uniqueName);
  }
});

const handleMultipartFormData = multer({
  storage: diskStorage,
  limits: { fileSize: 1000000 * 100 } // 100 MB
}).single('myFile');
//-------------------------------------------------

// route for uploading file.
router.post('/', (req, res) => {
  // 2- Store file in uploads folder.
  handleMultipartFormData(req, res, async (err) => {
    // 2.1---------------
    if( err ) {
      return res.status(500).json({ error: err.message });
    };

    // 3- Validate request.
    // console.log(req.file);
    if( !req.file ) {
      return res.status(422).json({ error: 'All fields are required!' });
    };

    // 4- Store file data in Database.
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uuid: uuid4()
    });

    try {
      const result = await file.save();
      //console.log(result);
      // 5- Send response(sending link in res).
      return res.json({ file: `${process.env.APP_BASE_URL}/files/${result.uuid}` });
      // <http://localhost:3000>/files/<uuid>
    }
    catch(err) {
      console.error(err.error);
    };
  });
});

// route for send email.
router.post('/send', async (req, res) => {
  // console.log(req.body);
  const { uuid, emailFrom, emailTo } = req.body;
  // 1- Validate request.
  if( !uuid || !emailFrom || !emailTo ) {
    return res.status(422).json({ error: 'All fields are required.' });
  };

  // 2- Get file data from Database.
  try {
    const file = await File.findOne({ uuid: uuid });
    if( !file ) {
      return res.status(500).json({ error: 'Something went wrong.' });
    };
    // console.log(file);

    if( file.sender ) {
      return res.status(422).json({ error: 'Email already sent.' });
    };
    file.sender = emailFrom;
    file.receiver = emailTo;
    const result = await file.save();
    // console.log(result);

    // send email using nodemailer.
    const sendEmail = require('../services/emailService');
    sendEmail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare File Sharing',
      text: `${emailFrom} has shared a file with you.`,
      html: require('../services/emailTemplate')({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: `${parseInt(file.size / 1000)} KB`,
        expires: '24 hours'
      })
    });

    // Send res.
    return res.json({ success: true });
  }
  catch(err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  };
});

module.exports = router;
