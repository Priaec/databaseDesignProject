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
    })
}