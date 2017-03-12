let browserifyTasks = require('../../tasks/browserify');
let gulp = require('gulp');

gulp.task('default', browserifyTasks.createBuildTask({
	baseDirectory: './scripts/',
	sourceScriptPath: './source/main.js',
	targetScriptPath: './target/main.js',
	targetScriptSourceMapPath: './target/main.map'
}));