let browserifyTasks = require('../../tasks/browserify');
let gulp = require('gulp');

gulp.task('default', browserifyTasks.createBuildTask());