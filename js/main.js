;(function(window) {
	'use strict';

	let support = {transitions: Modernizr.csstransitions},
		// transition end event name
		transEndEventNames = {'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend'},
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		onEndTransition = function (el, callback) {
			let onEndCallbackFn = function (ev) {
				if (support.transitions) {
					if (ev.target != this) return;
					this.removeEventListener( transEndEventName, onEndCallbackFn );
				}
				if (callback && typeof callback === 'function') callback.call(this);
			};
			if (support.transitions) {
				el.addEventListener(transEndEventName, onEndCallbackFn);
			} else {
				onEndCallbackFn();
			}
		},
		// the pages wrapper
		stack = document.querySelector('.pages-stack'),
		// the page elements
		pages = [].slice.call(stack.children),
		// total number of page elements
		pagesTotal = pages.length,
		// index of current page
		current = 0,
		// menu button
		menuCtrl = document.querySelector('button.menu-button'),
		// the navigation wrapper
		nav = document.querySelector('.pages-nav'),
		// the menu nav items
		navItems = [].slice.call(nav.querySelectorAll('.link-page')),
		// check if menu is open
		isMenuOpen = false;

	function init() {
		buildStack();
		initEvents();
	}

	function buildStack() {
		let stackPagesIdxs = getStackPagesIdxs();

		// set z-index, opacity, initial transforms to pages and add class page-inactive to all except the current one
		for (let i = 0; i < pagesTotal; ++i) {
			let page = pages[i];
			let	posIdx = stackPagesIdxs.indexOf(i);

			if (current !== i) {
				page.classList.add('page-inactive');

				if (posIdx !== -1) {
					// visible pages in the stack
					page.style.WebkitTransform = 'translate3d(0, 100%, 0)';
					page.style.transform = 'translate3d(0, 100%, 0)';
				} else {
					// invisible pages in the stack
					page.style.WebkitTransform = 'translate3d(0, 55%, -300px)';
					page.style.transform = 'translate3d(0, 55%, -300px)';		
				}
			} else {
				page.classList.remove('page-inactive');
			}

			page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);
			
			if (posIdx !== -1) {
				page.style.opacity = parseFloat(1 - 0.1 * posIdx);
			} else {
				page.style.opacity = 0;
			}
		}
	}

	// event binding
	function initEvents() {
		// menu button click
		menuCtrl.addEventListener('click', toggleMenu);

		// navigation menu clicks
		navItems.forEach(function (item) {
			// which page to open?
			let pageid = item.getAttribute('href').slice(1);
			item.addEventListener('click', function (ev) {
				ev.preventDefault();
				openPage(pageid);
			});
		});

		// clicking on a page when the menu is open triggers the menu to close again and open the clicked page
		pages.forEach(function (page) {
			let pageid = page.getAttribute('id');
			page.addEventListener('click', function (ev) {
				if (isMenuOpen) {
					ev.preventDefault();
					openPage(pageid);
				}
			});
		});

		// keyboard navigation events
		document.addEventListener('keydown', function (ev) {
			if (!isMenuOpen) return; 
			let keyCode = ev.keyCode || ev.which;
			if (keyCode === 27) closeMenu();
		});

		var acc = document.getElementsByClassName("accordion");
		var i;

		for (i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function() {
				/* Toggle between adding and removing the "active" class,
				to highlight the button that controls the panel */
				this.classList.toggle("active");

				/* Toggle between hiding and showing the active panel */
				var panel = this.nextElementSibling;
				if (panel.style.display === "block") {
					panel.style.display = "none";
				} else {
					panel.style.display = "block";
				}
			});
		}
	}

	// toggle menu fn
	function toggleMenu() {
		if (isMenuOpen) {
			closeMenu();
		} else {
			openMenu();
			isMenuOpen = true;
		}
	}

	// opens the menu
	function openMenu() {
		// toggle the menu button
		menuCtrl.classList.add('menu-button-open');
		// stack gets the class "pages-stack-open" to add the transitions
		stack.classList.add('pages-stack-open');
		// reveal the menu
		nav.classList.add('pages-nav-open');

		// now set the page transforms
		let stackPagesIdxs = getStackPagesIdxs();
		for (let i = 0, len = stackPagesIdxs.length; i < len; ++i) {
			let page = pages[stackPagesIdxs[i]];
			page.style.WebkitTransform = 'translate3d(0, 50%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; // -200px, -230px, -260px
			page.style.transform = 'translate3d(0, 50%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
		}
	}

	// closes the menu
	function closeMenu() {
		// same as opening the current page again
		openPage();
	}

	// opens a page
	function openPage(id) {
		let futurePage = id ? document.getElementById(id) : pages[current],
			futureCurrent = pages.indexOf(futurePage),
			stackPagesIdxs = getStackPagesIdxs(futureCurrent);

		// set transforms for the new current page
		futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
		futurePage.style.transform = 'translate3d(0, 0, 0)';
		futurePage.style.opacity = 1;

		// set transforms for the other items in the stack
		for (let i = 0, len = stackPagesIdxs.length; i < len; ++i) {
			let page = pages[stackPagesIdxs[i]];
			page.style.WebkitTransform = 'translate3d(0,100%,0)';
			page.style.transform = 'translate3d(0,100%,0)';
		}

		// set current
		if (id) current = futureCurrent;
		
		// close menu.
		menuCtrl.classList.remove('menu-button-open');
		nav.classList.remove('pages-nav-open');
		onEndTransition(futurePage, function() {
			stack.classList.remove('pages-stack-open');
			// reorganize stack
			buildStack();
			isMenuOpen = false;
		});
	}

	// gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
	function getStackPagesIdxs(excludePageIdx) {
		let nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
			nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
			idxs = [],

			excludeIdx = excludePageIdx || -1;

		if (excludePageIdx != current) {
			idxs.push(current);
		}
		if (excludePageIdx != nextStackPageIdx) {
			idxs.push(nextStackPageIdx);
		}
		if (excludePageIdx != nextStackPageIdx_2) {
			idxs.push(nextStackPageIdx_2);
		}
		return idxs;
	}

	init();

})(window);