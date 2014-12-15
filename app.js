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
	// Alternately, we could pre-define the facets we want to use
		var facetGroupNames = ['type', 'color', 'studs'];

		$scope.facetGroups = [];

		for (var i = 0; i < facetGroupNames.length; i++) {
			var facetGroupObj = {
					name: facetGroupNames[i],
					facets: Helpers.uniq($scope.items, facetGroupNames[i])
				};

			$scope.facetGroups.push(facetGroupObj);
		}

		console.log($scope.facetGroups);

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

	// Clear any active facets when a search query is entered (or cleared).
	// Add newValue && (!!oldValue === false) to if statement to allow search query to be changed and preserve facets.
		$scope.$watch('query', function (newValue, oldValue) {
			if ((newValue !== oldValue) && $scope.activeFacets.length) {
				$scope.clearAllFacets();
			}
		});

	// Facet results prototype.
		function FacetResults(facetName) {
			this.facetName = facetName;
		}

		FacetResults.prototype.filterItems = function(filterAfterArray) {
			$scope['filterAfter_' + this.facetName] = [];
			selected = false;

			// Iterate over previously filtered items.
			for (var n in filterAfterArray) {
				var itemObj = filterAfterArray[n],
					useFacet = $scope.useFacets[this.facetName];

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
						if (itemObj[this.facetName] == facet && !Helpers.contains($scope['filterAfter_' + this.facetName], itemObj)) {
							$scope['filterAfter_' + this.facetName].push(itemObj);
							break;
						}
					}
				}
			}

			if (!selected) {
				$scope['filterAfter_' + this.facetName] = filterAfterArray;
			}
		}

		// New each set of facet results.
		var FilterByType = new FacetResults('type'),
			FilterByColor = new FacetResults('color'),
			FilterByStuds = new FacetResults('studs');

		// Filter each facet set.
		FilterByType.filterItems($scope.items);
		FilterByColor.filterItems($scope.filterAfter_type);
		FilterByStuds.filterItems($scope.filterAfter_color);

	// Return the final filtered list of items.
		$scope.filteredItems = $scope.filterAfter_studs;

	}, true);

	$scope.$watch('filteredItems', function (newValue) {
		if (angular.isArray(newValue)) {
			console.log('do something when filteredItems updated', newValue.length);
		}
	}, true);
});