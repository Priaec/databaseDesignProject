const form = document.querySelector('#my-form');

form.addEventListener('submit', async (event)=>{
    event.preventDefault()
    //get the form elements
    const formData = new FormData(form);
    //construct a the body as JSON
    const body = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });


    //make the promise, handle the response
    try{
        fetch('http://localhost:3000/api/add-item', {
            method: "POST",
            headers:{
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response)=> responseJson = response)
        .then((responseJson)=>{
            console.log('Success')
        });
    }
    catch(err){
        console.log({message: err.message})
    }


})