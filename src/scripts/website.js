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
    link.addEventListener('click', function(){
        if(this.getAttribute('data-value') == "solo"){
            // TODO: Ask for player names, skin and map preference
            loadGameLocally()
        }else{
            // TODO: Multiplayer modal
        }
    })
}


