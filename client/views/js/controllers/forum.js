angular
    .module('myApp')
    .controller('createForumCtl', ['$scope', '$state', '$rootScope', '$http', 'Forum', 'ForumCategory',
        function ($scope, $state, $rootScope, $http, Forum, ForumCategory) {

            bootoastMsg = (isVaild, message) => {
                let type = 'danger';
                if (isVaild) type = 'success';
                else type = 'danger';
                bootoast({
                    message, type, timeout: false, position: 'top-right', animationDuration: 300
                });
            }

            $scope.categoriesList = [];
            $scope.getCategory = () => {
                ForumCategory.find({ filter: { order: 'order asc' } }).$promise.then((res) => {
                    $scope.categoriesList = res;
                })
            }
            $scope.getCategory();

            $scope.isComman = () => {
                $(".isComman_1").change(function () {
                    $(".isComman_1").prop('checked', false);
                    $(this).prop('checked', true);
                });
            }

            $scope.create = () => {


                let isTrue = true, forumCategoryId, isArticle = false, isForum = false, isPrivate = false, title, fullDesc; let img = {};
                let subCategory;

                if ($("#category").val() != 'select') forumCategoryId = $("#category").val();
                else {
                    isTrue = false;
                    $("#category_err").text('Category is required!');
                }
                isPrivate = $('#isPrivate').is(":checked");
                isArticle = $('#isArticle').is(":checked");
                isForum = $('#isForum').is(":checked");
                if ($("#title").val()) title = $("#title").val();
                else {
                    isTrue = false;
                    $("#title_err").text('Title is required!');
                }
                if ($("#sub-category").val()) subCategory = $("#sub-category").val();
                else {
                    isTrue = false;
                    $("#sub_category_err").text('Sub category is required!');
                }
                if ($("#comment").val()) fullDesc = $("#comment").val();
                else {
                    isTrue = false;
                    $("#desc_err").text('Full description is required!');
                }
                if ($("#forum_images")[0].files.length == 0) {
                    isTrue = false;
                    $("#img_err").text('Image is required!');
                }

                const uploadImage = new Promise((resolve, reject) => {
                    var fd = new FormData();
                    let file = $("#forum_images")[0].files[0];
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

                if ($("#forum_images")[0].files.length > 0 && isTrue) {
                    $("#create_btn").prop('disabled', true);
                    $(".loader").css({ display: 'block' });
                    uploadImage.then((result) => {
                        if (result && result.data) {
                            let { destination, filename } = result.data;
                            let url = localStorage.getItem('app-url');
                            let path = `${url}views/uploads/${filename}`;
                            Forum.create({ forumCategoryId, isPrivate, isArticle, isForum, subCategory, title, fullDesc, img: { filename, path } })
                                .$promise.then((res) => {
                                    $("#title,#comment,#blog_images").val('');
                                    $("#create_btn").prop('disabled', false);
                                    bootoastMsg(true, "Successfully created");
                                    $state.go('manage-forum');
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
    .controller('manageForumCtl', ['$scope', '$state', '$rootScope', '$http', 'Forum',
        function ($scope, $state, $rootScope, $http, Forum) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.forumList = [];
            $scope.getAllForum = () => {
                Forum.find({ filter: { include: [{ relation: "forumCategory" }] } }).$promise.then((res) => {
                    $scope.forumList = res;
                })
            }
            $scope.getAllForum();

            $scope.viewForum = (id) => {
                if (id) {
                    $scope.viewForumData = $scope.forumList.find(m => m.id == id);
                    $('#viewForumInfo').modal({ backdrop: 'static', keyboard: false });
                } else $state.go("create-forum");
            }

            $scope.popUpForDelete = (id) => {
                if (id) {
                    localStorage.removeItem("forum_delete_id");
                    localStorage.setItem("forum_delete_id", JSON.stringify({ id }));
                    $('#modalDeleteConfirm').modal({ backdrop: 'static', keyboard: false });
                } else toastMsg(false, "Please try again!");
            }

            $scope.confirmDelete = () => {
                let data = JSON.parse(localStorage.getItem("forum_delete_id"));
                if (data && data.id) {
                    Forum.deleteById({ id: data.id }).$promise.then((res) => {
                        $scope.getAllForum();
                        toastMsg(true, "Successfully deleted!");
                        $('#modalDeleteConfirm').modal('hide');
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                        $('#modalDeleteConfirm').modal('hide');
                    });
                } else toastMsg(false, "Please try again!");
            }

            $scope.editForum = (id) => {
                localStorage.removeItem("forum_edit_id");
                localStorage.setItem("forum_edit_id", JSON.stringify({ id }));
                $state.go("edit-forum");
            }
        }])
    .controller('editForumCtl', ['$scope', '$state', '$rootScope', '$http', 'Forum', 'ForumCategory',
        function ($scope, $state, $rootScope, $http, Forum, ForumCategory) {
            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.categoriesList = [];
            $scope.getCategory = () => {
                ForumCategory.find({ filter: { order: 'order asc' } }).$promise.then((res) => {
                    $scope.categoriesList = res;
                })
            }
            $scope.getCategory();

            let data = JSON.parse(localStorage.getItem("forum_edit_id"));
            if (data) {
                if (data && data.id) {
                    let id = data.id;
                    Forum.findOne({ filter: { where: { id }, include: [{ relation: "forumCategory" }] } }).$promise.then((res) => {
                        $scope.forumData = res;
                    })
                } else toastMsg(false, "Please try again!");
            } else $state.go("create-forum");

            $scope.isComman = () => {
                $(".isComman_1").change(function () {
                    $(".isComman_1").prop('checked', false);
                    $(this).prop('checked', true);
                });
            }

            $scope.updateForum = () => {
                let data = JSON.parse(localStorage.getItem("forum_edit_id"));
                if (data && data.id) {
                    let id = data.id;
                    let isPrivate, title, forumCategoryId, fullDesc, subCategory, isForum, isArticle;
                    title = $("#title").val();
                    forumCategoryId = $("#category").val();
                    fullDesc = $("#comment").val();
                    isPrivate = $("#isPrivate").is(':checked');
                    isForum = $("#isForum").is(':checked');
                    isArticle = $("#isArticle").is(':checked');
                    subCategory = $("#sub-category").val();
                    Forum.upsertWithWhere({ where: { id } }, { title, fullDesc, subCategory, isForum, isArticle, forumCategoryId, isPrivate }).$promise.then((res) => {
                        toastMsg(true, "Successfully updated.");
                        $state.go("manage-forum");
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                    });
                } else toastMsg(false, "Please try again!");
            }

        }]);