app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'views/retailerlist.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/retailer', {
                templateUrl : 'views/retailer.html',
                controller  : 'retailerController'
            })

            // route for the about page
            .when('/retailer:retailerId', {
                templateUrl : 'views/retailer.html',
                controller  : 'retailerController'
            })
    });

//Main controller that loads the list of retetailer logos
app.controller("mainController", function($scope, $http){
    $scope.apiKey = "7597bd6e733aa5f30ccc8f1d52740624";
    $scope.results = [];
    $scope.init = function() {
        var today = new Date();
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
            console.log(data);
            angular.forEach(data, function(value, index){

                var date = value.date;

                angular.forEach(value.episodes, function(tvshow, index){

                    tvshow.date = date; //Attach the full date to each episode
                    $scope.results.push(tvshow);
                });
            });

        }).error(function(error) {
 
        });
    };
});

//Retailer controller that loads promotions based on the retailer.
app.controller('retailerController', function($scope) {
        $scope.message = 'Retailer information goes here.';
});