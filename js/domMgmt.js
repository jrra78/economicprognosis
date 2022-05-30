var sidebar = document.getElementById('sidebar');
var appContent = document.getElementById('appContent');
var appLoading = document.getElementById('appLoading');
var modalWindowTitle = document.getElementById('modalWindowTitle');
var modalWindowBodyContent = document.getElementById('modalWindowBodyContent');
var modalWindowBodyContentInProgress = document.getElementById('modalWindowBodyContentInProgress');
var modalWindowCloseBtnHeader = document.getElementById('modalWindowCloseBtnHeader');
var modalWindowCloseBtnFooter = document.getElementById('modalWindowCloseBtnFooter')
var genericButton = document.getElementById('genericButton');


function deleteChildsInAppContent() {
    if (appContent.hasChildNodes()==true) {
        while (appContent.firstChild) {
            appContent.removeChild(appContent.firstChild)
        }
    }
    return true
}


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

function closeSideBar() {
    let mySidebar = document.getElementById('sidebar')
    if (typeof(mySidebar) !== 'undefined' || mySidebar !== null) {
        let mySidebarInstance = bootstrap.Offcanvas.getInstance(mySidebar)
        mySidebarInstance.hide()
    }   
}

function offCanvasListener(offCanvasId) {
    let myOffCanvas = document.getElementById(offCanvasId);
  
    const hideCanvas = () => {
      let openedCanvas = bootstrap.Offcanvas.getInstance(myOffCanvas);
      openedCanvas.hide();
      event.target.removeEventListener('mouseleave', hideCanvas);
    }

    const listenToMouseLeave = (event) => {
      event.target.addEventListener('mouseleave', hideCanvas);
    }
    
    myOffCanvas.addEventListener('shown.bs.offcanvas', listenToMouseLeave);
}

function addEventListeners() {
    //
    sidebarCloseButton.addEventListener('click', function() {
        closeSideBar()
    })
    modalWindowCloseBtnHeader.addEventListener('click', function() {
        deleteChildsInModalWindowBodyContent()
        closeModalWindow();
    });
    modalWindowCloseBtnFooter.addEventListener('click', function() {
        deleteChildsInModalWindowBodyContent();
        closeModalWindow();
    });
    genericButton.addEventListener('click', function() {
        displayModalWindow();
    });
    offCanvasListener('sidebar')
}

document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
})
