﻿/**
 * Defines a column template.
 * Attributes:
 *  - title - {String} (interpolated) title of the column (used to render a header if header template is not specified)
 *  - visible - {Boolean} specifies if a column should be rendered
 */
angular.module("lightGrid").directive("lgColumn", function () {
	"use strict";

	return {
		scope: {
			title: "=",
			visible: "=?"
		},
		restrict: "EA",
		require: "^lightGrid",
		transclude: true,
		controller: function ($scope) {
			$scope.views = {};
			$scope.viewCount = 0;
			$scope.headerTemplate = null;
			$scope.footerTemplate = null;

			/**
			 * Registers a view in a column.
			 * @param  {String} name - Name of the view (optional, defaults to '*')
			 * @param  {Function} viewLinker - Precompiled view template (as a linking function)
			 */
			this.registerView = function (name, viewLinker) {
				name = name || "*";

				// name argument may contain a comma-separated list of view names
				// we need to register the linking function in all of them
				var separatedNames = name.split(",");

				for (var i = 0; i < separatedNames.length; ++i) {
					var separatedName = separatedNames[i].trim();
					if (separatedName === "") {
						continue;
					}

					$scope.views[separatedName] = viewLinker;
					$scope.viewCount += 1;
				}
			};

			/**
			 * Registers a header template in a column.
			 * @param  {Function} viewLinker - Precompiled view template (as a linking function)
			 */
			this.registerHeaderTemplate = function (viewLinker) {
				$scope.headerTemplate = viewLinker;
			};

			/**
			 * Registers a footer template in a column.
			 * @param  {Function} viewLinker - Precompiled view template (as a linking function)
			 */
			this.registerFooterTemplate = function (viewLinker) {
				$scope.footerTemplate = viewLinker;
			};
		},
		controllerAs: "templateColumnController",
		link: function(scope, instanceElement, instanceAttrs, gridController, linker) {

			if (!instanceAttrs.visible) {
				scope.visible = true;
			}

			scope.$watch("visible", function (newValue, oldValue) {
				if (newValue !== oldValue) {
					gridController.updateColumn(scope.$id, {
						visible: !!scope.visible
					});
				}
			});

			linker(scope, function (clone) {
				// transcluded content is added to the element so that lgColumnController can be
				// required by lgView directives
				instanceElement.append(clone);
			});

			if (scope.viewCount === 0) {
				// simple mode - if no views are defined, the content of the directive is treated
				// as the default view
				scope.templateColumnController.registerView("*", linker);
			}

			gridController.defineColumn(scope.$id, {
				title: scope.title,
				views: scope.views,
				headerTemplate: scope.headerTemplate,
				footerTemplate: scope.footerTemplate,
				attributes: instanceAttrs,
				visible: !!scope.visible
			});

			// this element should not be rendered
			instanceElement.remove();
		}
	};
});
