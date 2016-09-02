
module.exports = function(grunt) {
  
grunt.initConfig({  


shell: {
    options: {
        stdout: true,
        stderr: true
    },
	server: {
        command: 'java -cp L1.2-1.0-jar-with-dependencies.jar main.Main '+ PORT
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
watch: {
	fest: { /* Цель */
    	files: ['templates/*.xml'], /* следим за шаблонами */
    	tasks: ['fest'], /* перекомпилировать */
    	options: {
            interrupt: true,
        	atBegin: true /* запустить задачу при старте */
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
any_other_name: 'hello' /* Любое произвольное свойство */
});

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-concurrent');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-fest');

grunt.registerTask('default', ['concurrent']);

};
