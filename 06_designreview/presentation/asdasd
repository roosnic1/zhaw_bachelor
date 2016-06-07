module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            frontend: {
                files: ['app/styles/scss/**/*.scss','app/scripts/**/*.js','app/**/*.html'],
                tasks: ['buildFrontend']
            },
            backend: {
                files: ['server/**/*.js'],
                tasks: ['buildBackend']
            },
            app: {
                options: {
                    livereload: true
                },
                files: ['dist/app/**/*.*']
            },
            server: {
                files: ['dist/**/*.*'],
                tasks: ['express:dev'],
                options: {
                    nospawn: true,
                    atBegin: true
                }
            }
        },
        sass: {
            dev: {
                files: {
                    'dist/app/main.css': 'app/styles/scss/main.scss'
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
                    'dist/app/app.js': "app/scripts/main.js"
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    "dist/server.js": "server/server.js",
                    "dist/config.js": "server/config.js"
                }
            }
        },
        copy: {
            html: {
                files: [
                    {expand: true, src: 'app/index.html', dest: 'dist/app/', flatten: true }
                ]
            }
        },
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'dist/server.js'
                }
            }
        }
    });

    grunt.registerTask('buildFrontend', ['copy:html','browserify','sass']);
    grunt.registerTask('buildBackend',['babel:dist']);

    grunt.registerTask('default', ['buildFrontend','buildBackend','express:dev','watch']);

};