/* ===================================================================
 *  Knox 1.0.0 - Main JS
 *
 *
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';

    html.className = html.className.replace(/\bno-js\b/g, '') + 'js';

    const cfg = {

        // Countdown Timer Final Date
        finalDate : 'December 04, 2025 00:00:00',
        // MailChimp URL
        mailChimpURL : 'https://facebook.us1.list-manage.com/subscribe/post?u=1abf75f6981256963a47d197a&amp;id=37c6d8f4d6' 

    };



   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const body = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        const details = document.querySelector('.s-details');

        if (!(preloader && details)) return;

        window.addEventListener('load', function() {

            body.classList.remove('ss-preload');
            body.classList.add('ss-loaded');

            // page scroll position to top
            preloader.addEventListener('transitionstart', function gotoTop(e) {
                if (e.target.matches('#preloader')) {
                    window.scrollTo(0, 0);
                    preloader.removeEventListener(e.type, gotoTop);
                }
            });

            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    details.style.bottom = (window.innerHeight - details.offsetHeight) + 'px';
                    body.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });

        });

        window.addEventListener('beforeunload' , function() {
            body.classList.remove('ss-show');
        });
    };




   /* Modal
    * ---------------------------------------------------- */ 
    const ssModal = function() {

        const modal = document.querySelector('.ss-modal');
        const trigger = document.querySelector('.ss-modal-trigger');
        const closeButton = document.querySelector('.ss-modal__close');

        if (!(modal && trigger && closeButton)) return;

        function toggleModal() {
            modal.classList.toggle('show-modal');
        }
        function windowOnClick(event) {
            if (event.target === modal) {
                toggleModal();
            }
        }
        function pressEsc(event) {
            event = event || window.event;

            if (event.keyCode =='27') {
                modal.classList.remove('show-modal');
            }
        }

        trigger.addEventListener('click', toggleModal);
        closeButton.addEventListener('click', toggleModal);
        window.addEventListener('click', windowOnClick);
        window.addEventListener('keyup', pressEsc);

    }; 



   /* Tabs
    * ---------------------------------------------------- */ 
    const sstabs = function(nextTab = false) {

        const tabList = document.querySelector('.tab-nav__list');
        const tabPanels = document.querySelectorAll('.tab-content__item');
        const tabItems = document.querySelectorAll('.tab-nav__list li');
        const tabLinks = [];

        if (!(tabList && tabPanels)) return;

        const tabClickEvent = function(tabLink, tabLinks, tabPanels, linkIndex, e) {
    
            // Reset all the tablinks
            tabLinks.forEach(function(link) {
                link.setAttribute('tabindex', '-1');
                link.setAttribute('aria-selected', 'false');
                link.parentNode.removeAttribute('data-tab-active');
                link.removeAttribute('data-tab-active');
            });
    
            // set the active link attributes
            tabLink.setAttribute('tabindex', '0');
            tabLink.setAttribute('aria-selected', 'true');
            tabLink.parentNode.setAttribute('data-tab-active', '');
            tabLink.setAttribute('data-tab-active', '');
    
            // Change tab panel visibility
            tabPanels.forEach(function(panel, index) {
                if (index != linkIndex) {
                    panel.setAttribute('aria-hidden', 'true');
                    panel.removeAttribute('data-tab-active');
                } else {
                    panel.setAttribute('aria-hidden', 'false');
                    panel.setAttribute('data-tab-active', '');
                }
            });

            window.dispatchEvent(new Event("resize"));

        };
    
        const keyboardEvent = function(tabLink, tabLinks, tabPanels, tabItems, index, e) {

            let keyCode = e.keyCode;
            let currentTab = tabLinks[index];
            let previousTab = tabLinks[index - 1];
            let nextTab = tabLinks[index + 1];
            let firstTab = tabLinks[0];
            let lastTab = tabLinks[tabLinks.length - 1];
    
            // ArrowRight and ArrowLeft are the values when event.key is supported
            switch (keyCode) {
                case 'ArrowLeft':
                case 37:
                    e.preventDefault();
    
                    if (!previousTab) {
                        lastTab.focus();
                    } else {
                        previousTab.focus();
                    }
                    break;
    
                case 'ArrowRight':
                case 39:
                    e.preventDefault();
    
                    if (!nextTab) {
                        firstTab.focus();
                    } else {
                        nextTab.focus();
                    }
                    break;
            }
    
        };


        // Add accessibility roles and labels
        tabList.setAttribute('role','tablist');
        tabItems.forEach(function(item, index) {
    
            let link = item.querySelector('a');
    
            // collect tab links
            tabLinks.push(link);
            item.setAttribute('role', 'presentation');
    
            if (index == 0) {
                item.setAttribute('data-tab-active', '');
            }
    
        });
    
        // Set up tab links
        tabLinks.forEach(function(link, i) {
            let anchor = link.getAttribute('href').split('#')[1];
            let attributes = {
                'id': 'tab-link-' + i,
                'role': 'tab',
                'tabIndex': '-1',
                'aria-selected': 'false',
                'aria-controls': anchor
            };
    
            // if it's the first element update the attributes
            if (i == 0) {
                attributes['aria-selected'] = 'true';
                attributes.tabIndex = '0';
                link.setAttribute('data-tab-active', '');
            };
    
            // Add the various accessibility roles and labels to the links
            for (var key in attributes) {
                link.setAttribute(key, attributes[key]);
            }
                  
            // Click Event Listener
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
          
            // Click Event Listener
            link.addEventListener('focus', function(e) {
                tabClickEvent(this, tabLinks, tabPanels, i, e);
            });
    
            // Keyboard event listener
            link.addEventListener('keydown', function(e) {
                keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
            });
        });
    
        // Set up tab panels
        tabPanels.forEach(function(panel, i) {
    
            let attributes = {
                'role': 'tabpanel',
                'aria-hidden': 'true',
                'aria-labelledby': 'tab-link-' + i
            };
          
            if (nextTab) {
                let nextTabLink = document.createElement('a');
                let nextTabLinkIndex = (i < tabPanels.length - 1) ? i + 1 : 0;

                 // set up next tab link
                nextTabLink.setAttribute('href', '#tab-link-' + nextTabLinkIndex);
                nextTabLink.textContent = 'Next Tab';
                panel.appendChild(nextTabLink);
            }
               
            if (i == 0) {
                attributes['aria-hidden'] = 'false';
                panel.setAttribute('data-tab-active', '');
            }
    
            for (let key in attributes) {
                panel.setAttribute(key, attributes[key]);
            }
        });
    };



   /* Smooth Scrolling
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; 



   /* Back to Top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
 
        const pxShow = 800;
        const goTopButton = document.querySelector('.ss-go-top');

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add('link-is-visible');

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add('link-is-visible')
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });
    }; 



   /* Revealing Effect
    * ---------------------------------------------------- */ 
    const ssRevealingEffect = function() {

        const intro = document.querySelector('.s-intro');
        const details = document.querySelector('.s-details');

        if (!(intro && details)) return;

        const checkpoint = intro.offsetHeight;
        let opacity;

        details.style.bottom = (window.innerHeight - details.offsetHeight) + 'px';

        window.addEventListener('resize', function() {
            details.style.bottom = (window.innerHeight - details.offsetHeight) + 'px';
        });

        window.addEventListener('scroll', function() {

            const currentScroll = window.pageYOffset;

            if (currentScroll <= checkpoint) {
                opacity = 1 - currentScroll / checkpoint;
            } else {
                opacity = 0;
            }

            details.style.setProperty('--overlay-opacity', opacity);
        });

    };


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssModal();
        sstabs();
        ssMoveTo();
        ssBackToTop();
        ssRevealingEffect();

    })();

})(document.documentElement);