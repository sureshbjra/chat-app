angular
    .module('myApp')
    .controller('manageContactUsCtl', ['$scope', '$state', '$rootScope', '$http', 'Contactus' ,
        function ($scope, $state, $rootScope, $http , Contactus) { 
            
            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.getContacts = () =>{
                Contactus.find({ filter : { include : [{ relation : "feedBackCategory" }, { relation : "customer" }] } }).$promise.then((res)=>{
                    $scope.contactusList = res;
                })
            }
            $scope.getContacts();

            $scope.popUpForDelete = (id) => {
                if (id) {
                    localStorage.removeItem("contactus_delete_id");
                    localStorage.setItem("contactus_delete_id", JSON.stringify({ id }));
                    $('#modalDeleteConfirm').modal({ backdrop: 'static', keyboard: false });
                } else toastMsg(false, "Please try again!");
            }

            $scope.confirmDelete = () =>{
                let data = JSON.parse(localStorage.getItem("contactus_delete_id"));
                if (data && data.id) {
                    Contactus.deleteById({ id: data.id }).$promise.then((res) => {
                        $scope.getContacts();
                        toastMsg(true, "Successfully deleted!");
                        $('#modalDeleteConfirm').modal('hide');
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                        $('#modalDeleteConfirm').modal('hide');
                    });
                } else toastMsg(false, "Please try again!");
            }
        }]);
