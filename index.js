const getTopTracks =
  "https://api.napster.com/v2.1/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm";

let songContainer = document.querySelector(".song-title");
let playlistcontainer = document.querySelector(".playlist-details");

let homebtn = document.querySelector(".homebtn");
let playlist_btn = document.querySelector(".playlistbtn");

let play = document.querySelector(".play-pause");
let nextbtn = document.querySelector(".next");
let prevbtn = document.querySelector(".prev");

let volumeslider = document.querySelector(".volume-slider");
let seekslider = document.querySelector(".seek-slider");
let currenttime = document.querySelector(".current-time");
let totaltime = document.querySelector(".total-time");

let navbtn = document.querySelectorAll(".swap");

let trackname = document.querySelector(".track-name");
let trackartist = document.querySelector(".track-artist");

let search = document.querySelector(".search-bar");

let trackindex = 0;
let isplaying = false;
let updateTimer;

let currenttrack = document.createElement("audio");

tracks();

 
async function tracks() {
  try {
    let response = await fetch(getTopTracks);
    
    response = await response.json();

    apidata(response);
    // functionality(response);

  } catch (error) {
    console.log(error);
  }
}

function apidata (response) {

  let list = response.tracks;

  // console.log(list);

  response.tracks.forEach((track, index) => {
    let box = document.createElement("div");
    let playlistbtn = document.createElement("div");
    let imagebox = document.createElement("img");
    imagebox.classList.add('box3');
    box.classList.add("box");
    playlistbtn.classList.add("box1");
    box.innerHTML = track.name;
    playlistbtn.innerHTML = "+Playlist";
    imagebox.src =
      `http://direct.rhapsody.com/imageserver/v2/albums/${track.albumId}/images/300x300.jpg`;
    box.appendChild(imagebox);
    box.appendChild(playlistbtn);

    playlistbtn.addEventListener("click", () => {
      localStorage.setItem(track.name,JSON.stringify(track));
      
    })
    
    box.addEventListener("click", () => {
      trackindex = index;
      loadTrack(list, index);
    });
  
    songContainer.appendChild(box);

    functionality(trackindex, list)
  });
}

  function loadTrack(list, trackindex) {
    clearInterval(updateTimer);
    resetValues();
    currenttrack.onloadedmetadata = seekUpdate();
    currenttrack.src = list[trackindex].previewURL;

    playpause(list, trackindex);

    // to update details of track
    trackupdate(list);

    updateTimer = setInterval(seekUpdate, 1000);

    currenttrack.addEventListener("ended", nextTrack);
  }

  function trackupdate(list) {
    trackname.textContent = list[trackindex].name;
    trackartist.textContent = list[trackindex].artistName;
  }

  seekslider.addEventListener('click',seekTo);

  function seekTo(){

    let seek = currenttrack.duration * (seekslider.value / 100);
    if(!isNaN(seek)){
    currenttrack.currentTime = seek;
    }

  }

  function seekUpdate(){
    let seekPosition = 0;

    if(!isNaN(currenttrack.duration)){
      seekPosition = currenttrack.currentTime * (100 / currenttrack.duration);
      seekslider.value = seekPosition;
    }

    let currentMinutes = Math.floor(currenttrack.currentTime / 60);
    let currentSeconds = Math.floor(currenttrack.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(currenttrack.duration / 60);
    let durationSeconds = Math.floor(currenttrack.duration - durationMinutes * 60);

    currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    durationSeconds = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
    durationMinutes = durationMinutes < 10 ? "0" + durationMinutes : durationMinutes;

    currenttime.textContent = currentMinutes + ":" + currentSeconds;
    totaltime.textContent = durationMinutes + ":" + durationSeconds;
  }

  

  function resetValues(){
    currenttime.textContent = "00:00";
    totaltime.textContent = "00:00";
    seekslider.value = 0;
  }

  function functionality(index, items){
    // let items = response.tracks;
    // console.log(items);

    // play.addEventListener('click', () => {
    //   currenttrack.src = items[index].previewURL;
    //   playpause();
    //   // loadTrack(items,index);
    // })

    // nextTrack(items);

  }

  play.addEventListener('click', playpause);

  function playpause() {
    if (!isplaying) {
      playTrack();
    } else {
      pauseTrack();
    }
  }

  function playTrack() {
    currenttrack.play();
    isplaying = true;
    play.innerHTML = '<i class="fa fa-pause-circle fa-3x"></i>';
  }

  function pauseTrack() {
    currenttrack.pause();
    isplaying = false;
    play.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
  }
  //   nexttrack function
  nextbtn.addEventListener("click", nextTrack);
  function nextTrack(items, trackindex) {
    if (trackindex < items.length) {
      trackindex += 1;
    } else {
      trackindex = 0;
    }
    playTrack();
  }

  //   prevtrack function
  prevbtn.addEventListener("click", previousTrack);
  function previousTrack() {
    if (trackindex > 0) {
      trackindex -= 1;
    } else {
      trackindex = 0;
    }
    loadTrack(trackindex);
    playTrack();
  }

  // volume controls
  volumeslider.addEventListener("click", () => {
    currenttrack.volume = volumeslider.value / 100;
  });

// };

function showsongs() {
  let detailstab = document.querySelector(".details");
  let playlisttab = document.querySelector(".playlist-details");

  detailstab.style.display = "block";
  playlisttab.style.display = "none";
}

function showplaylist() {
  let detailstab = document.querySelector(".details");
  let playlisttab = document.querySelector(".playlist-details");

  detailstab.style.display = "none";
  playlisttab.style.display = "block";

  showlocalstorage();
}



function showlocalstorage(){

  playlistcontainer.innerHTML = ""; 

  for(let i = 0; i < localStorage.length; i++){
    const key = localStorage.key(i);
    if(localStorage.hasOwnProperty(key)){
      let playlistbox = document.createElement("div");
      let imagebox1 = document.createElement("img");
      imagebox1.classList.add("box3");
      let removeicon = document.createElement("div");
      removeicon.innerHTML = "-Remove";
      playlistbox.classList.add("box");
      removeicon.classList.add("box1");
      playlistbox.innerHTML = key;

      playlistcontainer.appendChild(playlistbox);

      removeicon.addEventListener("click", () => {
        localStorage.removeItem(key);
        playlistcontainer.removeChild(playlistbox);
      });

      let id = localStorage.getItem(key);
      let data = JSON.parse(id);

      playlistbox.addEventListener("click", () => {
        console.log(data);
        loadLocalStorage(data.previewURL);
      });
    
      imagebox1.src = `http://direct.rhapsody.com/imageserver/v2/albums/${data.albumId}/images/300x300.jpg`;

      playlistbox.appendChild(imagebox1);
      playlistbox.appendChild(removeicon);
    }
}
}

function loadLocalStorage(key){
    currenttrack.src = key;
    console.log(currenttrack.src);
    currenttrack.play();
}
  

