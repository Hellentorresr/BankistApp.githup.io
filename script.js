'use strict';

//selecting the header
const header = document.querySelector('.header');
const btnOpenResponsive = document.getElementById('navToggle');
const navContainer = document.querySelector('.nav__links');

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');//it an anchor tag and i have 4 of them
//a node list NOT an array but we can still use the forEach method 
const btnScrollTo = document.querySelector('.btn--scroll-to');//the button
const section1 = document.querySelector('#section--1');//the secction where the button its gonna show
const nav = document.querySelector('.nav');

//responsive part
/* btnOpenResponsive.addEventListener('click', () => {
    navContainer.classList.toggle('nav-open');
}); */

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

//we need to loop over each btn with the class btn--show-modal
//and I have 2, one at the top of the page and the other at the bottom of the page
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

///////////////////////////////////////
//Implementing the smooth scroll just for the button Learn more
btnScrollTo.addEventListener('click', () => {
    section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
//Implementing the navigation video 192 Event delegation
//quryselectAll returns a list
/* document.querySelectorAll('.nav__link').forEach(function (el) {
    el.addEventListener('click', (e) => {
        e.preventDefault();//with this method we stop the auto scroll the specific section and url does not change either
        //let's implement the smooth scroll
        const id = e.target.getAttribute('href');// = #section--1 #section--2 #section--3
        console.log(id)
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    });
}); */

//now doing the same thing but with delegation
//for the event delegation we need 2 steps
//first: we add the event listener to a common parent element
//second: Determite what element originated the event

document.querySelector('.nav__links').addEventListener('click', (e) => {
    //to find where the event happened - event.target
    e.preventDefault();

    //matching strategy
    if (e.target.classList.contains('nav__link')) { //if the container .nav_links has an link 'a' with this class
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

//OPERATION SECTION THE TAPS
//1. selecting the taps contaiener where the buttons are
const tabsContainer = document.querySelector('.operations__tab-container');

//2. selecting the buttons
const taps = document.querySelectorAll('.operations__tab');

//3. selecting the 3 content areas 
const tabsContent = document.querySelectorAll('.operations__content');

//adding the event handler for our buttons
//working with event delegation so we have to select the common parent of all of our btns
tabsContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.operations__tab');
    //guard clause
    if (!clicked) return;

    //Active tab
    taps.forEach(tab => tab.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    //Activate content area--contaieners
    //removing the active class which is the one that shows the containers
    tabsContent.forEach(ele => ele.classList.remove('operations__content--active'));
    //console.log(clicked.dataset.tab)
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//Menu fade animation--using event delegation
const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target; //each element <a>
        //now we need to select the sibling elements = links
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        //now let's select the logo
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(sib => {
            if (sib !== link) sib.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
/* const initialCorrds = section1.getBoundingClientRect();

window.addEventListener('scroll', function (e) {//this event gets trigger any time we scroll on the page
    //its not efficient and I shouldn't use it, this is just an examp;e
    //console.log(this.window.screenY);

    if (this.window.scrollY > initialCorrds.top) nav.classList.add('sticky')
    else nav.classList.remove('sticky');
}); */

/* const callback = (entries, observer) => {
    entries.forEach(entry => {
        console.log(entry);
    });
};

const observerOption = {
    root: null,
    threshold: 0.10 // thereshold of 10% = 10% intersectionRatio
};

const observer = new IntersectionObserver(callback, observerOption);
observer.observe(section1);  */

//now implementing the nav 
const headerE = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');

};

const headerObserver = new IntersectionObserver(stickyNav,
    { root: null, threshold: 0, rootMargin: `-${navHeight}px` });

headerObserver.observe(headerE);

// Reveal sections video 198
//selecting all the sections
const allSections = document.querySelectorAll('.section');

//the logic
const revealSection = (entries, observer) => {
    const [entry] = entries;//because we have only one threshold
    //console.log(entry);
    /*The entry return a target let's say the first section#1 would be 
    the first target as we scroll and then the other sections */
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

//the settings
const sectionObserver = new IntersectionObserver(revealSection,
    { root: null, threshold: 0.15 });


allSections.forEach((eachSection) => {
    sectionObserver.observe(eachSection);
    // eachSection.classList.add('section--hidden');//////////////////
});

//Lazy loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

//the logic goes in this function
const loadImg = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    //replace src with data-src
    entry.target.src = entry.target.dataset.src; //data-src= data-src="img/digital.jpg"

    entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));

    observer.unobserve(entry.target);
};

const imgObsever = new IntersectionObserver(loadImg, { root: null, threshold: 0, rootMargin: '200px' });

imgTargets.forEach(img => imgObsever.observe(img));

///SlIDER
//we stored all the fucntionality of our slider to aviod
// polluting the global namespace
const slider = function () {
    //selecting the parent container
    //const slider = document.querySelector('.slider');
    //each slide
    const slides = document.querySelectorAll('.slide');
    //selecting the buttons
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const maxSlideOrLimint = slides.length - 1;
    const dotContainer = document.querySelector('.dots');//the second part the dot
    //varible for the current slide
    let currentSlide = 0;

    const goToSlide = (slide) => {
        slides.forEach((slid, index) => {
            slid.style.transform = `translateX(${100 * (index - slide)}%)`;
        });
    };

    //working on the functionality
    //Next slide
    const nextSlide = () => {
        if (currentSlide === maxSlideOrLimint) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };

    const previusSlide = () => {
        if (currentSlide === 0) {// always true 
            currentSlide = maxSlideOrLimint;// equal to 3 in this example
        } else {
            currentSlide--; //goes like 3-1, 2-1, 1-1 
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };

    //the dots funcionality
    const createDots = () => {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML('beforeend',
                `<button class="dots__dot" data-slide=${i}> </button>`);
        });
    };

    //function to show what slide is active
    const activeDot = (slide) => {
        document.querySelectorAll('.dots__dot').
            forEach(dot => dot.classList.remove('dots__dot--active'));

        //let's add the class just to the current slide
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).
            classList.add('dots__dot--active');
    };

    //the dots functionality using event delegation
    //selecting the common parent
    const dotParent = document.querySelector('.dots');

    dotParent.addEventListener('click', e => {
        if (e.target.classList.contains('dots__dot')) {
            //const slide = e.target.dataset.slide;//the dataset from each btn
            const { slide } = e.target.dataset;//the same but using destructuring
            goToSlide(slide);
            activeDot(slide);
        }
    });

    //the function to initialize the slider functionalities
    const init = () => {
        //when we run the app we call this function//lets put all the imgs side by side
        // 1:0%, 2:100%, 3:200%
        goToSlide(0);
        createDots();
        activeDot(0);//the default one
    };

    init();
    //Event handlers 
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', previusSlide);

    document.addEventListener('keydown', function (e) {

        if (e.key.includes('ArrowRight')) nextSlide();
        else if (e.key.includes('ArrowLeft')) previusSlide();
    });
};

slider();

//cookie message
//create, insert and delete elements
/* const message = document.createElement('div');
message.textContent = `We use cookied for improved funcionality and analytics.`;
message.classList.add('cookie-message');

message.innerHTML = `We use cookied for improved funcionality and analytics.
<button class="btn btn--close-cookie">Got it</button>`; */

//header.append(message);
//header.before(message)
//header.after(message)

//document.querySelector('.btn--close-cookie').addEventListener('click', () => { message.remove(); });

//styles
/* message.style.backgroundColor = '#37383d';

//atributes
const logo = document.querySelector('.nav__logo'); */
//console.log(logo.alt); //the alternative text
//console.log(logo.src);

/* //Implementing the smooth scroll
const btnScrollTo = document.querySelector('.btn--scroll-to');//the button

const section1 = document.querySelector('#section--1');//the secction where the button its gonna show

btnScrollTo.addEventListener('click', () => {
    section1.scrollIntoView({ behavior: 'smooth' });
}); */

//events in js
/*
//all scholl
const h1 = document.querySelector('h1');
h1.onmouseenter =  (e) => {  //works like the hover over from CSS
    alert('addEvent listener');
}; */

//new way
/* const h1 = document.querySelector('h1');

const alertH1 = () => {
    alert('hi');
    //  h1.removeEventListener('mouseenter',alertH1);//how to revome an event after has happened
};

h1.addEventListener('mouseenter', alertH1);//works like the hover over from CSS

//to remove the event listener after  3 seconds, but the user have to click on the alert to remove the popup
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); */


/// rgb(255,255,255)
//creating a randow color
/* const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`; */
//console.log(randomColor());

//Let's attached the event handler to the first link feature from the nav bar
//and then to the parent element as well
//nav__link is an anchor tag and nav__links is an Ul unorder List tag
//the ul is the parent and the a its a child from this elements

/* document.querySelector('.nav__link').addEventListener('click', function(e){
    e.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log(`link ${e.target} currentTarget: `, e.currentTarget);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log(`link ${e.target} currentTarget: `, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
    e.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log(`link ${e.target} currentTarget: `, e.currentTarget);
}); */

/* DOM TRAVERSING  193 */
const h1 = document.querySelector('h1');

//going downwards: child
h1.firstElementChild.style.color = '#fff';
//h1.lastElementChild.style.color = 'orangered';

//console.log(h1.querySelectorAll('.highlight'))
//console.log(h1.childNodes);
//console.log(h1.children);

//going upwards: parent elements
//h1.closest('.header').style.background = 'var(--gradient-secondary)';

//sideways: siblings
//console.log(h1.previousElementSibling)
//console.log(h1.nextElementSibling);

//LifeCycle DOM Events
//DOM content loaded

document.addEventListener('DOMContentLoaded', function (e) {
    console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
    console.log('Page fully loaded', e);
});

/* window.addEventListener('beforeunload', function (e) {
    //for some browers no for chrome
    e.preventDefault();
    console.log(e);
    e.returnValue = '';
}); */