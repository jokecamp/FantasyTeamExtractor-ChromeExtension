/*
  This gets injected into page in tab.
  We need to send some of the DOM content to our popup.js file
*/

var html = "";

var epl = document.getElementById('ismTeamDisplayData');
if (epl) html = epl.innerHTML;

var yahoo = document.getElementById('field');
if (yahoo) html = yahoo.innerHTML;

chrome.extension.sendMessage({
    action: "getSource",
    source: html,
    url: document.URL
});
