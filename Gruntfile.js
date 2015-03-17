﻿/* global module*/

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator: "\n\n;",
				banner: "(function (window, angular, $, undefined) {\n\n",
				footer: "\n\n}(window, window.angular, window.jQuery));"
			},
			dist: {
				src: [
					"src/moduleDefinition.js",
					"src/directives/*.js",
					"src/services/*.js",
					"src/cell-elements/*.js",
					"src/column-templates/*.js",
					"src/data-providers/*.js"
				],
				dest: "dist/light-grid-<%= pkg.version %>.js",
			}
		},
		uglify: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					"dist/light-grid-<%= pkg.version %>.min.js": ["dist/light-grid-<%= pkg.version %>.js"]
				}
			},
		},
		karma: {
			unit: {
				configFile: "config/karma.conf.js"
			}
		},
		watch: {
			files: ["src/**/*.js"],
			tasks: ["build", "karma"]
		},
		jsdoc : {
			dist : {
				src: ["src/*.js"], 
				options: {
					destination: "doc"
				}
			}
		},
		ngAnnotate: {
			bundle: {
				src: ["dist/light-grid-<%= pkg.version %>.js"],
				expand: true,
				ext: '.js',
				extDot: 'last'
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("grunt-jsdoc");
	grunt.loadNpmTasks("grunt-ng-annotate");
	
	grunt.registerTask("build", ["concat", "ngAnnotate", "uglify"]);
	grunt.registerTask("default", ["build", "karma"]);
};