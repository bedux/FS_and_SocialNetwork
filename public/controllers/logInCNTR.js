
myApp.controller('logInCNTR', function($scope,$http,$location) {
   $scope.user={name:"",pwd:""}; 

    
    
    
  $scope.logIn = function(){
      console.log($scope.user);
      $http.post('/login',{user:$scope.user.name,pwd:$scope.user.pwd}).
    success(function(data, status, headers, config) {
          console.log(data);
        if(data.status!="logged"){
               
            
           // $scope.status="Error Invalid User Or Passsword";

            alert('Password or User wrong!');
            
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


