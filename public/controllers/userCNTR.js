myApp.controller('userCNTR', function($scope,$http,$routeParams ) {
   $scope.data={friends:[],groups:[],name:$routeParams.id}; 

$http.get('/login/friends/'+$routeParams.id).
    success(function(data, status, headers, config) {
         $scope.data.friends = data.friends;
    }).
    error(function(data, status, headers, config) {
         $scope.data.friends = data.friends;
    
   });
    
    
    $http.get('/login/groups/'+$routeParams.id).
    success(function(data, status, headers, config) {
      console.log(data);
                 $scope.data.groups = data.groups;

    }).
    error(function(data, status, headers, config) {
        console.log(data);
   });
 
    
    
    
    
    
  });



    
