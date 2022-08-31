// Logging Function
firebase.auth().onAuthStateChanged((user) => {
    console.log(user)
    if (user.uid == 'yR1wE7Vhd1Scgd7IPHHi91UehrR2') {
        location.replace("home.html")
    }
})

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault()
})

// Login Function
function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            Toast.fire({ icon: 'error', title: error.message });
        })
}

// Forget Password Function
function forgotPass() {
    var email = 'r.k2962002@gmail.com';
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            Toast.fire({ icon: 'success', title: 'Reset link sent to your email id' });
        })
        .catch((error) => {
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