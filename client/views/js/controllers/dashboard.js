angular
    .module('myApp')
    .controller('dashboardCtl', ['$scope', '$state', '$rootScope', '$http','Customer', 'Blog','Forum',
        function ($scope, $state, $rootScope, $http , Customer , Blog , Forum) { 
            $scope.customerCnt = 0;  $scope.blogCnt = 0; $scope.forumCnt = 0;
            $scope.forumAndBlogData = [];
            $scope.getDashboard = () =>{
                Customer.count().$promise.then((res)=>{
                    $scope.customerCnt = res.count;
                })
                Blog.count().$promise.then((res)=>{
                    $scope.blogCnt = res.count;
                })
                Forum.count().$promise.then((res)=>{
                    $scope.forumCnt = res.count;
                })
                Blog.find().$promise.then((res)=>{
                    Forum.find().$promise.then((fres)=>{ 
                        $scope.forumAndBlogData = [...fres , ...res];
                         console.log(JSON.stringify($scope.forumAndBlogData))
                    })
                })

            }
            $scope.getDashboard();
        }]);