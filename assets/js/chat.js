const logoutButton = document.getElementById("logout");
const socket = io("https://polling-api.herokuapp.com");
const appDetails = {
    userDetails:{},
    users:[],
    imgArr:[],
    photos:"[]",
}


// client-side
socket.on("hello", (arg) => {
    console.log(arg); // world
  });

socket.on("chat_receive", (msg,time,userid,photos) => {
    console.log("soket message",msg);
    if(userid != appDetails.userDetails.id)
    appendChat(userid,msg,time,photos);
});

const getUsername = function()
{
    return appDetails.userDetails.FirstName+' '+appDetails.userDetails.LastName||"";
}

const isLoggedIn = function()
{
    let userDetails = sessionStorage.userDetails;
    if(userDetails)
    {
        appDetails.userDetails = JSON.parse(userDetails);
    }
    else
    {
        logout();
    }
}

const asignUserDetails = function()
{
    let userText = document.querySelector(".navbar .username");
    userText.innerText = getUsername();
}

function uploadImage(dataImage)
{
    let imageArr = JSON.parse(appDetails.photos);
    imageArr.push(dataImage);
    appDetails.photos = JSON.stringify(imageArr);
}

function getImageArr(strArr)
{
    let imageArr = JSON.parse(strArr);
    return imageArr;
}

$(document).ready(function(){
    isLoggedIn();
    asignUserDetails();
    getChatUsers().then((data)=>{
        console.log("chat users",data);
        appDetails.users = data.data;
        appDetails.users.map((els)=>{
            els.color =  getRandomColor();
        });
    });
    getChatHistory().then((data)=>{
        console.log("chat history",data.data);
        appendChatHistory(data.data)
    });
    logoutButton.addEventListener("click",function(){
        logout();
    })
    var textarea = document.querySelector('#chatMessageText');
    textarea.addEventListener('keydown', autosize);
    textarea.addEventListener("keydown",function(event){
        if (event.keyCode === 13 && textarea.value) 
        {
            event.preventDefault();     
            appendChatElement();  
        }
    })
    document.querySelector(".chatMessages--actions .fa-paper-plane").addEventListener("click",function(){
        appendChatElement();
    });
})

function appendChatElement()
{
    let value = document.querySelector('#chatMessageText').value;
    $(".imageElement").html('');
    appendChat(appDetails.userDetails.id,value,new Date().getTime(),appDetails.photos);
    socket.emit("chat_send",value,new Date().getTime(),appDetails.userDetails.id,appDetails.photos);
    // socket.emit("mymesage","hello");
    document.querySelector('#chatMessageText').value = "";
    appDetails.photos = "[]";
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


function getUserDetails(id)
{
    let sendObj =  {};
    appDetails.users.forEach((els)=>{
        if(els.id == id)
        {
            sendObj =els;
        }
    })
    return sendObj;
}



function appendChat(id,msg,time,photos)
{
    let photosList =  getImageArr(photos);
    let parsedTimg = parseInt(time);
    let imageElement = "";
    photosList.forEach((imgSrc)=>{
        imageElement += `
        <span class="sourceImage--element">
            <img src="${imgSrc}"/>
        </span>
        `
    })
    if(id == appDetails.userDetails.id)
    {
        document.querySelector(".chatContainer--chat--container").innerHTML+=
        `
        <div class="chatContainer--chat--container--chatText user">
            <span class="chatContainer--chat--container--chatText--profile">
                <span>
                    G
                </span>
            </span>
            <span class="chatContainer--chat--container--chatText--details">
                <span class="chatContainer--chat--container--chatText--details--text">
                    ${msg}
                </span>
                <span class="chatContainer--chat--container--chatText--details--time">
                   ${convertMomentTimezone(parsedTimg,"chat")}
                </span>
            </span>
        </div>
        <span class="sourceImage user">
            ${imageElement}
        </span>
        `
    }
    else
    {
        let {FirstName,LastName,color} = getUserDetails(id);
        document.querySelector(".chatContainer--chat--container").innerHTML+=
        `
        <div class="chatContainer--chat--container--chatText">
            <span class="chatContainer--chat--container--chatText--profile" style="background:${color}">
                <span>
                    ${FirstName[0]}
                </span>
            </span>
            <span class="chatContainer--chat--container--chatText--details">
                <span class="chatContainer--chat--container--chatText--details--text">
                    ${msg}
                </span>
                <span class="chatContainer--chat--container--chatText--details--time">
                   ${convertMomentTimezone(parsedTimg,"chat")}
                </span>
            </span>
        </div>
        <span class="sourceImage">
            ${imageElement}
        </span>
        `
    }
}

function convertMomentTimezone(datemillisecond,option)
{
  var timeZone =  "IST";
  var timezone_set = {
            "IST": "Asia/kolkata",
            "PST": "America/Los_Angeles",
            "EST": "America/New_York",
            "CST": "America/Chicago",
            "ADT": "America/Halifax",
            "AKDT": "America/Juneau",
            "AKST": "America/Juneau",
            "ART": "America/Argentina/Buenos_Aires",
            "AST": "America/Halifax",
            "BDT": "Asia/Dhaka",
            "BRST": "America/Sao_Paulo",
            "BRT": "America/Sao_Paulo",
            "BST": "Europe/London",
            "CAT": "Africa/Harare",
            "CDT": "America/Chicago",
            "CEST": "Europe/Paris",
            "CET": "Europe/Paris",
            "CLST": "America/Santiago",
            "CLT": "America/Santiago",
            "COT": "America/Bogota",
            "EAT": "Africa/Addis_Ababa",
            "EDT": "America/New_York",
            "EEST": "Europe/Istanbul",
            "EET": "Europe/Istanbul",
            "GST": "Asia/Dubai",
            "HKT": "Asia/Hong_Kong",
            "HST": "Pacific/Honolulu",
            "ICT": "Asia/Bangkok",
            "IRST": "Asia/Tehran",
            "JST": "Asia/Tokyo",
            "KST": "Asia/Seoul",
            "MDT": "America/Denver",
            "MSD": "Europe/Moscow",
            "MSK": "Europe/Moscow",
            "MST": "America/Denver",
            "NZDT": "Pacific/Auckland",
            "NZST": "Pacific/Auckland",
            "PDT": "America/Los_Angeles",
            "PET": "America/Lima",
            "PHT": "Asia/Manila",
            "PKT": "Asia/Karachi",
            "SGT": "Asia/Singapore",
            "WAT": "Africa/Lagos",
            "WEST": "Europe/Lisbon",
            "WET": "Europe/Lisbon",
            "WIT": "Asia/Jakarta",
            "UTC": "UTC",
            "GMT": "GMT"
        }
        var zone = timezone_set[timeZone];
        var date;
        if (zone == "" || zone == undefined || zone == null) {
            zone = "Asia/kolkata";
        }
        if (option=="chat") {
           date = moment.tz(datemillisecond, zone).format('MMM DD, hh:mma');
        }
        return date;
}


function logout()
{
    sessionStorage.clear();
    window.location.href="/";
}


function getChatUsers()
{
    return new Promise((resove,reject)=>{
        $.ajax({
            url:'https://chat-app-goku.herokuapp.com/users/getusers',
            method:'GET',
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

function getChatHistory()
{
    return new Promise((resove,reject)=>{
        $.ajax({
            url:'https://chat-app-goku.herokuapp.com/users/getChats',
            method:'GET',
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


function appendChatHistory(data)
{
    $(".chatContainer--chat--container").html('');
    data.forEach((els)=>{
        let {id,userId,messages,time,photos} = els;
        appendChat(userId,messages,time,photos);
    });
}



function autosize(){
    var el = this;
    setTimeout(function(){
      el.style.cssText = 'height:auto; padding:0';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
  }

document.getElementById("prifileImageUpload").addEventListener("change",uploadImageSettings);

function uploadImageSettings()
{
    var base64_img_home = "";
    var filesSelected_home = document.getElementById("prifileImageUpload").files;
    if(!filesSelected_home[0])
    return;
    var home_file_name = filesSelected_home[0].name;
    home_file_name = home_file_name.replace(/[^a-zA-Z0-9.]/g, "_");
    if (filesSelected_home.length > 0)
    {
        var home_fileToLoad = filesSelected_home[0];
        var home_fileReader = new FileReader();
        home_fileReader.onload = function(fileeventLoad)
        {
        //   document.querySelector(".inputContainer--input-image--container span").innerHTML = `&nbsp; <i class="fas fa-spinner fa-spin"></i>`
        //   document.getElementById("saveAutomation").setAttribute("disabled",true);
            var hm_img_base64 = fileeventLoad.target.result; // <--- data: base64
            base64_img_home = hm_img_base64;
            console.log("image",base64_img_home);
            $(".imageElement").append(`<img src='${base64_img_home}' />`)
            uploadImage(base64_img_home)
        }
        home_fileReader.readAsDataURL(home_fileToLoad);
    }
}
