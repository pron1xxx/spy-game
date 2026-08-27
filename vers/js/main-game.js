class Game {
    #stage;
    #players;
    #spy_count;
    #theme_data;

    constructor(players, spy_count, theme_data) {
        this.#stage = "start";
        this.#players = players;
        this.#spy_count = spy_count;
        this.#theme_data = theme_data;
    }

    #choose_spy(players, spy_count) {
        const spys = [];
        for(let i=0; i < spy_count; i++) {
        let spy;
        do {
            spy = players[Math.floor(Math.random() * players.length)];
        }
        while (spys.includes(spy))

        spys.push(spy)
        }

        return spys;
    }

    getSpys(players, spy_count) {
        return this.#choose_spy(players, spy_count)
    }
}