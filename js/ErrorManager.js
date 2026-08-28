class ErrorManager {
    constructor() {
        let overlay = document.getElementById('error-overlay');

        if(!overlay) {
            document.body.insertAdjacentHTML("beforebegin", 
                `
                <div id="error-overlay" class="error-overlay">
                    <div class="error-modal">
                        <div class="error-modal__header">
                            <h2 class="error-modal__title">Ошибка</h2>
                            <button class="error-modal__close" id="errorCloseBtn">&times;</button>
                        </div>
                        <p class="error-modal__message" id="errorMessage">error message</p>
                    </div>
                </div>
                `
               ) 
        }
        
        this.overlay = document.getElementById('error-overlay');
        this.message = document.getElementById('errorMessage');
        this.closeBtn = document.getElementById('errorCloseBtn');
        this.title = document.querySelector('.error-modal__title');
        this.modal = document.querySelector('.error-modal');

        this.#initEvents();
    }

    #initEvents() {
        this.closeBtn.addEventListener('click', () => this.hide());
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.style.display !== 'none') {
                this.hide();
            }
        });
    }

    show(message, type = 'error') {
        this.message.textContent = message;
        
        this.modal.className = 'error-modal';
        if (type) {
            this.modal.classList.add(`error-modal--${type}`);
        }
        
        const titles = {
            error: 'Ошибка'
        };
        this.title.textContent = titles[type] || titles.error;
        
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}