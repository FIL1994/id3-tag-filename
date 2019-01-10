const mm = require("music-metadata");
const FileHound = require("filehound");
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");
const padStart = require("lodash/padStart");

console.log("Getting files...");
const files = FileHound.create()
  .paths("../")
  .ext(".wav")
  .ignoreHiddenFiles()
  .findSync();

console.log(`Found ${files.length} files`);
console.log("Renaming files...");
files.forEach(file => {
  mm.parseFile(file).then(
    ({
      common: {
        track: { no: trackNumber },
        title,
        artist
      }
    }) => {
      const fileName = `${padStart(trackNumber, 2, "0")} - ${sanitize(title, {
        replacement: "-"
      })}`;

      const newFileName = path.format({
        dir: path.dirname(file),
        name: fileName,
        ext: path.extname(file)
      });

      console.log(`Renaming ${fileName} to ${newFileName}`);
      fs.renameSync(file, newFileName);
    }
  );
});
