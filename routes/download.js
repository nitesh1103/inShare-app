const router = require('express').Router();
const File = require('../models/File');
const path = require('path');

router.get('/:uuid', async (req, res) => {
  //console.log(req.params);
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if( !file ) {
      return res.render('download', { error: 'The Link is expired.' });
    };
    //console.log(file);
    // Generate file-path to download file.
    const filePath = path.join(__dirname, `../${file.path}`);
    //console.log(filePath);
    return res.download(filePath);
  }
  catch(err) {
    return res.render('download', { error: 'Something went wrong.' });
  };
});

module.exports = router;
