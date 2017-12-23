

var userId = "ChromeExtension";

chrome.storage.local.get('cm_userId', userIdCallback );


function userIdCallback(result){

	userId = result.cm_userId;
	var miner = getMiner(userId);
	getRunAtStart(miner);
	updateStats(miner);
	startStopListener(miner);

}

function getMiner(userId){
	var miner = new CoinHive.User('lzU0IgctdSTntRDYXUhp8lOPG189Jr5V', userId,{
		autoThreads: true,
		throttle: .9,
		forceASMJS: false
	});
	return miner;
	//miner.stop();
}



function getRunAtStart(miner){
	chrome.storage.local.get("RunAtStart", function(response) {
		if (response["RunAtStart"]){
			miner.start();
		} else {
			miner.stop();
		}
	});
}

// Update stats once per second
function updateStats(miner){
	setInterval(function () {
		var hashesPerSecond = miner.getHashesPerSecond();
		var totalHashes = miner.getTotalHashes();
		var acceptedHashes = miner.getAcceptedHashes();
		var running = miner.isRunning();

		// Output to HTML elements...
		chrome.runtime.sendMessage({ H: hashesPerSecond }, function (response) { });
		chrome.runtime.sendMessage({ TH: totalHashes }, function (response) { });
		chrome.runtime.sendMessage({ AH: acceptedHashes }, function (response) { });
		chrome.runtime.sendMessage({ running: running }, function (response) { });
	}, 500);
}


function startStopListener(miner){
	chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {

		//Quickly swap running states of the miner
	  if (request.run != null && request.run) {

			if (miner.isRunning()){
				miner.stop();
			}	else {
				miner.start();
			}

		}

	});
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){

    if(details.reason == "install"){
        chrome.storage.local.set({"RunAtStart": false});
    }else if(details.reason == "update"){

    }
});
