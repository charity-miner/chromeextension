//This listens for any message sent by chrome.runtime.sendmessage()
//Used for updating Hash Stat info in real time
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.H != null)
            document.getElementById("hps").innerHTML = parseFloat(request.H).toFixed(2); //Hash Per Second
        if (request.TH != null)
            document.getElementById("th").innerHTML = request.TH; //Total Hashes
        if (request.AH != null)
            document.getElementById("ah").innerHTML = request.AH; //Accepted Hashes

        //If the miner is running set the button to say stop
        if ( request.running != null && request.running ){
            document.getElementById("stop-start").innerHTML = "Stop Mining";
          } else{
           document.getElementById("stop-start").innerHTML = "Start Mining";
         }
    });

//Listener for the button to change the miner from running to not running
document.addEventListener('DOMContentLoaded', function () {


    var startstop = document.getElementById('stop-start');
    // onClick's logic below:
    startstop.addEventListener('click', function () {
        chrome.runtime.sendMessage({ run: true }, function (response) { });
    });



    var mineOnStart = document.getElementById('mine-on-start');
    // onClick's logic below:
    mineOnStart.addEventListener('click', function () {

        chrome.storage.local.get("RunAtStart", function (response) {

            if ( response["RunAtStart"] ) {
                chrome.storage.local.set({ "RunAtStart": false }, function () { });
                mineOnStart.innerHTML = "Not Mining on Browser Start";
            } else {
                chrome.storage.local.set({ "RunAtStart": true }, function () { });
                mineOnStart.innerHTML = "Mining on Browser Start";
            }
        });
    });


    //User Id input field, grabbing user ID, onclick listener for UserId input, stores UserId into chrome storage
    var userId = document.getElementById('charity-mine-id');
    // onClick's logic below:
    userId.addEventListener('change', function () {

        chrome.storage.local.get("cm_userId", function (response) {
          //  console.log(userId.value);
            if (response["cm_userId"]) {

                chrome.storage.local.set({ "cm_userId": userId.value }, function () { });
            }
            else {

                chrome.storage.local.set({ "cm_userId": "0" }, function () { });
            }
        });
    });



});


chrome.storage.local.get("RunAtStart", function (response) {

    if (response["RunAtStart"]) {
       document.getElementById("mine-on-start").innerHTML = "Mining on Browser Start";
    } else {
       document.getElementById("mine-on-start").innerHTML = "Not Mining on Browser Start";
    }
});



//grabs the UserId from local and sets input value
chrome.storage.local.get("cm_userId", function (response) {
  
    var userId = document.getElementById('charity-mine-id');

    if (response["cm_userId"]) {
      userId.value = response["cm_userId"];
    } else {
      userId.value = 0;
    }

});
