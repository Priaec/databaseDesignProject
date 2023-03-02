login = () =>{
    //grab values
    const username = document.getElementById('username');
    const password = document.getElementById('password')
    //create JSON body
    const data = {
        username: username.value,
        password: password.value
    }
    //input error checking

    //fetch url post request
    fetch('http://localhost:3000/api/login', {
        method: "POST",
        headers:{
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response)=> responseJson = response)
    .then((responseJson)=>{
        //response is sent back here
        console.log(responseJson.email);
        window.location.href = 'http://localhost:3000/api/index.html'
    })
}