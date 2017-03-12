let defaults = require('./helpers/defaults');

// done, watch, sourceFile, targetFile, targetSourceMapFile
let regenerateScripts = function (customOptions) {
		let options = defaults({
			done: function(){
					// noop
			},
			watch: false,
			sourceFile: 'main.source.js',
			targetFile: 'main.target.js',
			separateSourceMap: true,
			targetSourceMapFile: null,
			baseDirectory: './'
		}, customOptions);

		// uglifyify and envify - might want to use these packages for maximum compression

		let browserify = require('browserify');
		let babelify = require('babelify');








    let browserifyInstance;
    let bundle = function (done) {
        let stream;
        let output;
        let swallowError = require('./helpers/swallowError');
        let fs = require('fs');

        console.log(`Regenerating ${options.targetFile} from ${options.sourceFile}`);

        output = fs.createWriteStream(options.targetFile);

        stream = browserifyInstance
            .bundle()
            .on('error', swallowError);



        if(options.separateSourceMap === true){
        	let exorcist = require('exorcist');
        	let targetSourceMapFile;

        	if(options.targetSourceMapFile === null){
        			targetSourceMapFile = `${options.targetFile}.map`;
        	}else{
        			targetSourceMapFile = options.targetSourceMapFile;
        	}

	        stream = stream
	            .pipe(exorcist(targetSourceMapFile));
        }

        stream
            .pipe(output)
            .on('close', function () {
		      			console.log('scripts regenerated');

			      		if(typeof done !== 'undefined'){
			      			done();
			      		}
		      	});
    };

    if (options.watch == true) {
    		let watchify = require('watchify');

    		// if we're watching files, some more values need 
    		// to be configured for Watchify to work correctly
        browserifyInstance = browserify({
            debug: true,
            cache: {},
            packageCache: {},
            basedir: options.baseDirectory,
            plugin: [watchify]
        });

        browserifyInstance.add(options.sourceFile);
    		browserifyInstance.transform(babelify);

    		// Create the target bundle again whenever any file in the require hierarchy changes.
    		browserifyInstance.on('update', function(){
	        // When watching source for changes, call done() after the initial build,
	    		// so the behavior is similar at the beginning either when we're watching
	    		// files or not.
    			bundle();
    		});

        // Have to bundle when watching, because watchify needs to start tracking files.
        // When serving files, this means JavaScript will be generated twice, during build and serve tasks.
        bundle(options.done);
    } else {
        browserifyInstance = browserify({
            debug: true,
            basedir: options.baseDirectory
        });

        browserifyInstance.add(options.sourceFile);
    		browserifyInstance.transform(babelify);

    		bundle(options.done);
    }
};

let createBuildTask = function(customOptions){
	let options = defaults({
		baseDirectory: './',
		sourceScriptPath: 'main.source.js',
		targetScriptPath: 'main.target.js',
		separateSourceMap: true,
		targetScriptSourceMapPath: null
	}, customOptions);

	return function(done){

		regenerateScripts({
			done: done,
			watch: false,
			sourceFile: options.sourceScriptPath,
			targetFile: options.targetScriptPath,
			separateSourceMap: options.separateSourceMap,
			targetSourceMapFile: options.targetScriptSourceMapPath
		});
	};
};

let createBuildAndWatchTask = function(customOptions){
	let options = defaults({
		baseDirectory: './',
		sourceScriptPath: 'main.source.js',
		targetScriptPath: 'main.target.js',
		separateSourceMap: true,
		targetScriptSourceMapPath: null,

		scriptsDirectoryGlob: null
	}, customOptions);

	console.info(`scriptsDirectoryGlob is not used in this implementation of JavaScript watcher. 
		Instead, the file hierarchy starting at sourceScriptPath is analyzed and watched.`);

	return function(done){

		regenerateScripts({
			done: done,
			watch: true,
			sourceFile: options.sourceScriptPath,
			targetFile: options.targetScriptPath,
			separateSourceMap: options.separateSourceMap,
			targetSourceMapFile: options.targetScriptSourceMapPath,
			baseDirectory: options.baseDirectory
		});
	};
};

module.exports = {
	createBuildTask: createBuildTask,
	createBuildAndWatchTask: createBuildAndWatchTask
}