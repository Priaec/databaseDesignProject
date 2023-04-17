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
    if(username.value == "" || password.value == ""){
        const msg = 'One of the fields is not written';
        displayError(msg);
        return false;
    }

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
        console.log({status: responseJson.status});
        const status = responseJson.status;
        if(status == 200){
            const msg = 'incorrect username and password combination';
            return displayError(msg);
        }
        else{
            console.log('hello');
            //return window.location.href = 'http://localhost:3000/api/index.html'
            return window.location.href = 'http://localhost:3000/api/search?userName='+username.value
        }
    })
}

displayError = (msg)=>{
    const err = document.getElementById('error');
    err.innerHTML = 'Error: ' + msg;
}

displayNote = (msg)=>{
    const note = document.getElementById('note');
    note.innerHTML = 'Success: ' + msg;
}


//initialize the database
function initialize(){
    const data = {
    }
    fetch('http://localhost:3000/api/init', {
        method: "POST",
        headers:{
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response)=> responseJson = response)
    .then((responseJson)=>{
        //response is sent back here
        console.log(responseJson.message);
        if(responseJson.status != 200){
            const msg = 'Initialization has an error, try again';
            displayError(msg);
            return true;
        }
        //we know we initialized properly
        else{
            const msg = 'initialized database';
            displayNote(msg);
            return true;
        }
    });

}