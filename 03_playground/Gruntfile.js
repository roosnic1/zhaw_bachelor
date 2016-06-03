module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            scss: {
                files: ['app/styles/scss/**/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['app/scripts/**/*.js'],
                tasks: ['browserify']
            },
            html: {
                files: ['app/**/*.html'],
                taks:  ['copy:html']
            }
        },
        sass: {
            dev: {
                files: {
                    'dist/main.css': 'app/styles/scss/main.scss'
                }
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [["babelify", { presets: ['es2015'] }]],
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    'dist/app.js': "app/scripts/main.js"
                }
            }
        },
        copy: {
            html: {
                files: [
                    {expand: true, src: 'app/index.html', dest: 'dist/', flatten: true }
                ]
            }
        },
        browserSync: {
            bsFiles: {
                src : [
                    'app/scripts/**/*.js',
                    'app/styles/css/*.css',
                    'app/**/*.html'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: "./dist/"
                }
            }
        }
    });

    grunt.registerTask('default', ['copy:html','browserify','sass','browserSync','watch']);

};