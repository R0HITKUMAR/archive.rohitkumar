// Dashboard Show/Hide Side Navbar
(function ($) {
    "use strict";
    var fullHeight = function () {
        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function () {
            $('.js-fullheight').css('height', $(window).height());
        });
    };
    fullHeight();
    $('#sidebarCollapse').on('click', function () {
        $(this).html('<i class="fa fa-arrow-left"></i>');
        $('#sidebar').toggleClass('active');
    });
})(jQuery);

// Logged In Function
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.replace("index.html")
    }
    document.getElementById("User-Email1").value = user.email
    document.getElementById("User-Email2").value = user.email
    document.getElementById("new-name").value = user.displayName
    document.getElementById("new-phone").value = user.photoURL
})

// Page DOM Functions
function hideSidebar() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('certificates-section').style.display = 'none';
    document.getElementById('projects-section').style.display = 'none';
    document.getElementById('contact-section').style.display = 'none';
    document.getElementById('newsletter-section').style.display = 'none';
    document.getElementById('system-mail').style.display = 'none';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('url-section').style.display = 'none';
}

function viewCertificates() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Certificates'
    })
    getCertificatesDetails();
    document.getElementById('certificates-section').style.display = 'block';
}

function viewProject() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Projects'
    })
    getProjectsDetails();
    document.getElementById('projects-section').style.display = 'block';
}

function viewQuery() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Contact'
    });
    getContactDetails();
    document.getElementById('contact-section').style.display = 'block';
}

function viewNewsletter() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Newsletter'
    })
    document.getElementById('newsletter-section').style.display = 'block';
}

function viewSystemMail() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'System Mail'
    })
    document.getElementById('system-mail').style.display = 'block';
}

function viewProfile() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Profile'
    })
    document.getElementById('profile-section').style.display = 'block';
}

function viewlink() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Profile'
    })
    document.getElementById('url-section').style.display = 'block';
}

function exit() {
    hideSidebar();
    Toast.fire({
        icon: 'success',
        title: 'Dashboard'
    })
    document.getElementById('dashboard-section').style.display = 'block';
}

// Dashboard Stats
firebase.database().ref('Certificates-Form').on('value', (snap) => {
    document.getElementById('total-certificates').innerHTML = snap.numChildren();
})
firebase.database().ref('Projects-Form').on('value', (snap) => {
    document.getElementById('total-projects').innerHTML = snap.numChildren();
})
firebase.database().ref('Contact-Form').on('value', (snap) => {
    document.getElementById('total-contactqueries').innerHTML = snap.numChildren();
})
firebase.database().ref('Mailbox').on('value', (snap) => {
    document.getElementById('total-mails').innerHTML = snap.numChildren();
})
firebase.database().ref('Newsletter-Form').on('value', (snap) => {
    document.getElementById('total-newsletter').innerHTML = snap.numChildren();
    counterUpdate();
})

//Counter Section
function counterUpdate() {
    $('.counter').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}

// Logout Function with Prompt
function logoutwithprompt() {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure you want to logout?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().signOut()
        }
    })
}

function logout() {
    firebase.auth().signOut()
}

// Change Password Function
function changePass() {
    document.getElementById("changePassButton").disabled = true;
    document.getElementById("changePassButton").value = 'Loading..';
    const user = firebase.auth().currentUser;
    const newPassword = document.getElementById("new-password").value;

    user.updatePassword(newPassword).then(() => {
        Toast.fire({ icon: 'success', title: 'Password Updated Successfully!' });
        document.getElementById("changePassButton").value = 'Successful';
        setTimeout(logout, 5000)

    }).catch((error) => {
        document.getElementById("changePassButton").value = 'Try Again';
        Toast.fire({ icon: 'error', title: error.message });
    });
}

// Update Email Function
function updateemail() {
    document.getElementById("updateemailButton").disabled = true;
    document.getElementById("updateemailButton").value = 'Loading..';
    const user = firebase.auth().currentUser;
    const email = document.getElementById("newemail").value
    if (email == "") {
        Toast.fire({ icon: 'error', title: 'Please Enter a Valid Email ID' });
        return false;
    }
    user.updateEmail(email).then(() => {
        Toast.fire({ icon: 'success', title: 'Email Updated Successfully!' });
        window.setTimeout(function () { location.reload() }, 3000)
    }).catch((error) => {
        Toast.fire({ icon: 'error', title: error.message });
    });
}

// Update Name Function
function updatename() {
    document.getElementById("updatenameButton").disabled = true;
    document.getElementById("updatenameButton").value = 'Loading..';
    const user = firebase.auth().currentUser;
    const name = document.getElementById("new-name").value
    if (name == "") {
        Toast.fire({ icon: 'error', title: 'Please Enter a Valid Name' });
        return false;
    }
    user.updateProfile({
        displayName: name
    }).then(() => {
        Toast.fire({ icon: 'success', title: 'Name Updated Successfully!' });
    }).catch((error) => {
        Toast.fire({ icon: 'error', title: error.message });
    });
}

//Update Phone No
function updatephone() {
    document.getElementById("updatephoneButton").disabled = true;
    document.getElementById("updatephoneButton").value = 'Loading..';
    const user = firebase.auth().currentUser;
    const phone = document.getElementById("new-phone").value
    if (phone == "") {
        Toast.fire({ icon: 'error', title: 'Please Enter a Valid Phone Number' });
        return false;
    }
    user.updateProfile({
        photoURL: phone
    }).then(() => {
        Toast.fire({ icon: 'success', title: 'Phone Number Updated Successfully!' });
    }).catch((error) => {
        Toast.fire({ icon: 'error', title: error.message });
    });
}

// SweetAlert Initialization
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })