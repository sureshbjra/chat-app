angular
    .module('myApp')
    .controller('menuCtl', ['$scope', '$state', '$rootScope', '$http',
        function ($scope, $state, $rootScope, $http) { 
            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.logout = () =>{
                localStorage.removeItem("userSession");
            }
        }])