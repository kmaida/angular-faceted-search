// http://jsfiddle.net/rzgWr/19/

var myApp = angular.module('myApp',[]);

myApp.factory('Helpers', function() {
	return {
		uniq: function(data, key) {
			var result = [];

			for (var i = 0; i < data.length; i++) {
				var value = data[i][key];

				if (result.indexOf(value) == -1) {
					result.push(value);
				}
			}
			return result;
		},
		contains: function(data, obj) {
			for (var i = 0; i < data.length; i++) {
				if (data[i] === obj) {
					return true;
				}
			}
			return false;
		}
	};
});

myApp.controller('MainCtrl', function($scope, Helpers) {
	$scope.useFacets = {};

	$scope.items = [
		{
			id: 1,
			name: 'Brick 1 x 1',
			type: 'brick',
			color: 'red',
			studs: 1
		},
		{
			id: 2,
			name: 'Brick 3 x 2',
			type: 'brick',
			color: 'green',
			studs: 6
		},
		{
			id: 3,
			name: 'Brick 2 x 2',
			type: 'brick',
			color: 'red',
			studs: 4
		},
		{
			id: 4,
			name: 'Brick 2 x 1',
			type: 'brick',
			color: 'blue',
			studs: 2
		},
		{
			id: 5,
			name: 'Plate 6 x 4',
			type: 'plate',
			color: 'yellow',
			studs: 24
		},
		{
			id: 6,
			name: 'Plate 3 x 2',
			type: 'plate',
			color: 'blue',
			studs: 6
		},
		{
			id: 7,
			name: 'Plate 2 x 2',
			type: 'plate',
			color: 'green',
			studs: 4
		},
		{
			id: 8,
			name: 'Plate 2 x 2',
			type: 'plate',
			color: 'red',
			studs: 4
		},
		{
			id: 9,
			name: 'Tile 2 x 1',
			type: 'tile',
			color: 'yellow',
			studs: 0
		},
		{
			id: 10,
			name: 'Tile 2 x 2',
			type: 'tile',
			color: 'decorated',
			studs: 0
		},
		{
			id: 11,
			name: 'Tile 3 x 2',
			type: 'tile',
			color: 'decorated',
			studs: 0
		},
		{
			id: 12,
			name: 'Tile 2 x 1',
			type: 'tile',
			color: 'yellow',
			studs: 0
		}
	];

// Watch the facets that are selected.
	$scope.$watch(function () {
		return {
			items: $scope.items,
			useFacets: $scope.useFacets
		}
	}, function (value) {
		var selected;

		$scope.count = function (prop, value) {
			return function (el) {
				return el[prop] == value;
			};
		};

	// Facets: collects all values for each facet from items dataset
	// Alternatively, could pre-define the facets we want to use
		$scope.typeFacets = Helpers.uniq($scope.items, 'type');
		$scope.colorFacets = Helpers.uniq($scope.items, 'color');
		$scope.studsFacets = Helpers.uniq($scope.items, 'studs');

		$scope.activeFacets = [];

		// Sort the available facets.
		// http://stackoverflow.com/a/18261306
		$scope.orderByValue = function(value) {
			return value;
		};

		// Reset all previously-selected facets.
		$scope.clearAllFacets = function() {
			$scope.activeFacets = [];
			$scope.useFacets = {};
		};

		// Clear search query.
		$scope.clearQuery = function() {
			$scope.query = null;
		};

		// Clear the clicked facet.
		$scope.clearFacet = function(facet) {
			// Find the index of the facet so we can remove it from the active facets.
			var i = $scope.activeFacets.indexOf(facet);

			// If it exists, remove the facet from the list of active facets.
			if (i != -1) {
				$scope.activeFacets.splice(i, 1);

				// Find the corresponding facet in the 
				// filter models and turn it off.
				for (var k in $scope.useFacets) {
					if ($scope.useFacets[k]) {
						$scope.useFacets[k][facet] = false;
					}
				}
			}
		};

		// Clear any active facets when a search query is entered
		$scope.$watch('query', function (newValue, oldValue) {
			if ((newValue !== oldValue) && $scope.activeFacets.length) {
				$scope.clearAllFacets();
			}
		});

	// Filter items
		var filterItems = function(filterAfterArray, facetName, newArray) {
			// Iterate over previously filtered items.
			for (var n in filterAfterArray) {
				var itemObj = filterAfterArray[n],
					useFacet = $scope.useFacets[facetName];

				// Iterate over new facet.
				for (var facet in useFacet) {
					if (useFacet[facet]) {
						selected = true;

						// Push facet to list of active facets if doesn't already exist.
						if (!Helpers.contains($scope.activeFacets, facet)) {
							$scope.activeFacets.push(facet);
						}

						// Push item from previous filter to new array
						// if matches new facet and does not already exist.
						// Using == instead of === enables matching integers to strings
						if (itemObj[facetName] == facet && !Helpers.contains(newArray, itemObj)) {
							newArray.push(itemObj);
							break;
						}
					}
				}
			}
		};

	// Filter by Type facets
		var filterAfterType = [];
		selected = false;

		filterItems($scope.items, 'type', filterAfterType);

		if (!selected) {
			filterAfterType = $scope.items;
		}

	// Filter by Color facets
		var filterAfterColor = [];
		selected = false;

		filterItems(filterAfterType, 'color', filterAfterColor);

		if (!selected) {
			filterAfterColor = filterAfterType;
		}

	// Filter by Studs facets
		var filterAfterStuds = [];
		selected = false;

		filterItems(filterAfterColor, 'studs', filterAfterStuds);

		if (!selected) {
			filterAfterStuds = filterAfterColor;
		}

	// Filtered list of items
		$scope.filteredItems = filterAfterStuds;

	}, true);

	$scope.$watch('filteredItems', function (newValue) {
		if (angular.isArray(newValue)) {
			console.log('do something when filteredItems updated', newValue.length);
		}
	}, true);
});