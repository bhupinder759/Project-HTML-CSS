let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    // Ensure seconds is a non-negative integer
    seconds = Math.max(0, Math.floor(seconds));
  
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
  
    // Format minutes and seconds with leading zeros
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  
    // Return the formatted result
    return formattedMinutes + ':' + formattedSeconds;
  }
  
  // Example usage:
  var totalSeconds = 72;
  var formattedTime = secondsToMinutesSeconds(totalSeconds);
  console.log(formattedTime); // Output: "01:12"
  

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/spotify/song/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/song/")[1]);
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/spotify/song/" + track);
    currentsong.src = "/spotify/song/" + track;
    if(!pause) {
        currentsong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    //Get the list of all songs
    songs = await getsongs();
    playMusic(songs[0], true)

    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Subh</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
        </div>
         </li>`;
        }
        

    //Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    //Attach an event listner to play,  next and previous
    play.addEventListener("click", () => {
        if(currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "play.svg";
        }
    })

    // Listen for timeupdate event 
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${
            secondsToMinutesSeconds(currentsong.currentTime)}/${
                secondsToMinutesSeconds(currentsong.duration)
            }`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

        //Add an event listner to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration)* percent) / 100
        })
    })

    //Add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listner for for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    
    // add an event listner to previous
    previous.addEventListener("click", () => {
        console.log("previous clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        console.log(songs, index)
        if ((index-1) >= 0) {
            playMusic(songs[index-1])
        }

    })

    // add an event listner to next
    next.addEventListener("click", () => {
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        console.log(songs, index)
        if ((index+1) < songs.length-1) {
            playMusic(songs[index+1])
        }
    })

    // add an event to range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        console.log(e.target.value)
        currentsong.volume = parseInt(e.target.value)/100
    })
}

main()