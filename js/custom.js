(function() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });
})();

(function() {
  var nav = document.getElementById('nav'),
      navTabs = Array.prototype.slice.call(nav.querySelectorAll('li')),
      selectedTab;

  nav.addEventListener('focusin', function (event) {
    if (event.target !== nav) return;
    nav.setAttribute('tabindex', -1);
    document.body.addEventListener('keydown', tabKeyboardNavigation);

    var activeTab = nav.querySelector('li.is-active');
    focusTab(activeTab);
    selectedTab = activeTab;
  });

  nav.addEventListener('focusout', function (event) {
    if (event.relatedTarget && !navTabs.includes(event.relatedTarget)) {
      document.body.removeEventListener('keydown', tabKeyboardNavigation);
      nav.setAttribute('tabindex', 0);
      focusTab(null);
      selectedTab = null;
    }
  });

  navTabs.forEach(function (navEl) {
    navEl.onclick = function () {
      toggleTab(this.id, this.dataset.target);
    };
  });

  function toggleTab(selectedNav, targetId) {
    navTabs.forEach(function (navEl) {
      if (navEl.id == selectedNav) {
        navEl.classList.add("is-active");
        focusTab(navEl);
        selectedTab = navEl;
      } else {
        if (navEl.classList.contains("is-active")) {
          navEl.classList.remove("is-active");
        }
      }
    });

    var tabs = document.querySelectorAll(".tab-pane");

    tabs.forEach(function (tab) {
      if (tab.id == targetId) {
        tab.style.display = "block";
      } else {
        tab.style.display = "none";
      }
    });
  }

  function tabKeyboardNavigation(event) {
    if (!(['Space', 'Enter', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.code))) return;
    event.preventDefault();
    switch (event.code) {
      case 'Space':
      case 'Enter':
        toggleTab(selectedTab.id, selectedTab.dataset.target);
        break;
      case 'ArrowRight':
        changeSelectedTab(1);
        break;
      case 'ArrowLeft':
        changeSelectedTab(-1);
        break;
      case 'Home':
        selectedTab = navTabs[0];
        focusTab(selectedTab);
        break;
      case 'End':
        selectedTab = navTabs[navTabs.length - 1];
        focusTab(selectedTab);
        break;
      default:
        break;
    }
  }

  function changeSelectedTab(inc) {
    var index = navTabs.indexOf(selectedTab);
    selectedTab = navTabs[(index + inc + navTabs.length) % navTabs.length];
    focusTab(selectedTab);
  }

  function focusTab(tab) {
    navTabs.forEach(function(navEl) {
      navEl.setAttribute('tabindex', (navEl === tab) ? 0 : -1);
      navEl.setAttribute("aria-selected", !!navEl.classList.contains("is-active"));
    });
    if (tab) {
      tab.focus();
    }
  }

})();