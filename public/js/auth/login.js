function login(event){
  event.preventDefault();
  var user=document.getElementById("user").value;
  var passwd=document.getElementById("passwd").value;
  var submitButton=document.querySelector('button[type="submit"]');
  submitButton.disabled=true;
  fetch("http://localhost:3000/login",{
    method:"POST",
    headers:{"Content-Type":"application/json",},
    body:JSON.stringify({user:user,passwd:passwd}),
  })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.redirect){
        sessionStorage.setItem('user',user);
        sessionStorage.setItem('passwd',passwd);
        window.location.href=data.redirect;
      }else if(data.error){
        document.getElementById("feedbackText").innerText=data.error;
      }
    })
    .catch((error)=>{
      console.error("Error en la solicitud:",error);
      document.getElementById("feedbackText").innerText="Error al procesar la solicitud.";
    })
    .finally(()=>{
      submitButton.disabled=false;
    });
}
document.querySelector('form').addEventListener('submit',login);
