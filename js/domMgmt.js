var appContent = document.getElementById('appContent');
var appLoading = document.getElementById('appLoading');
var modalWindowTitle = document.getElementById('modalWindowTitle');
var modalWindowBodyContent = document.getElementById('modalWindowBodyContent');
var modalWindowBodyContentInProgress = document.getElementById('modalWindowBodyContentInProgress');
var modalWindowCloseBtnHeader = document.getElementById('modalWindowCloseBtnHeader');
var modalWindowCloseBtnFooter = document.getElementById('modalWindowCloseBtnFooter')
var genericButton = document.getElementById('genericButton');


function deleteChildsInModalWindowBodyContent() {
    if (modalWindowBodyContent.hasChildNodes()==true) {
        while (modalWindowBodyContent.firstChild) {
            modalWindowBodyContent.removeChild(modalWindowBodyContent.firstChild)
        }
    }
    return true
}

function closeModalWindow() {
    let myModal = document.getElementById("modalWindow");
    if (typeof(myModal) !== 'undefined' || myModal !== null) {
        let myModalInstance = bootstrap.Modal.getInstance(myModal)
        myModalInstance.hide()
    }
}

function displayModalWindow() {
    let myModal = new bootstrap.Modal(document.getElementById("modalWindow"), {});
    if (typeof(myModal) !== 'undefined' || myModal !== null) {
        myModal.show();
    }
}

function addEventListeners() {
    //
    modalWindowCloseBtnHeader.addEventListener('click', function() {
        deleteChildsInModalWindowBodyContent()
        closeModalWindow();
    });
    modalWindowCloseBtnFooter.addEventListener('click', function() {
        deleteChildsInModalWindowBodyContent();
        closeModalWindow();
    });
    genericButton.addEventListener('click', function() {displayModalWindow();});
}

document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();

})
