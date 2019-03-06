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

var usersList = [];

function saveUser() {
  var form = document.forms.register,
      user = new User();

  for (var prop in user) {
    if (user.hasOwnProperty(prop)) {
      user[prop] = form.elements[prop].value;
    }
  }

  user.validate();

  for (var prop in user) {
    if (user.hasOwnProperty(prop)) {
        updateFieldValidity(form.elements[prop], user.errors[prop]);
    }
  }

  var validationMessage = document.getElementById('form-validation-live');

  if (user.isValid) {
    usersList.push(user);
    validationMessage.innerText = '';
    form.reset();
    notify();
  } else {
    var errorFields = Array.from(Object.keys(user.errors));
    validationMessage.innerText = 'The following form fields are invalid: ' + errorFields.join(', ');
    form.elements[errorFields[0]].focus();
  }
}

function updateFieldValidity(field, error) {
  var parent = field.parentNode,
    icon = parent.querySelector('.error-icon'),
    message = document.getElementById(field.id + '-error');

  if (!message) return;

  if (error) {
    field.classList.add('is-danger');
    field.setAttribute('aria-invalid', true);
    icon.classList.remove('hidden');
    message.innerText = error;
  } else {
    field.classList.remove('is-danger');
    field.setAttribute('aria-invalid', false);
    icon.classList.add('hidden');
    message.innerText = '';
  }
}

function notify() {
  var popup = document.getElementById('live-area');
  popup.classList.remove('visuallyhidden');
  popup.innerText = 'User was successfully saved';
  setTimeout(function() {
    popup.classList.add('visuallyhidden');
    popup.innerText = '';
  }, 5000);
}

function User(username, name, surname, address, zipcode, phone, email) {
  this.username = username;
  this.name = name;
  this.surname = surname;
  this.address = address;
  this.zipcode = zipcode;
  this.phone = phone;
  this.email = email;

  Object.defineProperties(this, {
    'isValid': {
      value: true,
      writable: true
    },
    'errors': {
      value: {},
      writable: true
    }
  });
}

User.prototype.validate = function() {
  this.errors = {};
  this.isValid = true;

  for (var prop in this) {
    if (this.hasOwnProperty(prop) && prop !== 'zipcode') {
      if (!this[prop]) {
        this.isValid = false;
        this.errors[prop] = 'This field is required';
      } else {
        switch (prop) {
          case 'username':
            var username = this.username,
                existingUser = usersList.find(function(item) {
              return item.username === username;
            });
            if (existingUser) {
              this.isValid = false;
              this.errors.username = 'User with this username already exists in database';
            }
            break;
          case 'phone':
            if (!isNumeric(this.phone)) {
              this.isValid = false;
              this.errors.phone = 'Only digits allowed';
            }
            break;
          case 'email':
            if (!isValidEmail(this.email)) {
              this.isValid = false;
              this.errors.email = 'Please enter valid email';
            }
        }
      }
    }
  }
}

function isNumeric(value) {
  return /^[0-9]*$/.test(value);
}

function isValidEmail(value) {
  return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
}