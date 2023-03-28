//register method
function register(){
    //Pull forms from index.html
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const cPassword = document.getElementById('cPassword');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const emailAddress = document.getElementById('emailAddress');
    //error checking here
    if(username.value == '' || password.value == '' 
        || cPassword.value == '' || firstName.value == '' 
        || lastName.value == '' || emailAddress.value == '')
    {
        const msg = 'One of the fields is not written'
        displayError(msg);
        return false;
    }

    //check if fields are of correct type
    if(username.value.length <= 1){
        const msg = 'username length is too short'
        displayError(msg);
        return false;
    }


    //check if password and confirm password are the same
    if(password.value != cPassword.value){
        //return error message: confirm password and password do not match 
        const msg = 'Password and confirmed password do not match'
        displayError(msg);
        return false;
    }

    //construct JSON document of form inputs
    const data = {
        username: username.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: emailAddress.value
    }
    console.log({form: data});
    //fetch the URL, and run the insert statement on server.js
    fetch('http://localhost:3000/api/signup',{
        method: 'POST',
        headers:{
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
       }).then((response)=> responseJson = response)
      .then((responseJson)=>{
        //if we have existing account
        const msg = 'Username and or email already taken';
        if(responseJson.message == msg)
            return displayError(msg);
        //continue to login page
        else
            return window.location.href = 'http://localhost:3000/api/login.html'
        });
}

//function just to display error in signup
function displayError(msg){
    const error = document.getElementById('error');
    error.innerHTML = 'Error: ' + msg;
}