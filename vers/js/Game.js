class Game {
    #players;
    #spy_count;
    #theme_data;
    #main_container;
    #spys;

    constructor(players, spy_count, main_container) {
        this.#players = players;
        this.#spy_count = spy_count;
        // this.#theme_data = theme_data;
        this.#main_container = main_container;

        if (this.#players.length < 3) {
            throw new Error("Количество игроков не менее 3")
        }
        else if (this.#spy_count < 1) {
            throw new Error("Не менее 1 шпиона")
        }
        else if (this.#players.length < this.#spy_count) {
            throw new Error("Количество шпионов не может превышать количество игроков!");
        }
    }

    #choose_spy() {
        const spys = [];
        if (this.#spy_count == "rand") {
            this.#spy_count = Math.floor(Math.random() * this.#players.length) + 1
        }
        for (let i = 0; i < this.#spy_count; i++) {
            let spy;
            do {
                spy = this.#players[Math.floor(Math.random() * this.#players.length)];
            }
            while (spys.includes(spy))

            spys.push(spy)
        }

        return spys;
    }

    #render_gameScreen() {
        this.#main_container.className = "container";
        this.#main_container.innerHTML = "";
        this.#main_container.insertAdjacentHTML("beforeend",
            `
            <div class="big-image">
                <div alt="" class="big-image__image">
            </div>
            <div class="div-play">
                <h2 class="div-play__title"> ${this.#players[0]} </h2>
                <div class="div-play__button-div">
                    <button class="div-main__button" id="showButton"> Показать </button>
                    <p class="div-play__text"> Нажимайте на кнопку, когда никто не будет видеть ваш экран </p>
                </div>
            </div>
            `
        );
        this.#main_container.querySelector("#showButton").addEventListener('click', () => {
            this.nextStage(this.#players[0], "show");
        })
    }

    start_game() {
        this.#spys = this.#choose_spy();
        this.#render_gameScreen();
    }

    nextStage(player, action) {
        if (action == "show") {
            if (this.#spys.includes(player)) {
                this.#main_container.innerHTML = "";
                this.#main_container.insertAdjacentHTML("beforeend",
                    `
                    <div class="big-image">
                        <div alt="" class="big-image__image">
                    </div>
                    <div class="div-play">
                        <h2 class="div-play__title"> ${player} </h2>
                        <p class="div-play__subtitle"> Роль - шпион </p>
                        <div class="div-play__button-div">
                            <button class="div-main__button" id="hideButton"> Скрыть </button>
                            <p class="div-play__text"> Нажимайте на кнопку и передавайте телефон дальше </p>
                        </div>
                    </div>
                    `
                )
            }
            else {
                this.#main_container.innerHTML = "";
                this.#main_container.insertAdjacentHTML("beforeend", 
                    `
                    <div class="big-image">
                        <div alt="" class="big-image__image">
                    </div>
                    <div class="div-play">
                        <h2 class="div-play__title"> ${player} </h2>
                        <div class="div-play__texts-div">
                            <p class="div-play__subtitle"> hero </p>
                            <div class="div-play__hero-image"><img
                                    src="https://cdn.steamstatic.com/apps/dota2/images/dota_react/heroes/alchemist.png" alt="">
                            </div>
                        </div>

                        <div class="div-play__button-div">
                            <button class="div-main__button" id="hideButton"> Скрыть </button>
                            <p class="div-play__text"> Нажимайте на кнопку и передавайте телефон дальше </p>
                        </div>
                    </div>
                    `
                )
            }
            this.#main_container.querySelector("#hideButton").addEventListener('click', () => {
            this.nextStage(player, "hide");
        })
        }
        else if (action == "hide") {
            const new_player_index = this.#players.indexOf(player) + 1
            if (new_player_index == this.#players.length) {
                this.#endGame();
                return;
            }
            this.#main_container.innerHTML = "";
            this.#main_container.insertAdjacentHTML("beforeend",
            `
            <div class="big-image">
                <div alt="" class="big-image__image">
            </div>
            <div class="div-play">
                <h2 class="div-play__title"> ${this.#players[new_player_index]} </h2>
                <div class="div-play__button-div">
                    <button class="div-main__button" id="showButton"> Показать </button>
                    <p class="div-play__text"> Нажимайте на кнопку, когда никто не будет видеть ваш экран </p>
                </div>
            </div>
            `
        );
        this.#main_container.querySelector("#showButton").addEventListener('click', () => {
            this.nextStage(this.#players[new_player_index], "show");
        })
        }
    }

    #endGame() {
        this.#main_container.innerHTML = "";
            this.#main_container.insertAdjacentHTML("beforeend",
            `
            <div class="big-image">
                <div alt="" class="big-image__image">
            </div>
            <div class="div-play">
                <h2 class="div-play__title"> Все роли разданы </h2>
                <div class="div-play__button-div">
                    <button class="div-main__button" id="refreshGame"> Играть снова </button>
                    <p class="div-play__text"> Нажимайте на кнопку если хотите сыграть снова </p>
                </div>
            </div>
            `
        )
        this.#main_container.querySelector("#refreshGame").addEventListener('click', () => {
            location.reload();
        })
    }
}