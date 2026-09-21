class PreviewManager {

    #mainContainer
    #themeNameDiv
    #cardsDiv
    #themeName
    #themeData
    #themes
    #errorManager

    #videoObserver = null;
    #playingVideos = new Set();
    #MAX_PLAYING = 4;


    constructor() {
        this.#mainContainer = document.querySelector(".theme-container")

        this.#themeName = new URL(window.location.href).searchParams.get('themeName');
        let themes = new Themes();
        this.#themes = themes.getThemes();
        this.#errorManager = new ErrorManager();


        this.#themeNameDiv = this.#mainContainer.querySelector(".theme-container__title")
        this.#cardsDiv = this.#mainContainer.querySelector(".theme-container__themes_cards")

        this.#startRender();
    }

    async #initTheme() {
        let json_manager = new JsonManager();
        if (!this.#themes.includes(this.#themeName)) {
            this.#errorManager.show("Неверная тема")
            throw new Error(`Неверная тема! ${this.#themeName}`);
        }

        const data = await json_manager.readJson(`datapacks/${this.#themeName}`);
        this.#themeData = data;
    }

    #buildCardHTML(name, url, type) {
        const media = type === 'video'
            ? `<video data-src="${url}" preload="none" muted loop playsinline
                style="width: 100%; height: 100%; object-fit: cover;"></video>`
            : `<img src="${url}" alt="" loading="lazy">`;

        return `
        <div class="theme-container__themes_card">
            <p class="theme-container__subtitle">${name}</p>
            <div class="theme-container__hero-image">${media}</div>
        </div>
    `;
    }

    async #startRender() {
        await this.#initTheme();
        let heroes = this.#themeData.objects;
        const { type, name } = this.#themeData.settings;

        this.#themeNameDiv.innerHTML = `Тема "${name}"`

        const html = Object.values(heroes)
            .map(hero => this.#buildCardHTML(hero.name, hero.image, type))
            .join('');

        this.#cardsDiv.insertAdjacentHTML('beforeend', html);

        this.#setupLazyVideos();
    }

    #setupLazyVideos() {
        this.#videoObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                const video = entry.target;
                if (entry.isIntersecting) {
                    this.#playVideo(video);
                } else {
                    video.pause();
                    this.#playingVideos.delete(video);
                }
            }
        }, {
            rootMargin: "200px 0px",
            threshold: 0.1
        });

        this.#cardsDiv.querySelectorAll("video").forEach(v => this.#videoObserver.observe(v));
    }

    async #playVideo(video) {
        if (this.#playingVideos.has(video)) return;

        while (this.#playingVideos.size >= this.#MAX_PLAYING) {
            const oldest = this.#playingVideos.values().next().value;
            oldest.pause();
            this.#playingVideos.delete(oldest);
        }

        if (!video.src) video.src = video.dataset.src;

        try {
            await video.play();
            this.#playingVideos.add(video);
        } catch (e) {
        }
    }
} 