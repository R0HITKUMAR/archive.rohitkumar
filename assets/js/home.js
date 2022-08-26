// Swal.fire({
//     imageUrl: '/files/popup/Website Popup Banner.png',
//     timer: 3000,
//     showConfirmButton: false,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//         toast.addEventListener('mouseenter', Swal.stopTimer)
//         toast.addEventListener('mouseleave', Swal.resumeTimer)
//     },
//     backdrop: `
//     rgba(256,256,256,1)
//     `,
//     imageAlt: 'Welcome'
// })

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

//-------------------------------------( Start of Newsletter Form Functions)------------------------------------//

$('#newsletterForm').submit(function (e) {
    e.preventDefault();
    var today = new Date().toLocaleString();
    var ID = 'RKS' + Date.now();
    firebase.database().ref('Newsletter-Form/' + ID).set({
        Name: $('#nname').val(),
        Email_ID: $('#nemail').val(),
        Timestamp: today
    });
    sendSubscriptionMail(ID);
    $('#newsletterForm')[0].reset();
    Toast.fire({ icon: 'success', title: 'Subscribed Successfully!' });
    document.getElementById("newsletterSubmitButton").value = "Subscribed";
    document.getElementById("newsletterFormAlertText").innerHTML = "<b>Subscribed Successfully!</b><br>Your Subscription is Registered with Subscribed ID: <b>" + ID + "</b><br>You will also receive a reference mail for the same.";
    document.getElementById("newsletterFormAlert").style.display = "block";
});

function sendSubscriptionMail(ID) {
    var Name = $('#nname').val();
    var SEmail = $('#nemail').val();
    var Body =
        `
        <section style="background-color: rgb(213,232,226);padding: 0px !important;margin:0px !important">
            <center>
                <table style="border: 1px;;width: 90%;">
                    <tr>
                        <th>
                            <img src="https://files.rohitkumar.ml/mail-top.png" width="100%" alt="logo"
                                style="width: 100%;">
                        </th>
                    </tr>
                    <tr>
                        <td><img src="https://files.rohitkumar.ml/subscription.jpg" width="100%"></td>
                    </tr>
                    <tr>
                        <td>
                            <center><br><img src="https://cdn.templates.unlayer.com/assets/1637739231457-ccc.png"
                                    width="10%">
                                <h3>
                                    Dear ${Name} <br>
                                </h3>
                                <h2 style="font-family: 'Trebuchet MS', sans-serif;font-size: 100%;">Thank you for
                                    subscribing to my Newsletter. We will keep you updated with our latest news and offers.
                                </h2>
                                <center>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #4CAF50;margin-bottom: 10px;">
                            <center>
                                <div
                                    style="color: white;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
                                    <h1>
                                        Need Everything Else :<br>
                                        <small>Please feel free to Contact Us:</small>
                                    </h1>
                                    <a style="background-color: #ffee00; border: none; color: rgb(0, 0, 0); padding: 16px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; transition-duration: 0.4s; cursor: pointer;border-radius: 10px;"
                                        href="https://rohitkumar.ml">Click Here</a>
                                    <br>
                                </div><br>
                            </center>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: black;padding: 5% 0;">
                            <center>
                                <div
                                    style="color: white;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: 18px;">
                                    ROHIT KUMAR<br>
                                    <small>mail@rohitkumar.ml | +91 9084950475</small><br>
                                    <small>Ghaziabad, Uttar Pradesh - 201009</small><br>
                                    <div><br>
                                        <a href="https://imrohit.ml/fb" target="_blank"><img
                                                src="https://cdn3.iconfinder.com/data/icons/capsocial-round/500/facebook-512.png"
                                                width="30px"></a>
                                        <a href="https://imrohit.ml/insta" target="_blank"><img
                                                src="https://cdn3.iconfinder.com/data/icons/social-network-30/512/social-03-512.png"
                                                width="30px"></a>
                                        <a href="https://imrohit.ml/linkedin" target="_blank"><img
                                                src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/linkedin_incon-linkedin_logo-linkedin-512.png"
                                                width="30px"></a>
                                        </a>
                                        <a href="https://imrohit.ml/twitter" target="_blank"><img
                                                src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter_colored_svg-512.png"
                                                width="30px"></a>
                                        <a href="https://imrohit.ml/github"
                                            target="_blank"><img
                                                src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Github-512.png"
                                                width="30px"></a>
                                    </div>
                                    <hr width="70%">
                                    <small>Copyright © 2020 Rohit Kumar. All rights reserved.</small><br>
                                    <p style="font-size: 8px;padding: 5%;">
                                        This is a system generated e-mail and please do not reply. Add
                                        no-reply@rohitkumar.ml to your white list / safe sender list. Else, your mailbox
                                        filter or ISP (Internet Service Provider) may stop you from receiving e-mails.
                                    </p>
                                </div>
                            </center>
                        </td>
                    </tr>
                </table>
            </center>
        </section>`;

    Email.send({
        SecureToken: "0702af09-daca-4e05-a87a-8ff2b93b44f0",
        To: SEmail,
        From: "no-reply@rohitkumar.ml",
        Subject: "Thanks for Subscribing Me ",
        Body: Body
    }).then(
        message => {
            console.log(message);
            if (message == 'OK') {
                console.log('Mail Sent');
                // Toast.fire({icon: 'success',title: 'Mail Send Successfully!' })
            }
            else {
                console.error(message);
                // Toast.fire({ icon: 'error', title: message })
            }
        }
    );
}

//-------------------------------------( End of Newsletter Form Functions)------------------------------------//


//-------------------------------------( Start of Contact Form Functions)------------------------------------//

$('#contact-Form').submit(function (e) {
    e.preventDefault();
    var today = new Date().toLocaleString();
    var ID = 'RKQ' + Date.now();
    firebase.database().ref('Contact-Form/' + ID).set({
        Name: $('#cname').val(),
        Email: $('#cemail').val(),
        Phone: $('#cphone').val(),
        Message: $('#cmessage').val(),
        TimeStamp: today,
        Status: $('#cstatus').val()
    });
    sendContactMail(ID);
    $('#contact-Form')[0].reset();
    Toast.fire({ icon: 'success', title: 'Thanks for Contacting Me.' });
    document.getElementById("contactSubmitButton").value = "Submitted";
    document.getElementById("contactFormAlertText").innerHTML = "Thanks For Contacting Me<br>Your Query is Registered with Query ID: <b>" + ID + "</b><br>You will also receive a reference mail for the same.";
    document.getElementById("contactFormAlert").style.display = "block";
});

function sendContactMail(ID) {
    var Name = $('#cname').val();
    var SEmail = $('#cemail').val();
    var Phone = $('#cphone').val();
    var Message = $('#cmessage').val();
    var Body = ` 
    <center><img src="https://files.rohitkumar.ml/mail-top.png" width="100%" alt="Mail Header"></center><br><br><br>
    <center>
    <img src="https://files.rohitkumar.ml/contact.png" width="50%">
    </center><br><br>
    Dear <b>${Name}</b>,<br><br>
    Your Query has been registered Successfully. Your Query ID is <b>${ID}</b>.<br>
    Please use this Query ID for futher Support.<br><br>

    Please Note:<br><br>
    <table style="width:100%;border: 1px solid black;border-collapse: collapse;">
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;width:30%">Query ID</td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${ID}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">Name</td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${Name}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">Phone No.</td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${Phone}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">Email</td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${SEmail}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">Message</td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${Message}</td>
        </tr>
    </table>

    <br><br>
    I will get back to you as soon as possible. You will Receive a Reply for the Same ASAP <br><br>
    <b>Thanks & Regards,</b><br>
    <b>Rohit Kumar</b><br>
    Admin & Owner - <a href="https://rohitkumar.ml">Rohit Kumar</a><br>
    mail@rohitkumar.ml | +91-9084950475<br><br>
    <hr width="100%">
    <small><b>Disclaimer:</b> This is a system generated e-mail and please do not reply. Add no-reply@rohitkumar.ml to
        your white list / safe sender list. Else, your mailbox filter or ISP (Internet Service Provider) may stop you
        from receiving e-mails.</small>
        <br><br><br>
    <center><img src="https://files.rohitkumar.ml/mail-bottom.png" width="100%" alt="Mail Header"></center>     
    `

    Email.send({
        SecureToken: "0702af09-daca-4e05-a87a-8ff2b93b44f0",
        To: SEmail,
        From: "no-reply@rohitkumar.ml",
        Subject: "Contact Query Registered With Query ID: " + ID,
        Body: Body
    }).then(
        message => {
            console.log(message);
            if (message == 'OK') {
                console.log('Mail Sent');
                // Toast.fire({icon: 'success',title: 'Mail Send Successfully!' })
            }
            else {
                console.error(message);
                // Toast.fire({ icon: 'error', title: message })
            }
        }
    );
}


//-------------------------------------( Retrieve Function )------------------------------------//

function getCertificates() {
    firebase.database().ref('Certificates-Form').on('value', function (snapshot) {
        document.getElementById("certificate-table").innerHTML = "";
        var c = 1;
        snapshot.forEach(function (getCertificate) {
            certificate_view = getCertificate.val();
            certificate_id = getCertificate.key;
            if (certificate_view.Verify_Link == "") {
                var verify_link = "-";
            } else {
                var verify_link = `<a class="btn custom-btn custom-btn2 custom-btn-bg custom-btn-link" target="_blank" href="${certificate_view.Verify_Link}">🔗</a>`
            }
            row =
                `<tr>
                <td>${c++}</td>
                <td>${certificate_view.Certificate_Name}</td>
                <td>${certificate_view.Certificate_No}</td>
                <td>${certificate_view.Issuing_Authority}</td>
                <td>${certificate_view.Issue_Date}</td>
                <td> <a class="btn custom-btn custom-btn2 custom-btn-bg custom-btn-link" target="_blank" href="${certificate_view.View_Link}">🔗</a></td>
                <td>${verify_link}</td>
            </tr>`;
            document.getElementById("certificate-table").innerHTML += row;
        });
    });
}

function getProjects() {
    firebase.database().ref('Projects-Form').on('value', function (snapshot) {
        document.getElementById("project-table").innerHTML = "";
        var d = 1;
        snapshot.forEach(function (getProject) {
            project_view = getProject.val();
            project_id = getProject.key;
            row =
                `<tr>
                <td>${d++}</td>
                <td>${project_view.Project_Name}</td>
                <td>${project_view.Project_Domain}</td>
                <td>${project_view.Project_Technology}</td>
                <td>${project_view.Project_Description}</td>
                <td> <a class="btn custom-btn custom-btn2 custom-btn-bg custom-btn-link" href="${project_view.Project_Link}">🔗</a></td>
            </tr>`;
            document.getElementById("project-table").innerHTML += row;
        });
    });
}

