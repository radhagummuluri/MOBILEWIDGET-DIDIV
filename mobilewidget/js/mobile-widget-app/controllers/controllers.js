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



//Main controller that loads the list of retailer logos
app.controller("mainController", function($scope, $http){
    
    $scope.retailers = [];
    $scope.slides = [];
    var _scrollinterval = null;
    
    $scope.init = function() 
    {
        $scope.currentSlide = 1;
        $scope.totalSlides = 0;
        $scope.initialLoad = true;
        $scope.autoslide = true;

        $http.jsonp('http://api2.shoplocal.com/retail/5369d0c743bd59c2/2013.1/json/multiretailerpromotions?radius=100&siteid=1553&MultRetPromoSort=1&pageimagewidth=156&citystatezip=60601&callback=JSON_CALLBACK').success(function(data) {
            console.log(data.Results);

            var logosperpage = 6;
            
            angular.forEach(data.Results, function(retailer, index){
                    $scope.retailers.push(retailer);
            });

            for (var i=0; i<$scope.retailers.length; i+=logosperpage) {
                var slide = $scope.retailers.slice(i,i+logosperpage);
                $scope.slides.push(slide);
            }

            $scope.totalSlides = $scope.slides.length;

            if($scope.autoslide)
            {
                autoslide();
            }

        }).error(function(error) {
 
        });
    };

    $scope.$on('$viewContentLoaded', function(){

        var test = "test";

    });

    $scope.openHeroPromotion = function(index, retailerid)
    {
        //win.postMessage('event dispatched','http://localhost');
    }


    var autoslide = function()
    {
        if($scope.initialLoad && $scope.autoslide)
        {
           _scrollinterval =  setInterval(function(){ 
                    if($scope.currentSlide <= $scope.totalSlides)
                    {
                        $scope.currentSlide = $scope.currentSlide +1; 
                        goAutoForward();                         
                    }
                    else
                    {
                        $scope.currentSlide = 1;
                        $scope.myScroll['wrapper'].scrollToPage(0, 0);
                    }

                },2000);
        }
        else
        {
            clearInterval();
        }
    }

    $scope.$parent.myScrollOptions = {
            snap: true,
            momentum: false,
            hScrollbar: false,
            onScrollEnd: function () {
            } 
        };

    // expose refreshiScroll() function for ng-onclick or other meth
    $scope.refreshiScroll = function ()
    {
        $scope.$parent.myScroll['wrapper'].refresh();
    };


    var goAutoForward = function () {
        if($scope.currentSlide <= $scope.totalSlides)
        {
            clearInitialLoad();
            $scope.myScroll['wrapper'].scrollToPage('next', 0);
        }
    };

    var goAutoBack = function () {
        if($scope.currentSlide > 1)
        {
            clearInitialLoad();
            $scope.myScroll['wrapper'].scrollToPage('prev', 0);
        }
    };

    $scope.goForward = function () {
        $scope.autoslide = false;
        clearInterval(_scrollinterval);
        _scrollinterval = null;
        if($scope.currentSlide < $scope.totalSlides)
        {
            clearInitialLoad();
            $scope.currentSlide = $scope.currentSlide +1; 
            $scope.myScroll['wrapper'].scrollToPage('next', 0);
        }
    };

    $scope.goBack = function () {
        $scope.autoslide = false;
        clearInterval(_scrollinterval);
        _scrollinterval = null;
        if($scope.currentSlide > 1)
        {
            $scope.currentSlide = $scope.currentSlide - 1; 
            clearInitialLoad();
            $scope.myScroll['wrapper'].scrollToPage('prev', 0);
        }
    };

    var clearInitialLoad = function(){
            if($scope.initialLoad)
            {
                $scope.initialLoad = false;
            }
    }
});

//Retailer controller that loads promotions based on the retailer.
app.controller('retailerController', function($scope) {
        $scope.message = 'Retailer information goes here.';
});