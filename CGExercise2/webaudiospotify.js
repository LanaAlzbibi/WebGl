//getTrack("better+call+saul+end+credits");
getTrack("Koreless Joy Squad");
//drawRandom();
var trackname = document.getElementById("track");
const audioElement = document.querySelector('#audio');
audioElement.volume = 0.3;
// Mac Os ??? 
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const track = audioCtx.createMediaElementSource(audioElement);
const analyser = audioCtx.createAnalyser();
track.connect(analyser).connect(audioCtx.destination);
trackname.onchange = ev => getTrack(trackname.value);
audioElement.addEventListener('play', (ev)=> audioCtx.resume());

function getData(analyser, size, type) {
    analyser.fftSize = size;
    var bufferLength = analyser.fftSize;
    var dataArray = new Float32Array(bufferLength);
    if (type == "wave") analyser.getFloatTimeDomainData(dataArray);
    else analyser.getFloatFrequencyData(dataArray);
    return dataArray;
}
var sptrack={};
async function getTrack(name) {
    if (!name) name = trackname.value;
    if (name.length > 0) {
        let URL = "http://imiedit.f4.htw-berlin.de:6050/search=" + encodeURI(name) + "&type=track&market=DE&limit=1";
        let resp = await fetch(URL, {});
        var newtrack = await resp.json();
        if (!newtrack.error) {
            sptrack = newtrack;
            updateGUI();
        }
        else {
            bear.value = "EXPIRED TOKEN... get NEW ONE";
        }
    }
}
async function drawRandom(){
    let r = Math.floor(Math.random()*130);
    let plist = "6140kz4QmbPYFqjLG5ZeFD";
    if(trackname.value.length==22){
        plist = trackname.value;
        r = Math.floor(Math.random()*20); //play it save here
    }
    let URL = "http://imiedit.f4.htw-berlin.de:6050/playlist=" + encodeURI(plist) + "/tracks?limit=1&offset="+r;

    let resp = await fetch(URL, {});
    var newtrack = await resp.json();
    if (!newtrack.error) {
        sptrack.tracks = newtrack;
        newtrack.items[0] = newtrack.items[0].track;
        updateGUI();
    }
    else {
        bear.value = "EXPIRED TOKEN... get NEW ONE";
    }
}
function updateGUI() {
    var pic = document.getElementById("spimg");
    pic.src = sptrack.tracks.items[0].album.images[1].url;
    var audio = document.getElementById("audio");
    audio.src = sptrack.tracks.items[0].preview_url;
    var name = document.getElementById("artistname");
    name.innerText = sptrack.tracks.items[0].artists[0].name;
    if(!sptrack.tracks.items[0].preview_url){
        name.innerHTML += " <h2 style='background-color:red;'>Preview not available</h2>"        
    }
    name = document.getElementById("trackname");
    name.innerText = sptrack.tracks.items[0].name;
}