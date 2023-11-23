export function setSlider(sliderSelector, btnNumber) {
    let sliderContainer = document.getElementById(sliderSelector);
    let slider = sliderContainer.querySelector('.slides-wrapper');
    let slide = slider.querySelector('.slide');
    let slideMarginRight = parseInt(getComputedStyle(slide).marginRight);
    let slideWidth = slide.offsetWidth + slideMarginRight;
    let slidesQuantity = slider.querySelectorAll('.slide').length;
    let leftBtn = sliderContainer.querySelector('.left-btn');
    let rightBtn = sliderContainer.querySelector('.right-btn');
    let translateWidth = -slideWidth;
    let maxTrWidth = -slideWidth * slidesQuantity;
    let currentBtn = 0;
    let runMoveSlides;
    let navBtnsContainer;
    let navBtns;
    let navBtnsQuantity;


    function moveSlide(direction, opt = false) {
        slider.style.transform = 'translateX(' + translateWidth + 'px)';
        translateWidth -= slideWidth;
        sliderSelector == 'gallery-lower-slider' || opt ? null : switchNavBtn(direction);
    }

    function moveSliderLeft() {
        if (translateWidth >= -slideWidth) return;
        translateWidth += slideWidth * 2;
        moveSlide('left');
    }


    function moveSliderRight() {
        if (translateWidth <= maxTrWidth) translateWidth = 0;
        moveSlide('right');
    }


    function changeNavBtn(btnNumber) {
        navBtns[btnNumber].classList.add('active-nav-btn');
        translateWidth = -slideWidth * btnNumber;
        currentBtn = btnNumber;
        moveSlide('right', true);
    }



    function clickNavBtn(e) {
        let currentNavBtn = e.target.closest('div');
        if (!currentNavBtn.classList.contains('nav-btn')) return;
        currentBtn = navBtns.indexOf(currentNavBtn);
        translateWidth = -slideWidth * currentBtn;
        moveSlide();
    }


    function switchNavBtn(direction) {
        if (direction === 'left') {
            currentBtn--;
        } else if (direction === 'right') {
            currentBtn = currentBtn >= navBtnsQuantity ? 0 : currentBtn + 1;
        }

        navBtnsContainer.querySelector('.active-nav-btn').classList.remove('active-nav-btn');
        navBtns[currentBtn].classList.add('active-nav-btn');
    }

    function infiniteSlider() {

        if (translateWidth <= maxTrWidth) {
            translateWidth = 0;
        }
        moveSlide('right');
    }

    function stopInfiniteSlider() {
        clearInterval(runMoveSlides);

    }

    function runInfiniteSlider() {
        runMoveSlides = setInterval(infiniteSlider, 4000);
    }


    leftBtn.addEventListener('click', moveSliderLeft);
    rightBtn.addEventListener('click', moveSliderRight);


    if (sliderSelector != 'gallery-lower-slider') {
        navBtnsContainer = sliderSelector === 'gallery-upper-slider' ? document.getElementById('gallery-nav-btns') : sliderContainer.querySelector('.nav-btns');
        navBtns = Array.from(navBtnsContainer.children);
        navBtnsQuantity = navBtns.length - 1;
        navBtnsContainer.addEventListener('click', clickNavBtn);

        if (sliderSelector == 'slider' || sliderSelector == 'testimonials') {
            let options = {
                rootMargin: '0px 0px 0px 0px',
            };

            let callback = (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runInfiniteSlider();
                    } else {
                        stopInfiniteSlider();
                    }
                })
            };

            const observer = new IntersectionObserver(callback, options);
            observer.observe(sliderContainer);

            slider.addEventListener('mouseover', stopInfiniteSlider);
            slider.addEventListener('mouseout', runInfiniteSlider);
        }
    }
    if (sliderSelector == 'gallery-upper-slider') {
        changeNavBtn(btnNumber);
    }
}
