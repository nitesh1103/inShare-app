const File = require('./models/File');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

async function deleteData() {
  // fetch 24 hrs old files and delete them.
  const pastDate = new Date(Date.now() - (24 * 60 * 60 * 1000));
  const files = await File.find({ createdAt: { $lt: pastDate } });
  // console.log(files);
  if( files.length ) {
    for( let file of files ) {
      try {
        // Unlink from uploads folder.
        fs.unlinkSync(file.path);
        // Remove file from Database.
        await file.remove();
        console.log(`Successfully removed file ${file.filename}`);
      }
      catch(err) {
        console.log(`Error while removing file ${err}`);
      };
    };
    console.log('Job Done!');
  };
};

deleteData()
  .then(process.exit);
