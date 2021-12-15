angular
    .module('myApp')
    .controller('teenacheManageCtl', ['$scope', '$state', '$rootScope', '$http', 'Teenache',
        function ($scope, $state, $rootScope, $http, Teenache) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.teenacheData = [];
            $scope.getData = () => {
                $scope.teenacheData = [];
                Teenache.find().$promise.then((res) => {
                    $scope.teenacheData = res;
                })
            }
            $scope.getData();


            $scope.popUpForDelete = (id) => {
                if (id) {
                    localStorage.removeItem("teenache_delete_id");
                    localStorage.setItem("teenache_delete_id", JSON.stringify({ id }));
                    $('#modalDeleteConfirm').modal({ backdrop: 'static', keyboard: false });
                } else toastMsg(false, "Please try again!");
            }



            $scope.confirmDelete = () => {
                let data = JSON.parse(localStorage.getItem("teenache_delete_id"));
                if (data && data.id) {
                    Teenache.deleteById({ id: data.id }).$promise.then((res) => {
                        $scope.getData();
                        toastMsg(true, "Successfully deleted!");
                        $('#modalDeleteConfirm').modal('hide');
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                        $('#modalDeleteConfirm').modal('hide');
                    });
                } else toastMsg(false, "Please try again!");
            }
        }])
    .controller('teenacheCreateCtl', ['$scope', '$state', '$rootScope', '$http', 'Teenache',
        function ($scope, $state, $rootScope, $http, Teenache) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.isComman = () => {
                $(".isComman_1").change(function () {
                    $(".isComman_1").prop('checked', false);
                    $(this).prop('checked', true);
                });
            }



            $scope.create = () => {

                let isTrue = true, category, isForum, isArticle, title, fullDesc; let img = {};

                if ($("#category").val() != 'select') category = $("#category").val();
                else {
                    isTrue = false;
                    $("#category_err").text('Category is required!');
                }
                isArticle = $('#isArticle').is(":checked");
                isForum = $('#isForum').is(":checked");
                if ($("#title").val()) title = $("#title").val();
                else {
                    isTrue = false;
                    $("#title_err").text('Title is required!');
                }
                if ($("#full-descrption").val()) fullDesc = $("#full-descrption").val();
                else {
                    isTrue = false;
                    $("#desc_err").text('Full description is required!');
                }
                if ($("#teenache_images")[0].files.length == 0) {
                    isTrue = false;
                    $("#img_err").text('Image is required!');
                }

                const uploadImage = new Promise((resolve, reject) => {
                    var fd = new FormData();
                    let file = $("#teenache_images")[0].files[0];
                    fd.append(`myFile`, file);
                    $http.post('/uploadfile', fd, { headers: { 'Content-Type': undefined } }).then((res) => {
                        if (res && res.data) {
                            let { destination, filename, path } = res.data
                            resolve({ isSuccess: true, data: { destination, filename, path } });
                        } else resolve({ isSuccess: false, data: {} });
                    }, (err) => {
                        resolve({ isSuccess: false, data: {} });
                    });
                });

                if ($("#teenache_images")[0].files.length > 0 && isTrue) {
                    $("#create_btn").prop('disabled', true);
                    $(".loader").css({ display: 'block' });
                    uploadImage.then((result) => {
                        if (result && result.data) {
                            let { destination, filename } = result.data;
                            let url = localStorage.getItem('app-url');
                            let path = `${url}views/uploads/${filename}`;
                            Teenache.create({ category, isForum, isArticle, title, fullDesc, img: { filename, path } })
                                .$promise.then((res) => {
                                    $("#title,#full-descrption,#teenache_images,#category").val('');
                                    $("#create_btn").prop('disabled', false);
                                    // bootoastMsg(true, "Successfully created");
                                    $state.go('manage-teenache');
                                    $(".loader").css({ display: 'none' });
                                }, (err) => {
                                    $(".loader").css({ display: 'none' });
                                    // bootoastMsg(false, "Please try again");
                                })
                        }
                    })
                }
            }

        }]);