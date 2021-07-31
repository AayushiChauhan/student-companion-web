'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            test: {
                files: ['**/*.js'],
                tasks: ['mochaTest'],
                options: {
                    spawn: true
                }
            }
        },
        markdox: {

            sourceFiles: {
                src: 'lib/*.js',
                dest: 'docs/README.md'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-markdox');

    grunt.registerTask('doc', 'markdox');
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('watch-test', 'watch');


};