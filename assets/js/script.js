const contanerElement = document.querySelectorAll(".toggleLogin");
const container =  document.querySelector(".container");
const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");

contanerElement.forEach((els)=>{
    els.addEventListener("click",function(){
        container.classList.toggle("isRegister");
    })
})

var goToChat = function()
{
    window.location.href="chat.html"
}

const isLoggedIn = function()
{
    let userDetails = sessionStorage.userDetails;
    if(userDetails)
    {
        goToChat();
    }
}

$(document).ready(function(){
    isLoggedIn();
    loginButton.addEventListener("click",function(){
        login();
    });
    
    registerButton.addEventListener("click",function(){
        register();
    });
    logoutButton.addEventListener("click",function(){
        window.location.href="/";
    })
})



function login()
{
    let isValidated = validateInput(".container--login");
    if(isValidated)
    {
        let inputObj = {};
        document.querySelectorAll(".container--login input").forEach((inputEls)=>{
            let sendName = inputEls.getAttribute("data-send");
            inputObj[sendName] = inputEls.value;
        });
        callLogin(inputObj).then((data)=>{
            if(data.response)
            {
                window.location.href="chat.html";
                storeOnLocalStorage(data.data[0]);
            }
            else
            {
                alert(data.responseString);
            }
        })
    }
}

function storeOnLocalStorage(data)
{
    sessionStorage.userDetails =  JSON.stringify(data);
}

function register()
{
    let isValidated = validateInput(".container--register");
    if(isValidated)
    {
        let inputObj = {};
        document.querySelectorAll(".container--register input").forEach((inputEls)=>{
            let sendName = inputEls.getAttribute("data-send");
            inputObj[sendName] = inputEls.value;
        });
        callRegister(inputObj).then((data)=>{
            if(data.response)
            {
                container.classList.toggle("isRegister");
                alert("Registered");
            }
            else
            {
                container.classList.toggle("isRegister");
                alert(data.responseString);
            }
        })
    }
}


function validateInput(target){
    let errorText = "";
    let targetElement = document.querySelector(target);
    let inputField =  targetElement.querySelectorAll(".container input");
    let errorContainer = targetElement.querySelector(".errorContainer");
    inputField.forEach((inputEls)=>{
        inputEls.classList.remove("invalid");
    });
    inputField.forEach((inputEls)=>{
        if(inputEls.classList.contains("required") && !inputEls.value)
        {
            errorText+=`<span class="errorText">${inputEls.name} is Required</span>`;
            inputEls.classList.add("invalid");
        }
        if(inputEls.name=="Email" && !validateEmail(inputEls.value) && inputEls.value)
        {
            errorText+=`<span class="errorText">Email id is not valid</span>`;
            inputEls.classList.add("invalid");
        }
        if(inputEls.name=="Password" && (inputEls.value.length<4 || inputEls.value.length>12) && inputEls.value)
        {   
            inputEls.classList.add("invalid");
            errorText+=`<span class="errorText">Password Should be between 4 and 12</span>`;
        }
        if(inputEls.name=="First Name" && (inputEls.value.length<4 || inputEls.value.length>12) && inputEls.value)
        {
            inputEls.classList.add("invalid");
            errorText+=`<span class="errorText">First Name Should be between 4 and 12</span>`;
        }
        if(inputEls.name=="Last Name" && (inputEls.value.length<4 || inputEls.value.length>12) && inputEls.value)
        {
            inputEls.classList.add("invalid");
            errorText+=`<span class="errorText">Last Name Should be between 4 and 12</span>`;
        }
    });
    errorContainer.innerHTML=errorText;
    if(errorContainer.innerHTML)
    return false;
    else
    {
        errorContainer.innerHTML = "";
        return true;
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function callLogin(data)
{
    return new Promise((resove,reject)=>{
        $.ajax({
            url:'https://chat-app-goku.herokuapp.com/users/login',
            method:'POST',
            data:data,
            success:function(callData)
            {
                resove(callData);
            },
            error:function(err){
                reject(err);
            }
        });
    });
}

function callRegister(data)
{
    return new Promise((resove,reject)=>{
        $.ajax({
            url:'https://chat-app-goku.herokuapp.com/users/register',
            method:'POST',
            data:data,
            success:function(callData)
            {
                resove(callData);
            },
            error:function(err){
                reject(err);
            }
        });
    });
}