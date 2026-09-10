class GameManager {
    #main_div;
    #spy_count;
    #spy_count_input;
    #players_divs = [];
    #players = [];
    #start_button;
    #error_manager;
    #theme_name;
    #themes;


    constructor(main_div) {
        this.#main_div = main_div;

        this.#error_manager = new ErrorManager();

        let themes = new Themes();
        this.#themes = themes.getThemes();

        this.#players_divs = Array.from(this.#main_div.querySelectorAll(".player"))
        let i = 0;

        this.#players_divs.forEach((player_div) => {
            this.#players.push(player_div.value)
            player_div.id = i;
            i++;

            player_div.addEventListener('change', () => {
                this.#changeValue(player_div);
            })
        })

        this.#start_button = this.#main_div.querySelector("#start-game-button");

        this.#spy_count_input = this.#main_div.querySelector('#spy-count-input');
        this.#spy_count = this.#main_div.querySelector('#spy-count-input').value;

        this.#spy_count_input.addEventListener('change', () => {
            this.#spy_count = this.#main_div.querySelector('#spy-count-input').value;
        })

        const settings_string = localStorage.getItem('user_settings')
        const settings = JSON.parse(settings_string);
        if (settings) {
            console.log(settings)
            this.#theme_name = settings.theme_name
            this.#players = []
            this.#players = settings.players
            this.#spy_count = settings.spy_count

            const players_div = this.#main_div.querySelector("#players_div");

            players_div.innerHTML = "";

            this.#players_divs = [];


            this.#players.forEach((player, index) => {
                players_div.insertAdjacentHTML("beforeend",
                    `
                    <input class="div-settings__input player" value="${player}" id="${index}"></input>
                    `
                )
                const player_div = players_div.querySelector(`[id="${index}"]`);

                player_div.addEventListener('change', () => {
                    this.#changeValue(player_div);
                });

                this.#spy_count_input.value = this.#spy_count;
            })

            let i = 0;
            this.#players_divs.forEach((player_div) => {
                this.#players.push(player_div.value)
                player_div.id = i;
                i++;

                player_div.addEventListener('change', () => {
                    this.#changeValue(player_div);
                })
            })
        }

        this.#initTheme();
        this.#createAddButton();

        this.#start_button.addEventListener('click', () => {
            try {
                const game = new Game(this.#players, this.#spy_count, this.#main_div, this.#theme_name);
                this.#saveSettings();
                game.start_game();
            }
            catch (error) {
                this.#error_manager.show(error.message, "error");
            }

        })
    }

    #saveSettings() {
        if (this.#main_div.querySelector('#save-settings').checked) {
            console.log('settings_save')
            const settings = {
                "players": this.#players,
                "spy_count": this.#spy_count_input.value,
                "theme_name": this.#theme_name,
                "test": "test"
            }
            console.log(settings);
            const settings_string = JSON.stringify(settings);
            localStorage.removeItem('user_settings');
            console.log(11111);
            localStorage.setItem('user_settings', settings_string);
        }
        else {
            localStorage.removeItem("user_settings")
        }
    }

    #initTheme() {
        let theme_div = document.querySelector("#theme")
        this.#theme_name = theme_div.value;
        theme_div.addEventListener('change', () => {
            if (theme_div.value == "rand") {
                let random_theme_id = Math.floor(Math.random() * this.#themes.length)
                this.#theme_name = this.#themes[random_theme_id]
            }
            else {
                this.#theme_name = theme_div.value;
            }
        })
    }
    #createAddButton() {
        const inputs_div = this.#main_div.querySelector(".div-settings__inputs");
        const addButton = this.#main_div.querySelector("#add-player-button");

        addButton.addEventListener('click', () => {
            inputs_div.insertAdjacentHTML("beforeend",
                `
            <input class="div-settings__input player" value="Игрок ${this.#players.length + 1}" id="${this.#players.length}"></input>
            `
            )
            const main_div = this.#main_div;

            this.#players_divs.push(main_div.querySelector(`[id="${this.#players.length}"]`))
            this.#players.push(main_div.querySelector(`[id="${this.#players.length}"]`).value)
            const player_div = main_div.querySelector(`[id="${this.#players.length - 1}"]`);
            player_div.addEventListener('change', () => {
                this.#changeValue(player_div);
            })
        })
    }

    #changeValue(player_div) {
        if (!player_div.value) {
            this.#error_manager.show("Неверное имя игрока, оно сброшено до стандартного", "error");
            player_div.value = `Игрок ${Number(player_div.id) + 1}`
        }
        this.#players[player_div.id] = player_div.value;
    }
}