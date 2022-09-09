const router = require('express').Router();
const File = require('../models/File');

router.get('/:uuid', async (req, res) => {
  //console.log(req.params);
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if( !file ) {
      return res.render('download', { error: 'The Link is expired.' });
    };
    return res.render('download', {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
      // <http://localhost:3000>/files/download/<uuid>
    });
  }
  catch(err) {
    return res.render('download', { error: 'Sometning went wrong.' });
  };
});

module.exports = router;
