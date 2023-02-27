//Pull forms from index.html
let username = document.getElementById('username');
let password = document.getElementById('password');
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let emailAddress = document.getElementById('emailAddress');
//error checking here

//construct JSON document of form inputs
const data = {
    username: username.innerHTML,
    password: password.innerHTML,
    firstName: firstName.innerHTML,
    lastName: lastName.innerHTML,
    emailAddress: emailAddress.innerHTML
}
//fetch the URL, and run the insert statement on server.js
fetch('',{
    method: 'POST',
    body: data
}).then((response)=> responseJson = response)
.then((responseJson)=>{
    console.log(responseJson);
})