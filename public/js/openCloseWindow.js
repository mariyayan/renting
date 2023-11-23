export function openCloseWindow() {

    function showWindow(currentTargetElement, opt = true) {
        if (opt === false) return;
        let id = currentTargetElement.getAttribute('id');
        let elementWindow = document.getElementById(`${id.slice(0,id.length-4)}-window`);
        elementWindow.classList.add('show-window');
    }

    function checkIsItImg(targetElement) {
        targetElement.nodeName === 'IMG' ? true : false;
    }


    function closeWindow(currentTarget) {
        let windowElement = currentTarget.closest('.window');
        windowElement.classList.add('hide-opacity');
        hideWindow(windowElement);
    }

    function closeWindowByUserClick(targetElement, currentTarget) {
        targetElement.classList.contains('window') || targetElement.classList.contains('cross') ? closeWindow(currentTarget) : null;
    }

    function hideWindow(element) {
        setTimeout(() => element.classList.remove('show-window'), 1000);
    }

    function openCloseUserNavMenu() {
        let open = true;
        let menu = document.getElementById('user-nav-menu-window');
        return function() {
            open = !open;
            if (open) {
                menu.classList.add('show-window');
            } else {
                menu.classList.remove('show-window');
            }
        }
    }

    function showMessage() {
        let messageWindow = document.getElementById('message-window');
        messageWindow.classList.add('show-window');
        hideWindow(messageWindow);
    }

    function showUserNavMenu() {
        let userNavMenuBtn = document.getElementById('user-nav-menu-btn');
        let headerBtns = document.getElementById('header-btns');
        userNavMenuBtn.classList.add('show-nav-menu');
        headerBtns.classList.remove('show-nav-menu');
    }

    function showGallery(currentTargetElement, targetElement) {
        showWindow(currentTargetElement, checkIsItImg(targetElement));
    }


    function getMenuFunctions() {
        return [showWindow, openCloseUserNavMenu(), closeWindowByUserClick, closeWindow];
    }

    function getGalleryFunction() {
        return [showGallery, closeWindow];
    }

    function getDialogBoxFunctions() {
        return [showWindow, closeWindow, closeWindowByUserClick];
    }

    function getFunctions(opt) {
        if (opt === 'menu') {
            return getMenuFunctions();
        } else if (opt === 'gallery') {
            return getGalleryFunction();
        } else if (opt === 'dialog-box') {
            return getDialogBoxFunctions();
        } else if (opt === 'windows') {
            return [showUserNavMenu, closeWindow, showMessage];
        }
    }

    return getFunctions;
}