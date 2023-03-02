//register method
register = ()=>{
        //Pull forms from index.html
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const emailAddress = document.getElementById('emailAddress');
    //error checking here
    //construct JSON document of form inputs
    const data = {
        username: username.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: emailAddress.value
    }

    console.log(data);
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
        console.log(responseJson);
    })
}
