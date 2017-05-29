module.exports = function(config, gulp, $, path, del, browserSync) {

  return function() {

    function _imageFiles(_imageFileData, _destPath) {
      var _imageFiles = gulp.src(config.paths.develop.images + '/**/*');
      switch(_imageFileData.compress) {
        case true:
          _imageFiles.pipe($.imagemin());
          break;
      }
      _imageFiles.pipe(gulp.dest(_destPath))
        .on('end', browserSync.reload);
      return _imageFiles;

    };

    return {
      develop: function() {
        del.sync([
          path.join(config.paths.temporary.images, '/**/*'),
          String('!').concat(config.paths.temporary.images)
        ]);
        return _imageFiles(config.main.images['develop'], config.paths.temporary.images);
      }
    };

  };

};