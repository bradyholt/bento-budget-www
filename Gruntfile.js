module.exports = function(grunt) {
    
    grunt.initConfig({
        aws: grunt.file.readJSON("aws.json"),
        pkg: grunt.file.readJSON('package.json'),

        clean: {
		    all: ['dist/*']
		},
        assemble: {
            options: {
                layout: "src/layouts/default.hbs",
                partials: "src/partials/*.hbs",
                flatten: true,
                assets: 'dist' 
            },
            main: { files: { 'dist/': ['src/pages/*.hbs'] } },
            help: { files: { 'dist/help/index.html': ['src/pages/help/*.hbs'] } },
            privacyPolicy: { files: { 'dist/privacy-policy/index.html': ['src/pages/privacy-policy/*.hbs'] } }
        },
        uglify: {
            scripts: {
              files: {
                'dist/scripts/application.js': [
                    'src/scripts/jquery-1.10.2.min.js',
                    'src/scripts/bootstrap.min.js',
                    'src/scripts/jquery.cycle2.min.js',
                    'src/scripts/script.js'
                ]
              }
            }
        },
        concat: {
          css: {
            src: ['src/styles/bootstrap.css', 'src/styles/styles.css'],
            dest: 'dist/styles/application.css'
          }
        },
        copy: {
          images: {
            files: [ { expand: true, cwd: 'src/images', src: ['*.*'], dest: 'dist/images/' } ]
          }
        },
        cssmin: {
          minify: {
            expand: true,
            cwd: 'dist/styles/',
            src: ['*.css'],
            dest: 'dist/styles/'
          }
        },
		s3: {
          options: {
            accessKeyId: "<%= aws.accessKeyId %>",
            secretAccessKey: "<%= aws.secretAccessKey %>",
            bucket: "<%= aws.bucket %>"
          },
          build: {
            cwd: "dist",
            src: "**"
          }
        },
        watch: {
            options: { livereload: true },
            hbs: {
                files: ['src/**/*.hbs'],
                tasks: ['assemble']
            },
            js: {
                files: ['src/scripts/*'],
                tasks: ['uglify']
            },
            css: {
                files: ['src/styles/*'],
                tasks: ['concat']
            }
        },
    });

    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble');

    grunt.registerTask('build', ['clean', 'assemble', 'uglify', 'concat', 'copy']);
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('prod', ['build', 'cssmin', 's3']);
    grunt.registerTask('default', ['dev']);
};
