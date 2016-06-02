module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            files: ['app/styles/scss/**/*.scss'],
            tasks: ['sass']
        },
        sass: {
            dev: {
                files: {
                    'app/styles/css/main.css': 'app/styles/scss/main.scss'
                }
            }
        },
        browserSync: {
            bsFiles: {
                src : [
                    'app/scripts/**/*.js',
                    'app/styles/css/*.css'
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: "./app/"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('default', ['sass','browserSync','watch']);

};