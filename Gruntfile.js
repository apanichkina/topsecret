
module.exports = function(grunt) {
  
grunt.initConfig({

    shell: {
        options: {
            stdout: true,
            stderr: true
        },
        server: {
            command: 'java -jar 4pg.jar'
        }
    },

    fest: {
        templates: {
            files: [{
                expand: true, // Флаг динамического развертывания
                cwd: 'templates', /* исходная директория */
                src: '*.xml', /* имена шаблонов */
                dest: 'public_html/js/tmpl' /* результирующая директория */
            }],
            options: {
                template: function (data) {
                    return grunt.template.process(
                        // 'var <%= name %>Tmpl = <%= contents %> ;',
                        'define(function () { return <%= contents %> ; });',
                        {data: data}
                    );
                }
            }
        }
    },

    sass: {
        style: "compressed",
        dist: {
            files: [{
                expand: true,
                cwd: 'public_html/css/scss',
                src: '*.scss',
                dest: 'public_html/css',
                ext: '.css'
            }]
        }
    },

    watch: {
        fest: { /* Цель */
            files: ['templates/*.xml'], /* следим за шаблонами */
            tasks: ['fest'], /* перекомпилировать */
            options: {
                interrupt: true,
                atBegin: true /* запустить задачу при старте */
            }
        },

        sass: {
            files: ['public_html/css/scss/*.scss'],
            tasks: ['sass'],
            options: {
                atBegin: true,
                interrupt: true
            }
        },

        server: { /* Цель */
            files: [
                'public_html/js/**/*.js', /* следим за статикой */
                'public_html/css/**/*.css'
            ],
            options: {
                interrupt: true,
                livereload: true /* автоматическая перезагрузка */
            }
        }
    },
    concurrent: {
        target: ['watch', 'shell'],
        options: {
            logConcurrentOutput: true /* Вывод процесса логов*/
        }
    },

    requirejs: {
        build: { /* Подзадача */
            options: {
                almond: true,
                baseUrl: "public_html/js",
                mainConfigFile: "public_html/js/main.js",
                name: "main",
                optimize: "none",
                out: "public_html/js/build/main.js"
            }
        }
    },
    concat: {
        build: { /* Подзадача */
            separator: ';\n',
            src: [
                'public_html/js/lib/almond.js',
                'public_html/js/build/main.js'
            ],
            dest: 'public_html/js/build.js'
        }
    },

    uglify: {
        build: { /* Подзадача */
            files: {
                'public_html/js/build.min.js':
                    ['public_html/js/build.js']
            }
        }
    },

});

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('build', ['fest', 'requirejs', 'concat', 'uglify']);

};
