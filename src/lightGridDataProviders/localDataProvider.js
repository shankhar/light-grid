﻿function LocalDataProvider(model, filterFilter, orderByFilter, limitToFilter, defaultViewSettings) {

	var viewSettings;
	var viewModel;
	var filteredItemCount;
	var originalModel = model;

	function updateFilters() {
		viewModel = originalModel;

		if (viewSettings.filter) {
			viewModel = filterFilter(viewModel, viewSettings.filter.expression, viewSettings.filter.comparator);
		}

		if (viewSettings.orderBy) {
			viewModel = orderByFilter(viewModel, viewSettings.orderBy.expression, viewSettings.orderBy.reverse);
		}

		filteredItemCount = viewModel.length;

		if (viewSettings.limitTo && viewSettings.limitTo.limit !== 0) {
			if (viewSettings.limitTo.begin) {
				if (viewSettings.limitTo.begin >= filteredItemCount) {
					viewSettings.limitTo.begin = 0;
				}

				viewModel = viewModel.slice(viewSettings.limitTo.begin, viewModel.length);
			}

			viewModel = limitToFilter(viewModel, viewSettings.limitTo.limit);
		}
	}

	this.setModel = function (newModel) {
		originalModel = newModel;
		updateFilters();
	};

	this.getGridModel = function() {
		return viewModel;
	};

	this.getModelItemCount = function () {
		return filteredItemCount;
	};

	this.getCurrentViewSettings = function() {
		return viewSettings;
	};

	this.saveModel = function () {
	};

	this.orderBy = function (expression, reverse) {
		viewSettings.orderBy = {
			expression: expression,
			reverse: reverse
		};

		updateFilters();
	};

	this.limitTo = function (limit, begin) {
		if (limit === undefined || limit === null) {
			viewSettings.limitTo = null;
		} else {
			viewSettings.limitTo = {
				limit: limit,
				begin: begin || 0
			};
		}

		updateFilters();
	};

	this.page = function (pageIndex) {
		if (viewSettings.limitTo && viewSettings.limitTo.limit) {
			viewSettings.limitTo.begin = viewSettings.limitTo.limit * pageIndex;
		}

		updateFilters();
	};

	this.filter = function (expression, comparator) {
		viewSettings.filter = {
			expression: expression,
			comparator: comparator
		};

		updateFilters();
	};

	this.reset = function () {
		viewSettings = angular.copy(defaultViewSettings);
		updateFilters();
	};

	this.reset();
}

angular.module("lightGridDataProviders").provider("lgLocalDataProviderFactory", function () {

	var self = this;

	this.defaultViewSettings = {
		orderBy: null,
		limitTo: null,
		filter: null
	};

	this.$get = function(filterFilter, orderByFilter, limitToFilter) {
		return {
			create: function(localModel) {
				return new LocalDataProvider(localModel, filterFilter, orderByFilter, limitToFilter, self.defaultViewSettings);
			}
		};
	};
});
