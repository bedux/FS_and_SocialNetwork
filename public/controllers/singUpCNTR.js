myApp.controller('singUpCNTR', function($scope,$http,$location) {
   $scope.user={name:"",pwd:""}; 

    
    
    
  $scope.logIn = function(){
      console.log($scope.user);
      $http.post('/login/add',{user:$scope.user.name,pwd:$scope.user.pwd}).
    success(function(data, status, headers, config) {
        if(data.status!="logged"){
                           alert('User arleady exists!');

            
            
            
        }else{
            console.log("asdasdasd");
                $location.path('/user/'+$scope.user.name);      
        
        }
    }).
    error(function(data, status, headers, config) {
        console.log(data);
   });
  }
    
});