getLinks();
function getLinks() {
    const options = {
        method: 'GET',
        headers: { Accept: 'application/json', apikey: '2d5a93f8ff2949bbb8e0b5f33eaf3346' }
    };

    fetch('https://api.rebrandly.com/v1/links?orderBy=createdAt&orderDir=desc', options)
        .then(response => response.json())
        .then(response => createTable(response))
        .catch(err => console.error(err));
}

function createTable(data) {
    // console.log(data);
    document.getElementById("links-Table").innerHTML = "";
    document.getElementById("totalURLS").innerHTML = data.length;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        row = `
        <tr>
            <td>${i + 1}</td>
            <td class="d-none">${d.id}</td>
            <td>https://${d.shortUrl}</td>
            <td>${d.destination.slice(0, 30)}...</td>
            <td><button class="btn btn-primary btn-sm" onclick="copyText('linkcopy','https://${d.shortUrl}')"><i class="fa-solid fa-copy"></i></button></td>
            <td align ="center"><a class="table_button" href="${d.destination}" target="_blank"><i class="fa fa-link"></i></a></td>
            <td>${d.clicks}</td>
            <td>
                <a onclick="updateLink('${d.id}','${d.destination}')" class="table_button" ><i class="fa fa-edit"></i></a>
                <a onclick="deleteLink('${d.id}')" class="table_button" ><i class="fa fa-trash"></i></a>
            </td>
        </tr>
        `;
        document.getElementById("links-Table").innerHTML += row;
    }
}

function shortenURL() {
    var destination = document.getElementById("destinationURL").value;
    var slash = "rk/" + document.getElementById("urlKeyword").value;
    var Alert = document.getElementById("urlFormAlert");
    if (destination != "") {
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                apikey: '2d5a93f8ff2949bbb8e0b5f33eaf3346'
            },
            body: JSON.stringify({
                destination: destination,
                slashtag: slash
            })
        };

        fetch('https://api.rebrandly.com/v1/links', options)
            .then(response => response.json())
            .then(data => {
                // Check Success
                console.log(data);
                if (data.id) {
                    var shortenURL = "https://" + data.shortUrl;
                    AlertText = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success! URL Shortened Successfully [${shortenURL}].</strong>
                        <button id="lbutton" class="btn btn-primary btn-sm" onclick="copyText('lbutton','${shortenURL}')" style="float:right"><i class="fa-solid fa-copy"></i></button>
                    </div>`;
                    Alert.innerHTML = AlertText;
                }
                // Check Error
                else {
                    AlertText = `
                    <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
                        <strong>Error! ${data.errors[0].message}</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                    Alert.innerHTML = AlertText;
                }
            })
            .then(response => console.log(response))
            .catch(err => console.error(err));
        document.getElementById("destinationURL").value = "";
        document.getElementById("urlKeyword").value = "";

    }
}

function updateLink(ID, destination) {
    var destinationLink = prompt("Enter New Destination URL", destination);
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            apikey: '2d5a93f8ff2949bbb8e0b5f33eaf3346'
        },
        body: JSON.stringify({ destination: destinationLink })
    };
    fetch('https://api.rebrandly.com/v1/links/' + ID, options)
        .then(response => response.json())
        .then(response => {
            getLinks();
            Toast.fire({ icon: 'success', title: 'Link Updated Successfully!' });
        })
        .catch(err => {
            Toast.fire({ icon: 'error', title: 'Error Occured!' });
        });
}
function deleteLink(ID) {
    var check = confirm("Are you sure you want to delete this link?");
    if (check == true) {
        const options = {
            method: 'DELETE',
            headers: { Accept: 'application/json', apikey: '2d5a93f8ff2949bbb8e0b5f33eaf3346' }
        };
        fetch('https://api.rebrandly.com/v1/links/' + ID, options)
            .then(response => response.json())
            .then(response => {
                getLinks();
                Toast.fire({ icon: 'success', title: 'Link Deleted Successfully!' });
            })
            .catch(err => {
                Toast.fire({ icon: 'error', title: 'Error Occured!' });
            });
    }

}

function copyText(bid, iid) {
    var Button = document.getElementById(bid);
    navigator.clipboard.writeText(iid);
    Button.innerHTML = `<i class="fa-solid fa-clone"></i>`;
    setTimeout(function () {
        Button.innerHTML = `<i class="fa-solid fa-copy"></i>`;
    }, 2000)
}