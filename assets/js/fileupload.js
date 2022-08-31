function certificateFileUpload() {
    var Alert = document.getElementById("certificatesFormAlert");
    var file = document.getElementById("certificate-file").files[0];
    var button = document.getElementById("cFileUpload");
    if (file !== undefined) {
        FN = `[${Date.now()}]-${file.name}`;
        var storageRef = firebase.storage().ref('Certificates/' + FN);
        var task = storageRef.put(file);
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                AlertText = `
                <div class="mb-3">
                    <progress value="${percentage}" max="100" style="width:100%;"></progress>
                </div>`;
                Alert.innerHTML = AlertText;
                button.innerHTML = `Uploading <i class="fa-solid fa-spin fa-spinner ml-2"></i>`;
                console.log(percentage);
            }
        );
        task.then(function (snapshot) {
            console.log('File Upload Successfully');
            storageRef
                .getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    document.getElementById("c-view").value = url;
                    document.getElementById('c-view').readOnly = true;
                    AlertText = `
                    <div class="alert alert-success" role="alert">
                        <strong><span style="float:left">File Uploaded Successfully</span></strong>
                        <button onclick="ShowAttachment('${url}')" class="btn btn-primary btn-sm ml-3" target="_blank" style="float:right">View</button>
                        <button id="cbutton" class="btn btn-primary btn-sm" onclick="copyText('cbutton','${url}')" style="float:right"><i class="fa-solid fa-copy"></i></button>
                    <br></div>
                    `;
                    Alert.innerHTML = AlertText;
                    button.innerHTML = `Uploaded <i class="fa-solid fa-check ml-2"></i>`;
                    Toast.fire({ icon: 'success', title: 'File Uploaded Successfully' });
                })
                .catch(function (error) {
                    console.log("Error");
                });
        });
    }
    else {
        AlertText = `
                <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                    <strong>Enter a Valid Reference or Choose a Valid File</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`;
        Alert.innerHTML = AlertText;
    }

}

function mailAttachmemtFileUpload() {
    var Alert = document.getElementById("mailing-alert");
    var file = document.getElementById("mail-attachment").files[0];
    if (file !== undefined) {
        FN = `[${Date.now()}]-${file.name}`;
        document.getElementById("file-name").value = FN;
        var storageRef = firebase.storage().ref('Mail-Attachments/' + FN);
        var task = storageRef.put(file);
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                AlertText = `
                <div class="mb-3">
                    <progress value="${percentage}" max="100" style="width:100%;"></progress>
                </div>`;
                Alert.innerHTML = AlertText;
                console.log(percentage);
            }
        );
        task.then(function (snapshot) {
            document.getElementById("fileuploaddiv").classList.add("d-none");
            console.log('File Upload Successfully');
            storageRef
                .getDownloadURL()
                .then(function (url) {
                    console.log(url);
                    Toast.fire({ icon: 'success', title: 'File Uploaded Successfully' });
                    AlertText = `
                <div class="alert alert-success" role="alert">
                    <strong><span style="float:left">File Uploaded Successfully</span></strong>
                    <button onclick="ShowAttachment('${url}')" class="btn btn-primary btn-sm ml-3" target="_blank" style="float:right">View</button>
                    <button id="mbutton" class="btn btn-primary btn-sm" onclick="copyText('mbutton','${url}')" style="float:right"><i class="fa-solid fa-copy"></i></button>
                    <br></div>
                `;
                    Alert.innerHTML = AlertText;
                    document.getElementById("file-url").value = url;
                })
                .catch(function (error) {
                    console.log("error encountered");
                });
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Reference or Choose a Valid File</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML = AlertText;
    }
}

function commonFileUpload() {
    var refR = document.getElementById('defref-div').value;
    var file = document.getElementById("common-file").files[0];
    var storageRef = firebase.storage().ref(refR + '/' + file.name);
    var task = storageRef.put(file);
    task.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(percentage);
        }
    );
    task.then(function (snapshot) {
        console.log('File Upload Successfully');
        storageRef
            .getDownloadURL()
            .then(function (url) {
                console.log(url);
                document.getElementById("commonfilealert").innerHTML = `<span style="float:left">File Uploaded Successfully</span>` + `<a href="${url}" class="btn btn-primary btn-sm" target="_blank" style="float:right">View [${file.name}]</a>` + `<br>`;
                Toast.fire({ icon: 'success', title: 'File Uploaded Successfully' });
            })
            .catch(function (error) {
                console.log("error encountered");
            });
    }
    );
}

