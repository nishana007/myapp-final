TestApp = angular.module('TestApp', ['ngRoute','TestApp.controllers', 'ui.bootstrap']);

TestApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/homepage.htm",
        controller:"homeCtrl"
    
    })
    .when("/addform", {
        templateUrl : "views/addform.htm",
        controller: 'myCtrl'
        
    })
    .when("/table/:box", {
        templateUrl : "views/tableview.htm",
        controller: 'testController'
    })
    .otherwise({
        redirectTo:'/'
    });
});

TestApp.controller('homeCtrl', function($scope,$http,$location) {
    
  $scope.onsubmit=function(box)
  {
    console.log('clicked submit');
    

    if(!angular.isDefined($scope.searchbox) || $scope.searchbox=== '') 
    {
      alert( 'Please enter a valid value');
      return;
    }
    $http.get("http://localhost:6200/blah/"+box).then(function(response){
        console.log(response.data);
        if(response.data.length>0)
        {
            $location.path('/table/' + box);
            
        }
        else{
            $location.path('/');
            alert(" Sorry ! Your query didn't match an of our search results");
            }
  },function(response) {
    console.log(response);
    if(response.status=== -1 && response.statusText==="")
    {
        alert("Error:Backend is not connected.Please try later");

    }
   
  });
    
  }
   
  });

  
   

  TestApp.controller('ModalContentCtrl', function($scope, $uibModalInstance) {

    $scope.ok = function(){
      $uibModalInstance.close("Ok");
    }
     
    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    } 
    
  });



angular.module('TestApp.controllers', ['ui.bootstrap']).controller('testController',  ['$scope', '$http', '$uibModal', '$routeParams','$location' ,function($scope, $http, $uibModal,$routeParams,$location) {
    $scope.loading = false;
    var modalInstance = null;
    var id=($routeParams.box);
   
    $scope.getData = function() {
        $scope.loading = true;
        $http.get("http://localhost:6200/blah/"+id)
        .then(function(response){
            $scope.names = response.data;
            $scope.loading = false;
        });
    }
    
    
    $scope.viewRecord = function(id){
        if(id > 0) {
           $http.get("http://localhost:6200/blah/"+id)
             .then(function(response){
                  modalInstance = $uibModal.open({
                   animation: false,
                   templateUrl: 'views/view_record.html',
                   controller: 'empViewCtrl',
                   scope: $scope,
                   size: 'lg',
                   resolve: {
                       record: function () {
                           return response.data;
                       }
                   }
                });
             });
          
        }
            

 }
               

    
    $scope.editRecord = function(id){
           if(id > 0) {
              $http.get("http://localhost:6200/blah/"+id)
                .then(function(response){
                    modalInstance = $uibModal.open({
                      animation: false,
                      templateUrl: 'views/edit.html',
                      controller: 'updateEmpCtrl',
                      scope: $scope,
                      size: 'lg',
                      resolve: {
                          record: function () {
                              return response.data;
                          }
                      }
                   });
                });
           }

    }

    $scope.cancelModal = function(){
     modalInstance.dismiss('cancel');
    }
    
    
    
    $scope.updateRecord = function(params) {
        $http.put("http://localhost:6200/blah/"+params.bugid, params)
            .then(function(response){
              alert(response.data);
              $scope.getData();
            });
    }
    $scope.deletRecord = function(id) {
        if (confirm('Are you sure you want to delete this?')) {
             $http.delete("http://localhost:6200/blah/"+id)
            .then(function(response){
                alert(response.data);
            });
        }
        
    }
    $scope.getData();




}]);


TestApp.controller('empViewCtrl',  ['$scope', '$http', 'record', function($scope, $http,record) {
    $scope.data = {};
    console.log(record);
    function init(){
        
        angular.forEach(record, function (value, key) { 
            $scope.data=value 
        });  
        console.log($scope.data);
        
        
    }
    init();
    
}]);


 



TestApp.controller('updateEmpCtrl',  ['$scope', '$http', '$filter','record', function($scope, $http, $filter, record) {
    $scope.data = {};
    function init(){
        angular.forEach(record, function (value, key) { 
            console.log(value);
            $scope.data.bugid=value.bugid;
            $scope.data.assign=value.assignee;
            $scope.data.report=value.reporter;
            $scope.data.summary=value.summary;
            $scope.data.product=value.product;
            $scope.data.comp=value.component;
            $scope.data.os=value.os;
            $scope.data.hard=value.hardware;
            $scope.data.version=value.version;
            $scope.data.prior=value.priority;
            $scope.data.severity=value.severity;
        
            $scope.data.key=value.keywords;
            $scope.data.changed = new Date(value.changed);
            $scope.data.opened = new Date(value.opened);
            $scope.data.desc=value.description;

        });  
        
        console.log($scope.data.severity);
        console.log($scope.data.os);
        
    }
    $scope.updateEmp = function () {
        
        if(!angular.isDefined($scope.data.assign) || $scope.data.assign=== '') {
                alert('Enter a valid mail id');
                return;
            }
            else if(!angular.isDefined($scope.data.report) || $scope.data.report === '') {
                alert('Enter a valid mail id');
                return;
            }
            else if(!angular.isDefined($scope.data.summary) || $scope.data.summary === '') {
                alert('Summary field is empty');
                return;
            }
            else if(!angular.isDefined($scope.data.product) || $scope.data.product === '') {
                alert('Product field is empty');
                return;
            }
            else if(!angular.isDefined($scope.data.comp) || $scope.data.comp === '') {
                alert('Component field is empty');
                return;
            }
            else if(!angular.isDefined($scope.data.version) || $scope.data.version === '') {
                alert('Version field is empty');
                return;
            }
            else if(!angular.isDefined($scope.data.desc) || $scope.data.desc === '') {
                alert('Description field is empty');
                return;
            }

        $scope.data.changed= new Date($scope.data.changed);
        $scope.data.changed=$filter('date')($scope.data.changed,"dd-MM-yyyy HH:mm:ss");
        $scope.data.opened=new Date($scope.data.opened);
        $scope.data.opened=$filter('date')($scope.data.opened,"dd-MM-yyyy HH:mm:ss");
            
        $scope.updateRecord($scope.data);
        $scope.cancelModal();
    }
    init();
    
}]);




TestApp.controller('myCtrl', function($scope,$http,$filter) {

    $scope.data = {};
    var dup={};
    $scope.submit= function(){
    console.log('clicked submit');


    
     if(!angular.isDefined($scope.data.os) || $scope.data.os=== '') {
        alert( 'Please choose atleast one option in the OS field');
        return;
    }
    else if(!angular.isDefined($scope.data.hard) || $scope.data.hard=== '') {
        alert( 'Please choose atleast one option in the hardware field');
        return;
    }

     else if(!angular.isDefined($scope.data.prior) || $scope.data.prior=== '') {
        alert('Please Select Your Priority Category');
        return;
    }
    else if(!angular.isDefined($scope.data.severity) || $scope.data.severity=== '') {
        alert('Please Select Severity Category');
        return;
    }
   
    
    var changed =$filter('date')($scope.data.changed,"dd-MM-yyyy HH:mm:ss");
    var opened =$filter('date')($scope.data.opened,"dd-MM-yyyy HH:mm:ss");

    dup = {
        bug:$scope.data.bug,
        assign:$scope.data.assign,
        report:$scope.data.report,
        summary:$scope.data.summary,
        product:$scope.data.product,
        comp:$scope.data.comp,
        os:$scope.data.os,
        hard:$scope.data.hard,
        version:$scope.data.version,
        prior:$scope.data.prior,
        severity:$scope.data.severity,
        key:$scope.data.key,
        changed:changed,
        opened:opened,
        desc:$scope.data.desc
       };

       console.log(dup);

       $http({
        url: 'http://localhost:6200/blah',
        method: 'POST',
        data: dup
        }).then(function success(httpResponse) {
         alert(httpResponse.data);
        },
         function error (httpResponse) {
                 if(httpResponse.status=== -1 && httpResponse.statusText==="")
                 {
                     alert("Server is not connected.Please try later");
                 }
                 else
                 {
                     alert(httpResponse);
                 }
               }
       );


        }
    });
     
   

    
	
    