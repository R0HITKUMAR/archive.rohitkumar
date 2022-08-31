//Initialize Function
getCertificatesDetails();
getProjectsDetails();
getContactDetails();
getNewsletterDetails();
getMails();

//------------------------------------( Start of Certificates Forms Functions )------------------------------------//

//Certificate Form Functions
$('#certificates-Form').submit(function (e) {
    e.preventDefault();
});

function recordNewCertificate() {
    var ID = 'RKCID' + Date.now();
    var Alert = document.getElementById("certificatesFormAlert");
    firebase.database().ref('Certificates-Form/' + ID).set({
        Certificate_Name: $('#certificate_name').val(),
        Certificate_No: $('#certificate_no').val(),
        Issue_Date: $('#issue_date').val(),
        Issuing_Authority: $('#issuing_authority').val(),
        View_Link: $('#c-view').val(),
        Verify_Link: $('#verify_link').val()
    });
    $('#certificates-Form')[0].reset();
    AlertText = `
    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
        <strong>Record Added Successfully!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    Alert.innerHTML = AlertText;
    setTimeout(function () { Alert.innerHTML = "" }, 2000);
    document.getElementById("certificatesSubmitButton").value = "Submitted";
    Toast.fire({
        icon: 'success',
        title: 'Record Inserted Successfully!'
    })
    getCertificatesDetails();

}

function resetCertificateForm() {
    $('#certificates-Form')[0].reset();
    document.getElementById("certificatesSubmitButton").classList.remove("d-none");
    document.getElementById("certificatesUpdateButton").classList.add("d-none");
}

//Certificate Data Retrieve Functions
function getCertificatesDetails() {
    firebase.database().ref('Certificates-Form').on('value', function (snapshot) {
        document.getElementById("certificates-table").innerHTML = "";
        var c = 1;
        snapshot.forEach(function (getCertificate) {
            certificate_view = getCertificate.val();
            certificate_id = getCertificate.key;
            if (certificate_view.Verify_Link == "") {
                var verify_link = "-";
            } else {
                var verify_link = `<a class="table_button" href="${certificate_view.Verify_Link}" target="_blank"><i class="fa fa-link"></a>`
            }
            row =
                `<tr>
                <td>${c++}</td>
                <td>${certificate_view.Certificate_Name}</td>
                <td>${certificate_view.Certificate_No}</td>
                <td>${certificate_view.Issuing_Authority}</td>
                <td>${certificate_view.Issue_Date}</td>
                <td><a onclick="ShowAttachment('${certificate_view.View_Link}')" class="table_button" target="_blank"><i class="fa fa-up-right-from-square"></a></td>
                <td>${verify_link}</td>
               <td><span>
               <a class="table_button" onclick="editCertificate('${certificate_id}')"><i class="fa fa-edit"></i></a>
               <a class="table_button" onclick="deleteCertificate('${certificate_id}')"><i class="fa fa-trash"></i></a></span>
               </td>
            </tr>`;
            document.getElementById("certificates-table").innerHTML += row;
        });
    });
}

//Data Table Intialization
function datatableCertificates() {
    var status = document.getElementById("certificate-datatable").checked;
    if (status == true) {
        $('#certificatesTable').DataTable({
            "order": [[0, "desc"]],
            "pageLength": 40,
            dom: 'Bfrtip',
            paging: false,
            destroy: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ]
        });
    } else {
        $('#certificatesTable').DataTable().destroy();
    }
}

//Retrieve Data for Update
function editCertificate(id) {
    $('#addCertificates').collapse('show');
    $('html, body').animate({
        scrollTop: $("#certificates-section").offset().top
    }, 500);
    let certificateRef = firebase.database().ref('Certificates-Form/' + id);
    certificateRef.on('value', function (snapshot) {
        certificate_view = snapshot.val();
        document.getElementById("certificate_id").value = id;
        document.getElementById("certificate_name").value = certificate_view.Certificate_Name;
        document.getElementById("certificate_no").value = certificate_view.Certificate_No;
        document.getElementById("issuing_authority").value = certificate_view.Issuing_Authority;
        document.getElementById("issue_date").value = certificate_view.Issue_Date;
        document.getElementById("c-view").value = certificate_view.View_Link;
        document.getElementById("verify_link").value = certificate_view.Verify_Link;
    });
    document.getElementById("certificatesSubmitButton").classList.add("d-none");
    document.getElementById("certificatesUpdateButton").classList.remove("d-none");
}

//Update Certificates Information
function updateCertificate() {
    var id = document.getElementById("certificate_id").value;
    var certificateRef = firebase.database().ref('Certificates-Form');
    var Alert = document.getElementById("certificatesFormAlert");
    certificateRef.child(id).update({
        Certificate_Name: $('#certificate_name').val(),
        Certificate_No: $('#certificate_no').val(),
        Issuing_Authority: $('#issuing_authority').val(),
        Issue_Date: $('#issue_date').val(),
        View_Link: $('#c-view').val(),
        Verify_Link: $('#verify_link').val()
    });
    AlertText = `
    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
        <strong>Record Updated Successfully!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    Alert.innerHTML = AlertText;
    setTimeout(function () { Alert.innerHTML = "" }, 2000);
    document.getElementById("certificatesUpdateButton").value = "Submitted";
    Toast.fire({
        icon: 'success',
        title: 'Record Updated Successfully!'
    })
    document.getElementById("certificates-Form").reset();
    getCertificatesDetails();
}

function deleteCertificate(Key) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Record!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let certificateRef = firebase.database().ref('Certificates-Form/' + Key);
            certificateRef.remove();
            getCertificatesDetails();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })
}


//------------------------------------( Start of Certificates Forms Functions )------------------------------------//


//------------------------------------( Start of Projects Forms Functions )------------------------------------//

//Projects Form Functions
$('#projects-Form').submit(function (e) {
    e.preventDefault();
});

function addProject() {
    var ID = 'RKPID' + Date.now();
    var Alert = document.getElementById("projectsFormAlert");
    firebase.database().ref('Projects-Form/' + ID).set({
        Project_Name: $('#project-name').val(),
        Project_Domain: $('#project-domain').val(),
        Project_Technology: $('#project-technology').val(),
        Project_Link: $('#project-url').val(),
        Project_Description: $('#project-description').val()
    });
    $('#projects-Form')[0].reset();
    AlertText = `
    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
        <strong>Record Added Successfully!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    Alert.innerHTML = AlertText;
    setTimeout(function () { Alert.innerHTML = "" }, 2000);
    document.getElementById("projectsSubmitButton").value = "Submitted";

    Toast.fire({ icon: 'success', title: 'Record Inserted Successfully!' })
    document.getElementById("projects-Form").reset();
    getProjectsDetails();
}

function resetProjectForm() {
    $('#projects-Form')[0].reset();
    document.getElementById("projectsSubmitButton").classList.remove("d-none");
    document.getElementById("projectupdatebutton").classList.add("d-none");
}

//Retrive Projects Data
function getProjectsDetails() {
    firebase.database().ref('Projects-Form').on('value', function (snapshot) {
        document.getElementById("projects-table").innerHTML = "";
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
                <td width="40%">${project_view.Project_Description}</td>
                <td> <a class="table_button" href="${project_view.Project_Link}"><i class="fa fa-link"></a></td>
               <td><span>
               <a class="table_button" onclick="editProject('${project_id}')"><i class="fa fa-edit"></i></a>
               <a class="table_button" onclick="deleteProject('${project_id}')"><i class="fa fa-trash"></i></a></span>
               </td>
            </tr>`;
            document.getElementById("projects-table").innerHTML += row;
        });
    });
}

//Initialize Projects Datatable
function datatableProjects() {
    var status = document.getElementById("project-datatable").checked;
    if (status == true) {
        $('#projectsTable').DataTable({
            "order": [[0, "desc"]],
            "pageLength": 40,
            dom: 'Bfrtip',
            paging: false,
            destroy: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ]
        });
    } else {
        $('#projectsTable').DataTable().destroy();
    }
}

//Retrive Projects Data for Update
function editProject(id) {
    $('#addProject').collapse('show');
    $('html, body').animate({
        scrollTop: $("#projects-section").offset().top
    }, 500);
    let projectRef = firebase.database().ref('Projects-Form/' + id);
    projectRef.on('value', function (snapshot) {
        project_view = snapshot.val();
        document.getElementById("project-id").value = id;
        document.getElementById("project-name").value = project_view.Project_Name;
        document.getElementById("project-domain").value = project_view.Project_Domain;
        document.getElementById("project-technology").value = project_view.Project_Technology;
        document.getElementById("project-url").value = project_view.Project_Link;
        document.getElementById("project-description").value = project_view.Project_Description;
    });
    document.getElementById("projectsSubmitButton").classList.add("d-none");
    document.getElementById("projectupdatebutton").classList.remove("d-none");
}

//Update Projects Information
function updateProjects() {
    var Alert = document.getElementById("projectsFormAlert");
    var id = document.getElementById("project-id").value;
    var Project_Name = document.getElementById("project-name").value;
    var Project_Domain = document.getElementById("project-domain").value;
    var Project_Technology = document.getElementById("project-technology").value;
    var Project_Link = document.getElementById("project-url").value;
    var Project_Description = document.getElementById("project-description").value;
    let projectsRef = firebase.database().ref('Projects-Form');
    projectsRef.child(id).update({
        Project_Name: Project_Name,
        Project_Domain: Project_Domain,
        Project_Technology: Project_Technology,
        Project_Link: Project_Link,
        Project_Description: Project_Description
    });
    AlertText = `
    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
        <strong>Record Updated Successfully!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
    Alert.innerHTML = AlertText;
    setTimeout(function () { Alert.innerHTML = "" }, 2000);
    Toast.fire({ icon: 'success', title: 'Record Updated Successfully!' })
    document.getElementById("projects-Form").reset();
    document.getElementById("projects-table").innerHTML = "";
    getProjectsDetails();
}

//Delete Projects Information
function deleteProject(Key) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Record!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let projectRef = firebase.database().ref('Projects-Form/' + Key);
            projectRef.remove();
            getProjectsDetails();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })
}

//------------------------------------( End of Projects Forms Functions )------------------------------------//

//------------------------------------( Start of Query Functions )------------------------------------//

// Retrive Query Data
function getContactDetails() {
    firebase.database().ref('Contact-Form').on('value', function (snapshot) {
        document.getElementById("contact-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (getInfo) {
            info_view = getInfo.val();
            info_id = getInfo.key;
            row =
                `<tr>
                <td>${e++}</td>
                <td>${info_view.TimeStamp}</td>
                <td>${info_view.Name}</td>
                <td>${info_view.Email}</td>
                <td>${info_view.Phone}</td>
                <td width="30%">${info_view.Message}</td>
                <td>${info_view.Status}</td>
                <td>
                <span>
                    <a class="table_button" onclick="updataContactStatus('${info_id}')"><i class="fa fa-edit"></i></a>
                    <a class="table_button" onclick="deleteContactData('${info_id}')"><i class="fa fa-trash"></i></a>
                </span>
                </td>
                </tr>`;
            document.getElementById("contact-table").innerHTML += row;
        });
    });
}

//Initialize Query Datatable
function datatableContact() {
    var status = document.getElementById("contact-datatable").checked;
    if (status == true) {
        $('#contactTable').DataTable({
            "order": [[0, "desc"]],
            "pageLength": 40,
            dom: 'Bfrtip',
            paging: false,
            destroy: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ]
        });
    } else {
        $('#contactTable').DataTable().destroy();
    }
}

//Retrive Query Data for Update
function updataContactStatus(id) {
    let message = prompt("Please Enter Status", "Received");
    var status = document.getElementById("sendMailAlert").checked;
    if (message != null) {
        let msgRef = firebase.database().ref('Contact-Form');
        msgRef.child(id).update({
            "Status": message
        });
        document.getElementById("contact-table").innerHTML = "";
        if (status == true) {
            sendQueryUpdateMail(id);
        }
        getContactDetails();

    }
    Toast.fire({ icon: 'success', title: 'Status Updated Successfully!' });
    getContactDetails();
}

//Send Query Update Email
function sendQueryUpdateMail(ID) {
    var TimeStamp = new Date().toLocaleString();
    firebase.database().ref('Contact-Form/' + ID).once('value').then(function (snapshot) {
        var name = snapshot.val().Name;
        var SEmail = snapshot.val().Email;
        var phone = snapshot.val().Phone;
        var message = snapshot.val().Message;
        var update = snapshot.val().Status;
        var Body =
            `
            <center><img src="https://files.rohitkumar.ml/mail-top.png" width="100%" alt="Mail Header"></center><br><br><br>
        Dear <b>${name}</b>,<br><br>
        There is a Update on Your Query with  <b>Query ID : ${ID}</b>  [${TimeStamp}] .<br><br>
    
        Please Note:<br><br>
        <table style="width:100%;border: 1px solid black;border-collapse: collapse;">
            <tr>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;;width:30%"><b>Query ID</b></td>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${ID}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Name</b></td>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${name}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Phone No.</b></td>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${phone}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Email</b></td>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${SEmail}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Message</b></td>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${message}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Update</b></td>
                <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${update}</td>
            </tr>
        </table>
        <br><br>
        <b>Thanks & Regards,</b><br>
        <b>Rohit Kumar</b><br>
        Admin & Owner - <a href=https://rohitkumar.ml>Rohit Kumar</a><br>
        mail@rohitkumar.ml | +91-9084950475<br><br>
        <hr width=100%>
        <small><b>Disclaimer:</b> This is a system generated e-mail and please do not reply. Add no-reply@rohitkumar.ml to
            your white list / safe sender list. Else, your mailbox filter or ISP (Internet Service Provider) may stop you
            from receiving e-mails.</small><br><br><br>
            <center><img src="https://files.rohitkumar.ml/mail-bottom.png" width="100%" alt="Mail Header"></center> `

        Email.send({
            SecureToken: "0702af09-daca-4e05-a87a-8ff2b93b44f0",
            To: SEmail,
            From: "no-reply@rohitkumar.ml",
            Subject: "Regarding Update on Query With Query ID: " + ID,
            Body: Body
        }).then(
            message => {
                console.log(message);
                if (message == 'OK') {
                    console.log('Mail Sent');
                    Toast.fire({ icon: 'success', title: 'Update Mail Send Successfully' });
                }
                else {
                    console.error(message);
                    Toast.fire({ icon: 'error', title: message });
                }
            }
        );
    });
}


//Delete Query Data
function deleteContactData(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Record!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            var status = document.getElementById("sendMailAlert").checked;
            if (status == true) {
                sendQueryDeleteMail(id);
            }
            var messagesRef = firebase.database().ref('Contact-Form/' + id);
            messagesRef.remove();
            getContactDetails();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })
}

//Send Deletion Mail
function sendQueryDeleteMail(ID) {
    var TimeStamp = new Date().toLocaleString();
    firebase.database().ref('Contact-Form/' + ID).once('value').then(function (snapshot) {
        var name = snapshot.val().Name;
        var SEmail = snapshot.val().Email;
        var phone = snapshot.val().Phone;
        var message = snapshot.val().Message;
        var update = snapshot.val().Status;
        var Body =
            `
    <center><img src="https://files.rohitkumar.ml/mail-top.png" width="100%" alt="Mail Header"></center><br><br><br>
    Dear <b>${name}</b>,<br><br>
    Your Query with <b> Query ID : ${ID}</b> [${TimeStamp}] has been deleted Successfully..<br><br>

    Please Note:<br><br>
    <table style="width:100%;border: 1px solid black;border-collapse: collapse;">
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;;width:30%"><b>Query ID</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${ID}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Name</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${name}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Phone No.</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${phone}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Email</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${SEmail}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Message</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${message}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Final Update</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${update}</td>
        </tr>
    </table>
    <br><br>
    <b>Thanks & Regards,</b><br>
    <b>Rohit Kumar</b><br>
    Admin & Owner - <a href=https://rohitkumar.ml>Rohit Kumar</a><br>
    mail@rohitkumar.ml | +91-9084950475<br><br>
    <hr width=100%>
    <small><b>Disclaimer:</b> This is a system generated e-mail and please do not reply. Add no-reply@rohitkumar.ml to
        your white list / safe sender list. Else, your mailbox filter or ISP (Internet Service Provider) may stop you
        from receiving e-mails.</small><br><br><br>
        <center><img src="https://files.rohitkumar.ml/mail-bottom.png" width="100%" alt="Mail Header"></center>`

        Email.send({
            SecureToken: "0702af09-daca-4e05-a87a-8ff2b93b44f0",
            To: snapshot.val().Email,
            From: "no-reply@rohitkumar.ml",
            Subject: "Regarding Deletion of Query With Query ID: " + ID,
            Body: Body
        }).then(
            message => {
                console.log(message);
                if (message == 'OK') {
                    console.log('Mail Sent');
                    Toast.fire({ icon: 'success', title: 'Deletion Mail Send Successfully' })
                }
                else {
                    console.error(message);
                    Toast.fire({ icon: 'error', title: message })
                }
            }
        );
    });
}

//------------------------------------( End of Query Functions )------------------------------------//


//------------------------------------( Start of Newsletter Functions )------------------------------------//

//Retrive Newsletter Data
function getNewsletterDetails() {
    firebase.database().ref('Newsletter-Form').on('value', function (snapshot) {
        document.getElementById("newsletter-table").innerHTML = "";
        var e = 1;
        snapshot.forEach(function (getInfo) {
            info_view = getInfo.val();
            info_id = getInfo.key;
            row =
                `<tr>
                <td>${e++}</td>
                <td>${info_view.Timestamp}</td>
                <td>${info_view.Name}</td>
                <td>${info_view.Email_ID}</td>
                <td>
                <span>
                    <a class="table_button" onclick="deleteSubscription('${info_id}')"><i class="fa fa-trash"></i></a>
                </span>
                </td>
                </tr>`;
            document.getElementById("newsletter-table").innerHTML += row;
        });
    });
}

//Initiate Newsletter Datatable
function datatableNewsletter() {
    var status = document.getElementById("newsletter-datatable").checked;
    if (status == true) {
        $('#newsletterTable').DataTable({
            "order": [[0, "desc"]],
            "pageLength": 40,
            dom: 'Bfrtip',
            paging: false,
            destroy: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ]
        });
    } else {
        $('#newsletterTable').DataTable().destroy();
    }
}

//Delete Newsletter
function deleteSubscription(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Record!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            var messagesRef = firebase.database().ref('Newsletter-Form/' + id);
            messagesRef.remove();
            getContactDetails();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })

}

//------------------------------------( End of Newsletter Functions )------------------------------------//


//------------------------------------( Start of System Mail Functions )------------------------------------//

// System Mail Attachment
function showAttachmentUpload() {
    if (document.getElementById("include-attachemnt").checked == true) {
        document.getElementById("mail-attachment-div").classList.remove("d-none");
    }
    else {
        document.getElementById("mail-attachment-div").classList.add("d-none");
    }
}

//Send System Mail
function sendSystemMail() {
    var Alert = document.getElementById("mailing-alert");
    var TimeStamp = new Date().toLocaleString();
    var ID = 'RKMAIL' + Date.now();
    var Name = document.getElementById("mail-name").value || "User";
    var RTo = document.getElementById("mail-to").value;
    var Subject = document.getElementById("mail-subject").value;
    var Sub = "Mail From Admin (rohitkumar.ml)" + " - " + Subject;
    var Message = document.getElementById("mail-message").value;
    var filename = document.getElementById("file-name").value;
    var fileurl = document.getElementById("file-url").value;
    var Body =
        `
    <center><img src="https://files.rohitkumar.ml/mail-top.png" width="100%" alt="Mail Header"></center><br><br><br>
    Dear <b>${Name}</b>,<br><br>
    This is a Communication Mail from Rohit Kumar (rohitkumar.ml)<br><br>

    Please Note:<br><br>
    <table style="width:100%;border: 1px solid black;border-collapse: collapse;">
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;;width:30%"><b>Timestamp</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${TimeStamp}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Subject</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${Subject}</td>
        </tr>
        <tr>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;"><b>Message</b></td>
            <td style="border: 1px solid black;border-collapse: collapse;padding: 0.2%;">${Message}</td>
        </tr>
    </table>
    <br><br>
    <b>Thanks & Regards,</b><br>
    <b>Rohit Kumar</b><br>
    Admin & Owner - <a href=https://rohitkumar.ml>Rohit Kumar</a><br>
    mail@rohitkumar.ml | +91-9084950475<br><br>
    <hr width=100%>
    <small><b>Disclaimer:</b> This is a system generated e-mail and please do not reply. Add no-reply@rohitkumar.ml to
        your white list / safe sender list. Else, your mailbox filter or ISP (Internet Service Provider) may stop you
        from receiving e-mails.</small><br><br><br>
    <center><img src="https://files.rohitkumar.ml/mail-bottom.png" width="100%" alt="Mail Header"></center>    
    `

    Email.send({
        SecureToken: "0702af09-daca-4e05-a87a-8ff2b93b44f0",
        To: RTo,
        From: "no-reply@rohitkumar.ml",
        Subject: Sub,
        Body: Body,
        Attachments: [
            {
                name: filename || "Attachment.png",
                path: fileurl || 'https://rohitkumar.ml/assets/img/logo-nobg.png'
            }]
    }).then(
        message => {
            console.log(message);
            if (message == 'OK') {
                console.log('Mail Sent');
                Toast.fire({ icon: 'success', title: 'Mail Send Successfully' });
                AlertText = `
                <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
                    <strong>Mail Send Successfully!</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
                Alert.innerHTML = AlertText;
                setTimeout(function () { Alert.innerHTML = "" }, 2000);
                insertMail(ID, TimeStamp, RTo, Name, Subject, Message, fileurl);
                getMails();
            }
            else {
                console.error(message);
                AlertText = `
                <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                    <strong>Error : ${message}</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
                Alert.innerHTML = AlertText;
                setTimeout(function () { Alert.innerHTML = "" }, 2000);
                Toast.fire({ icon: 'error', title: 'Error Sending Email' });
            }
        }
    );
}


//Insert Mail Data to Database
function insertMail(ID, TimeStamp, RTo, Name, Subject, Message, fileurl) {
    firebase.database().ref('Mailbox/' + ID).set({
        TimeStamp: TimeStamp,
        RTo: RTo,
        Name: Name,
        Subject: Subject,
        Message: Message,
        fileurl: fileurl
    });
    document.getElementById("mail-name").value = "";
    document.getElementById("mail-to").value = "";
    document.getElementById("mail-message").value = "";
    Toast.fire({
        icon: 'success',
        title: 'Record Inserted Successfully!'
    })
    getMails();
}

//Get Mails
function getMails() {
    firebase.database().ref('Mailbox').on('value', function (snapshot) {
        document.getElementById("mailbox-table").innerHTML = "";

        var e = 1;
        snapshot.forEach(function (getInfo) {
            info_view = getInfo.val();
            var id = getInfo.key;
            if (info_view.fileurl == "") {
                var attachment_link = "-";
            } else {
                var attachment_link = `<a onclick="ShowAttachment('${info_view.fileurl}')" class="table_button" href=""><i class="fa fa-link"></a>`
            }
            row =
                `<tr>
                <td>${e++}</td>
                <td>${info_view.TimeStamp}</td>
                <td>${info_view.RTo}</td>
                <td>${info_view.Name}</td>
                <td>${info_view.Subject}</td>
                <td>${info_view.Message}</td>
                <td>${attachment_link}<td>
                <td>
                <a class="table_button" onclick="deleteMail('${id}')"><i class="fa fa-trash"></i></a>
                </td>
                </tr>`;
            document.getElementById("mailbox-table").innerHTML += row;
        });
    });
}

//Delete Mail Data
function deleteMail(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You want to Delete this Record!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let mailRef = firebase.database().ref('Mailbox/' + id);
            mailRef.remove();
            getMails();
            swalWithBootstrapButtons.fire(
                'Deleted Successfully!',
                'Record Deleted Successfully.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Cancelled by User',
                'error'
            )
        }
    })

}

//Initialize Mailbox with Datatable


//------------------------------------( End of System Mail Functions )------------------------------------//

// Common Functions
function ShowAttachment(url) {
    var Modal = document.getElementById("modalBody");
    doc = `<iframe src="${url}" style="width:100%; height:800px;"></iframe>`;
    Modal.innerHTML = doc;
    document.getElementById("showAttachment").click();
    document.getElementById("attachmentView").href = url;
}