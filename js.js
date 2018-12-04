// async function upload() {
//     var file = document.getElementById("upload_file").files[0];
//     var ID = '_' + Math.random().toString(36).substr(2, 9);
//     let promise1 = new Promise((resolve) => {
//         let config = {
//             headers: {
//                 'Content-Type': 'image/jpeg'
//             }
//         }; 
//         axios.put('https://bcc00j9n88.execute-api.us-east-1.amazonaws.com/p/photolx/' + ID + '.jpg',
//             file,
//             config
//         ).then(response => {
//             console.log(response);
//             resolve();
//         }).catch(error => {
//             console.log(error)
//         })
//     })
//     await promise1;
//     addimage(ID + '.jpg');
// }
function upload() {
    var file = document.getElementById("upload_file").files[0];
    var ID = '_' + Math.random().toString(36).substr(2, 9);
    let config = {
        headers :{
            'Content-Type': 'image/jpeg'
        } 
    };
    axios.put('https://bcc00j9n88.execute-api.us-east-1.amazonaws.com/p/photolx/' + ID + '.jpg',
        file,
        config
    ).then(response => {
        console.log(response);
        addimage(ID + '.jpg')
    }).catch(error => {
        console.log(error);
    })
}
function search(msg) {
    axios({
        url: "https://wjx177n8e4.execute-api.us-east-1.amazonaws.com/prod/search",
        method: 'post',
        data: {
            "message": msg
        },
        headers: {
            "X-Api-Key": "ULWGhZU9di3ZNELXYJXdBwJY22E5xPS5z5ghwKCh"
        }
    }).then(response => {
        console.log(response.data.body);
        if (response.data.body.length == 0) {
            alert("no result...")
        } else {
            $('.child').remove()
            for (var i = 0; i < response.data.body.length; i++)
                addimage(response.data.body[i]);
    } 
}).catch(error => {
        console.log(error)
    })
}

function addimage(name) {
    var img = new Image();
    img.setAttribute("class", "child");
    img.setAttribute("src","https://s3-us-west-2.amazonaws.com/photolx/"+name);
    img.setAttribute("onclick", "onClick(this)");
    img.setAttribute("height", "80%")
    var chatArea = $(".chatBody");
    chatArea.append(img);
}

function sendMessage() {
    var msg = $(".msg").val();
    if (msg === "") {
        alert("please enter some thing!");
        return;
    }
    search(msg);
}

$(".msg").keydown(function () {
    if (event.keyCode == "13") {
        sendMessage();
        $(".msg").val(null);
    }
});

function clik() {
    document.getElementById("modal01").style.display = 'none';
}