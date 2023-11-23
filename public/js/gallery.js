import { openCloseWindow } from './openCloseWindow.js';
import { setSlider } from './slider.js';

function setGallery() {

    let getFunctions = openCloseWindow();
    let [showGallery, closeWindow] = getFunctions('gallery');

    let galleryBtns = document.getElementById('gallery-btn');
    let galleryBtnsArr = Array.from(galleryBtns.querySelectorAll('.housing-img'));
    let galleryCross = document.querySelector('#gallery-window .cross');

    galleryBtns.addEventListener('click', (e) => showGallery(e.currentTarget, e.target));
    galleryBtns.addEventListener('click', (e) => setSliderData(e));
    galleryCross.addEventListener('click', (e) => closeGallery(e.currentTarget));


    function closeGallery(currentTarget) {
        closeWindow(currentTarget);
        let activeNavBtn = document.querySelector('.active-nav-btn');
        activeNavBtn.classList.remove('active-nav-btn');
    }

    function setSliderData(e) {
        let targetElement = e.target.closest('.housing-img');
        let currentBtn = galleryBtnsArr.indexOf(targetElement);
        setSlider('gallery-upper-slider', currentBtn);
        setSlider('gallery-lower-slider');
    }

}


setGallery();