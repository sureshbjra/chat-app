angular
    .module('myApp')
    .controller('createBlogCtl', ['$scope', '$state', '$rootScope', '$http', 'Blog',
        function ($scope, $state, $rootScope, $http, Blog) {

            bootoastMsg = (isVaild, message) => {
                let type = 'danger';
                if (isVaild) type = 'success';
                else type = 'danger';
                bootoast({
                    message, type, timeout: false, position: 'top-right', animationDuration: 300
                });
            }

            $scope.create = () => {


                let isTrue = true, title, fullDesc, isPrivate = false; let img = {};

                if ($("#title").val()) title = $("#title").val();
                else {
                    isTrue = false;
                    $("#title_err").text('Title is required!');
                }
                isPrivate = $('#isPrivate').is(":checked");
                if ($("#comment").val()) fullDesc = $("#comment").val();
                else {
                    isTrue = false;
                    $("#desc_err").text('Full description is required!');
                }
                if ($("#blog_images")[0].files.length == 0) {
                    isTrue = false;
                    $("#img_err").text('Image is required!');
                }

                const uploadImage = new Promise((resolve, reject) => {
                    var fd = new FormData();
                    let file = $("#blog_images")[0].files[0];
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

                if ($("#blog_images")[0].files.length > 0 && isTrue) {
                    $("#create_btn").prop('disabled', true);
                    $(".loader").css({ display: 'block' });
                    let url = localStorage.getItem('app-url');
                    uploadImage.then((result) => {
                        if (result && result.data) {
                            let { destination, filename } = result.data;
                            let path = `${url}views/uploads/${filename}`;
                            Blog.create({ title, fullDesc, isPrivate, img: { filename, path } })
                                .$promise.then((res) => {
                                    $("#title,#comment,#blog_images").val('');
                                    $("#create_btn").prop('disabled', false);
                                    bootoastMsg(true, "Successfully created");
                                    $state.go('manage-blog');
                                    $(".loader").css({ display: 'none' });
                                }, (err) => {
                                    $(".loader").css({ display: 'none' });
                                    bootoastMsg(false, "Please try again");
                                })
                        }
                    })
                }
            }
        }])
    .controller('manageBlogCtl', ['$scope', '$state', '$rootScope', '$http', 'Blog',
        function ($scope, $state, $rootScope, $http, Blog) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.blogList = [];
            $scope.getAllBlog = () => {
                Blog.find().$promise.then((res) => {
                    $scope.blogList = res;
                })
            }
            $scope.getAllBlog();

            $scope.viewBlog = (id) => {
                if (id) {
                    $scope.viewBlogData = $scope.blogList.find(m => m.id == id);
                    $('#viewBlogInfo').modal({ backdrop: 'static', keyboard: false });
                } else $state.go("create-blog");
            }

            $scope.popUpForDelete = (id) => {
                if (id) {
                    localStorage.removeItem("blog_delete_id");
                    localStorage.setItem("blog_delete_id", JSON.stringify({ id }));
                    $('#modalDeleteConfirm').modal({ backdrop: 'static', keyboard: false });
                } else toastMsg(false, "Please try again!");
            }

            $scope.confirmDelete = () => {
                let data = JSON.parse(localStorage.getItem("blog_delete_id"));
                if (data && data.id) {
                    Blog.deleteById({ id: data.id }).$promise.then((res) => {
                        $scope.getAllBlog();
                        toastMsg(true, "Successfully deleted!");
                        $('#modalDeleteConfirm').modal('hide');
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                        $('#modalDeleteConfirm').modal('hide');
                    });
                } else toastMsg(false, "Please try again!");
            }

            $scope.editBlog = (id) => {
                localStorage.removeItem("blog_edit_id");
                localStorage.setItem("blog_edit_id", JSON.stringify({ id }));
                $state.go("edit-blog");
            }
        }])
    .controller('editBlogCtl', ['$scope', '$state', '$rootScope', '$http', 'Blog',
        function ($scope, $state, $rootScope, $http, Blog) {
            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            let data = JSON.parse(localStorage.getItem("blog_edit_id"));
            if (data) {
                if (data && data.id) {
                    let id = data.id;
                    Blog.findOne({ filter: { where: { id } } }).$promise.then((res) => {
                        $scope.blogData = res;
                    })
                } else toastMsg(false, "Please try again!");
            } else $state.go("create-blog");


            $scope.updateBlog = () => {
                let data = JSON.parse(localStorage.getItem("blog_edit_id"));
                if (data && data.id) {
                    let id = data.id;
                    let isPrivate, title, category, fullDesc;
                    title = $("#title").val();
                    category = $("#category").val();
                    fullDesc = $("#comment").val();
                    isPrivate = $("#isPrivate").is(':checked');
                    Blog.upsertWithWhere({ where: { id } }, { title, fullDesc, category, isPrivate }).$promise.then((res) => {
                        toastMsg(true, "Successfully updated.");
                        $state.go("manage-blog");
                    }, (err) => {
                        console.log(err);
                        toastMsg(false, "Please try again!");
                    })
                } else toastMsg(false, "Please try again!");
            }
        }]);