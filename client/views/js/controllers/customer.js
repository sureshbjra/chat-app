angular
    .module('myApp')
    .controller('createCustomerCtl', ['$scope', '$state', '$rootScope', '$http', 'Customer',
        function ($scope, $state, $rootScope, $http, Customer) {
            $scope.create = () => {
                let email, isOlder, male, female, username, password;
                if ($("#email").val()) email = $("#email").val();
                else {
                    isTrue = false;
                    $("#email_err").text('Email is required!');
                }
                if ($("#email").val()) email = $("#email").val();
                else {
                    isTrue = false;
                    $("#email_err").text('Email is required!');
                }
            }
        }])
    .controller('manageCustomerCtl', ['$scope', '$state', '$rootScope', '$http', 'Customer', 'CustomerBlockCmd',
        function ($scope, $state, $rootScope, $http, Customer, CustomerBlockCmd) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.customerList = [];
            $scope.getCustomer = () => {
                Customer.find().$promise.then((res) => {
                    $scope.customerList = res;
                })
            }
            $scope.getCustomer();

            $scope.isReasonShow = isTextShow = false;
            $scope.blockUnBlog = (id) => {
                $scope.isTextShow = true;
                $scope.isReasonShow = false;
                localStorage.removeItem("blockCusId");
                localStorage.setItem("blockCusId", JSON.stringify({ "id": id }));
                $("#reason").val('');
                if (id) {
                    if ($("#isBlock").prop('checked')) $(".blockAndUnBlockTxt").text('Are you sure you want block this customer?');
                    else $(".blockAndUnBlockTxt").text('Are you sure you want Unblock this customer?');
                    $('#blockAndUnBlockModal').modal({ backdrop: 'static', keyboard: false });
                }
            }

            $scope.blockAction = (arg) => {
                if (arg) {
                    $scope.isTextShow = false;
                    if ($("#reason").val()) {
                        $('#blockAndUnBlockModal').modal('hide');
                        let customerData = JSON.parse(localStorage.getItem("blockCusId")), customerId;
                        if (customerData) customerId = customerData.id;
                        if (customerId) {
                            CustomerBlockCmd.create({ customerId, reasonTxt: $("#reason").val() });
                            Customer.upsertWithWhere({ where: { id: customerId } }, { reasonTxt: $("#reason").val(), isBlock: $("#isBlock").prop('checked') })
                        }
                    } else if ($scope.isReasonShow) {
                        $("#reason_err").text('Reason is required!');
                    }
                    $scope.isReasonShow = true;
                } else {
                    if ($("#isBlock").prop('checked')) $("#isBlock").prop('checked', false);
                    else $("#isBlock").prop('checked', true);
                    $('#blockAndUnBlockModal').modal('hide');
                }
            }

            $scope.viewCustomer = (id) => {
                $('#viewCustomerInfo').modal({ backdrop: 'static', keyboard: false });
                $scope.customerViewdata = $scope.customerList.find(m => m.id == id);
            }

            $scope.deleteConfirm = (id) => {
                if (id) {
                    localStorage.removeItem("cus_delete_id");
                    localStorage.setItem("cus_delete_id", JSON.stringify({ id }));
                    $('#modalDeleteConfirm').modal({ backdrop: 'static', keyboard: false });
                } else toastMsg(false, "Please try again!");
            }

            $scope.confirmDelete = () => {
                let data = JSON.parse(localStorage.getItem("cus_delete_id"));
                if (data && data.id) {
                    Customer.deleteById({ id: data.id }).$promise.then((res) => {
                        $scope.getCustomer();
                        toastMsg(true, "Successfully deleted!");
                        $('#modalDeleteConfirm').modal('hide');
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                        $('#modalDeleteConfirm').modal('hide');
                    });
                } else toastMsg(false, "Please try again!");
            }

            $scope.editCustomer = (id) => {
                localStorage.removeItem("cus_edit_id");
                localStorage.setItem("cus_edit_id", JSON.stringify({ id }));
                $state.go("edit-customer");
            }
        }])
    .controller('editCustomerCtl', ['$scope', '$state', '$rootScope', '$http', 'Customer',
        function ($scope, $state, $rootScope, $http, Customer) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            if (localStorage.getItem("cus_edit_id")) {
                let data = JSON.parse(localStorage.getItem("cus_edit_id"));
                if (data && data.id) {
                    let id = data.id;
                    Customer.findOne({ filter: { where: { id } } }).$promise.then((res) => {
                        $scope.customerData = res;
                    })
                } else toastMsg(false, "Please try again!");
            } else $state.go("create-customer");

            $scope.updateCustomer = () => {
                let data = JSON.parse(localStorage.getItem("cus_edit_id"));
                if (data && data.id) {
                    let id = data.id;
                    let email, male, female, isOlder;
                    email = $("#email").val();
                    male = ($("input[name='gender']:checked").val() == 'male' ? true : false);
                    female = ($("input[name='gender']:checked").val() == 'female' ? true : false);
                    isOlder = $("#isOlder").is(':checked');
                    Customer.upsertWithWhere({ where: { id } }, { email, male, female, isOlder }).$promise.then((res) => {
                        $state.go("manage-customer");
                        toastMsg(true, "Successfully updated.");
                    }, (err) => {
                        console.log(err);
                        toastMsg(false, "Please try again!");
                    })
                } else toastMsg(false, "Please try again!");
            }
        }]);