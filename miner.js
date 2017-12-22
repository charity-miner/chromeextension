var miner = new CoinHive.User('vf1xIqq1FBmT5jbafvIB8b2eknlibaxx', 'ChromeExtension',{

	autoThreads: true,
	throttle: .9,
	forceASMJS: false
});

miner.stop();

chrome.storage.local.get("RunAtStart", function(response) {
	if (response["RunAtStart"])
	{
		miner.start();
	}
	else
	{
		miner.stop();
	}
});

// Update stats once per second
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

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {

			//Quickly swap running states of the miner
      if (request.run != null && request.run) {

				if (miner.isRunning())
					miner.stop();

				else miner.start();
		}
	});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){

    if(details.reason == "install"){
        chrome.storage.local.set({"RunAtStart": false});
    }else if(details.reason == "update"){

    }
});
