var myApp = angular.module('myApp',["ngRoute"]);

myApp.config( function($routeProvider) {
    $routeProvider.
      
    when('/logIn', {
        templateUrl: 'module/login.html',
        //controller: 'PhoneListCtrl'
       controller: 'logInCNTR'

      }). 
     when('/singUp', {
        templateUrl: 'module/singUp.html',
        //controller: 'PhoneListCtrl'
       controller: 'singUpCNTR'

      }). 
        when('/user/:id', {
        templateUrl: 'module/user.html',
        //controller: 'PhoneListCtrl'
       controller: 'logInCNTR'

      }).
        otherwise({
        redirectTo: '/logIn'
      });
  });


