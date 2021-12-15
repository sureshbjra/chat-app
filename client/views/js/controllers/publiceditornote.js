angular
    .module('myApp')
    .controller('createPubliceditornoteCtl', ['$scope', '$state', '$rootScope', '$http','PublicEditorNote',
        function ($scope, $state, $rootScope, $http , PublicEditorNote) {

            bootoastMsg = (isVaild, message) => {
                let type = 'danger';
                if (isVaild) type = 'success';
                else type = 'danger';
                bootoast({
                    message, type, timeout: false, position: 'top-right', animationDuration: 300
                });
            }


            $scope.create = () => {

                let isTrue = true, title, fullDesc;

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

                if(isTrue) {
                    PublicEditorNote.create({ title , fullDesc })
                    .$promise.then((res) => {
                        $("#title,#full-descrption").val('');
                        $("#create_btn").prop('disabled', false);
                        bootoastMsg(true, "Successfully created");
                        $state.go('manage-editor-note');
                        $(".loader").css({ display: 'none' });
                    }, (err) => {
                        $(".loader").css({ display: 'none' });
                        bootoastMsg(false, "Please try again");
                    })
                }
            }
          
        }])
    .controller('manageeditornotePublicCtl', ['$scope', '$state', '$rootScope', '$http', 'PublicEditorNote',
        function ($scope, $state, $rootScope, $http, PublicEditorNote) {

            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            $scope.editorNoteList = [];
            $scope.getAllEditorNote = () => {
                $scope.editorNoteList = [];
                PublicEditorNote.find({ filter : { where : { status : 'new' } } }).$promise.then((res) => {
                    $scope.editorNoteList = res;
                })
            }
            $scope.getAllEditorNote();


            $scope.viewEditorNote = (id) => {
                if (id) {
                    $scope.viewEditorNotData = $scope.editorNoteList.find(m => m.id == id);
                    $('#viewEditorNoteInfo').modal({ backdrop: 'static', keyboard: false });
                } else $state.go("create-editor-note");
            }

            $scope.popUpForDelete = (id) => {
                if (id) {
                    localStorage.removeItem("editor_delete_id");
                    localStorage.setItem("editor_delete_id", JSON.stringify({ id }));
                    $('#modalDeleteConfirm').modal({ backdrop: 'static', keyboard: false });
                } else toastMsg(false, "Please try again!");
            }

            
            $scope.confirmDelete = () => {
                let data = JSON.parse(localStorage.getItem("editor_delete_id"));
                if (data && data.id) {
                    PublicEditorNote.deleteById({ id: data.id }).$promise.then((res) => {
                        $scope.getAllEditorNote();
                        toastMsg(true, "Successfully deleted!");
                        $('#modalDeleteConfirm').modal('hide');
                    }, (err) => {
                        toastMsg(false, "Please try again!");
                        $('#modalDeleteConfirm').modal('hide');
                    });
                } else toastMsg(false, "Please try again!");
            }

            $scope.editEditor = (id) => {
                localStorage.removeItem("editor_edit_id");
                localStorage.setItem("editor_edit_id", JSON.stringify({ id }));
                $state.go("edit-editor-note");
            }
        }])
        .controller('editeditornoteCtl', ['$scope', '$state', '$rootScope', '$http', 'PublicEditorNote',
        function ($scope, $state, $rootScope, $http, PublicEditorNote) { 
            toastMsg = (isVaild, msg) => {
                if (isVaild)
                    toastr.success(msg);
                else
                    toastr.error(msg);
                toastr.options = { "closeButton": true, "progressBar": true, "timeOut": "5000" };
            }

            let data = JSON.parse(localStorage.getItem("editor_edit_id"));
            if (data) {
                if (data && data.id) {
                    let id = data.id;
                    PublicEditorNote.findOne({ filter: { where: { id } } }).$promise.then((res) => {
                        $scope.EditorNoteData = res;
                    })
                } else toastMsg(false, "Please try again!");
            } else $state.go("create-editor-note");

            $scope.updateEditorNote = () => {
                let data = JSON.parse(localStorage.getItem("editor_edit_id"));
                if (data && data.id) {
                    let id = data.id;
                    let title, fullDesc;
                    title = $("#title").val();
                    fullDesc = $("#full-descrption").val();
                    PublicEditorNote.upsertWithWhere({ where: { id } }, { title, fullDesc }).$promise.then((res) => {
                        toastMsg(true, "Successfully updated.");
                        $state.go("manage-editor-note");
                    }, (err) => {
                        console.log(err);
                        toastMsg(false, "Please try again!");
                    })
                } else toastMsg(false, "Please try again!");
            }
        }]);