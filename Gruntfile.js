
module.exports = function(grunt) {
  
grunt.initConfig({  

concat: {  
options: {
	separator: ';' 
},  
foo: { 
	options: { },
	src: ['js/first.js', 'js/second.js'],
  	dest: 'js/foo.js'
 },  
bar: { /* Цель bar */ } 
},

shell: {
	server: { /* Подзадача */
    		command: 'java -cp L1.2-1.0-jar-with-dependencies.jar main.Main 8080'
	}
},
/* разобрать fest */
fest: {
    templates: {
        files: [{
            expand: true,
            cwd: 'templates',
            src: '*.xml',
            dest: 'public_html/js/tmpl'
        }],
        options: {
            template: function (data) {
                return grunt.template.process(
                    'var <%= name %>Tmpl = <%= contents %> ;',
                    {data: data}
                );
            }
        }
    }
},
watch: {
	fest: { /* Цель */
    	files: ['templates/*.xml'], /* следим за шаблонами */
    	tasks: ['fest'], /* перекомпилировать */
    	options: {
        	atBegin: true /* запустить задачу при старте */
    	}
	},
	server: { /* Цель */
    	files: ['public_html/js/**/*.js'], /* следим за JS */
    	options: {
        	livereload: true /* автоматическая перезагрузка */
    	}
	}
},
concurrent: {
    target: ['watch', 'shell'],
    options: {
        logConcurrentOutput: true, /* Вывод процесса */
    }
}, 
any_other_name: 'hello' /* Любое произвольное свойство */
});
// Загрузка плагинов, на примере "concat».
grunt.loadNpmTasks('grunt-contrib-concat');

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-fest');
// Определение задач, default должен быть всегда.
grunt.registerTask('default', ['concurrent']);

};
