// Change background color
window.onload = function(){
    let bgPreference = localStorage.getItem("backgroundPreference")
    if(!bgPreference) return
    if(bgPreference == "day"){
        document.querySelector("#header").style.backgroundImage = "url(dist/res/images/" + bgPreference + "_mode.gif)"
    }else{
        document.querySelector("#header").style.backgroundImage = "url(dist/res/images/" + bgPreference + "_mode.gif)"
    }
}

const bgButtons = document.querySelectorAll(".navigation__link")
for (let button of bgButtons) {
    button.addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelector("#header").style.backgroundImage = "url(dist/res/images/" + this.getAttribute('data-mode') + "_mode.gif)"
        localStorage.setItem("backgroundPreference", this.getAttribute('data-mode'))
    })
}

// Game menu
const gameMenu = document.querySelector(".menu")
const gameMenuLinks = document.querySelectorAll(".menu a.menu--play")
for(let link of gameMenuLinks){
    link.addEventListener('click', function(e){
        e.preventDefault()

        if(this.getAttribute('data-value') == "solo"){
            // TODO: Ask for player names, skin and map preference
            document.querySelector('canvas#canvas').style.zIndex = 10
            loadGameLocally()
        }else{
            gameMenu.classList.toggle("blur")
            document.querySelector(".menu--multi").style.display = "flex"
            
            const joinMultiplayerLinks = document.querySelectorAll(".menu--multi--join")
            
            // TODO: Multiplayer modal
            let generatedCode = generateRoomId()
            document.querySelector("#generatedroomid").innerHTML = "Code : " + generatedCode

            for(let joinLink of joinMultiplayerLinks){
                joinLink.addEventListener('click', function(e){
                    e.preventDefault()
                    if(this.innerHTML !== "Rejoindre") return
                    
                    this.innerHTML = "Chargement..."
                    
                    let room
                    if(this.getAttribute('data-value') == "join"){
                        room = document.querySelector('#roomid').value
                        prepareMultiplayer(room)
                        document.querySelector('#roomid').value = ""
                    }else{
                        room = generatedCode
                        prepareMultiplayer(room)
                    }
                })
            }
        }
    })
}

function websiteResetMenu(room) {
    document.querySelector('canvas#canvas').style.zIndex = 10
    document.querySelector(".menu--multi").style.display = "none"
    document.querySelector("h1").innerHTML = "Partie en cours sur la room " + room
    for (let link of gameMenuLinks) {
        link.innerHTML = "Rejoindre"
    }
}

function websiteShowEnd(wonIndex, multiplayer) {
    document.querySelector('canvas#canvas').style.zIndex = 1
    document.querySelector(".menu--end").style.display = "flex"
    document.querySelector("h1").innerHTML = "Bombkill"

    clearTimeout(updater)

    document.querySelector("#playerindex").innerHTML = wonIndex
    document.querySelector("#duration").innerHTML = Math.floor(ELAPSED / 1000 / 60) + " min " + Math.floor(ELAPSED / 1000 % 60) + "s"

    document.querySelector('.menu--end--restart').addEventListener('click', function(e){
        e.preventDefault()

        document.querySelector(".menu--end").style.display = "none"
        if(multiplayer){
            document.removeEventListener("keydown", _handleOnlineKeyboard, true)
            game = null
            gameMenu.classList.toggle("blur")
        }else{
            document.removeEventListener("keydown", _handleLocalKeyboard, true)
            game = null
            loadGameLocally()
        }
    })
}


