import {loginUser, registerUser} from '../api.js'
import {renderHeaderComponent} from './header-component.js'
import {renderUploadImageComponent} from './upload-image-component.js'

/**
 * Компонент страницы авторизации.
 * Этот компонент предоставляет пользователю интерфейс для входа в систему или регистрации.
 * Форма переключается между режимами "Вход" и "Регистрация".
 *
 * @param {HTMLElement} params.appEl - Корневой элемент приложения, в который будет рендериться страница.
 * @param {Function} params.setUser - Функция, вызываемая при успешной авторизации или регистрации.
 *                                    Принимает объект пользователя в качестве аргумента.
 */
export function renderAuthPageComponent({appEl, setUser}) {
    /**
     * Флаг, указывающий текущий режим формы.
     * Если `true`, форма находится в режиме входа. Если `false`, в режиме регистрации.
     * @type {boolean}
     */
    let isLoginMode = true

    /**
     * URL изображения, загруженного пользователем при регистрации.
     * Используется только в режиме регистрации.
     * @type {string}
     */
    let imageUrl = ''

    const setError = (message) => {
        appEl.querySelector('.form-error').textContent = message
    }

    const toggleMode = () => {
        isLoginMode = !isLoginMode
        renderForm()
    }

    const handleAuth = () => {
        setError('')

        const login = document.getElementById('login-input').value.trim()
        const password = document.getElementById('password').value.trim()

        if (!login) {
            alert('Введите логин')
            return
        }
        if (!password) {
            alert('Введите пароль')
            return
        }

        if (isLoginMode) {
            loginUser({login, password})
                .then((user) => setUser(user.user))
                .catch((error) => {
                    console.warn(error)
                    setError(error.message)
                })
        } else {
            const name = document.getElementById('name-input').value.trim()

            if (!name) {
                alert('Введите имя')
                return
            }
            if (!imageUrl) {
                alert('Не выбрана фотография')
                return
            }

            registerUser({login, password, name, imageUrl})
                .then((user) => setUser(user.user))
                .catch((error) => {
                    console.warn(error)
                    setError(error.message)
                })
        }
    }

    /**
     * Рендерит форму авторизации или регистрации.
     * В зависимости от значения `isLoginMode` отображает соответствующий интерфейс.
     */
    const renderForm = () => {
        const html = `
        <div class="page-container">
            <div class="header-container"></div>
            <div class="form">
                <h3 class="form-title">
                    ${isLoginMode ? 'Вход в&nbsp;Instapro' : 'Регистрация в&nbsp;Instapro'}
                </h3>
                <div class="form-inputs">
                    ${!isLoginMode ? `<div class="upload-image-container"></div>` : ''}
                    ${!isLoginMode ? `<input type="text" id="name-input" class="input" placeholder="Имя" />` : ''}
                    <input type="text" id="login-input" class="input" placeholder="Логин" />
                    <div class="password-container">
                        <input type="password" id="password" class="input" placeholder="Введите пароль" />
                        <svg id="toggleIcon" class="toggle-visibility" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="3" stroke="gray" stroke-width="2"/>
                            <path d="M2 12C4 8 8 4 12 4C16 4 20 8 22 12C20 16 16 20 12 20C8 20 4 16 2 12Z" stroke="gray" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="form-error"></div>
                    <button class="button" id="auth-button">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
                </div>
                <div class="form-footer">
                    <p class="form-footer-title">
                        ${isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                        <button class="link-button" id="toggle-button">${isLoginMode ? 'Зарегистрироваться' : 'Войти'}</button>
                    </p>
                </div>
            </div>
        </div>
                `
        appEl.innerHTML = html

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        if (!isLoginMode) {
            const uploadContainer = document.querySelector('.upload-image-container',)
            renderUploadImageComponent({
                element: uploadContainer, onImageUrlChange(newUrl) {
                    imageUrl = newUrl
                },
            })
        }

        document.getElementById('auth-button').onclick = handleAuth

        document.getElementById('toggle-button').onclick = () => {
            toggleMode()
        }

        const passwordInput = document.getElementById('password')
        const toggleIcon = document.getElementById('toggleIcon')
        toggleIcon.onclick = () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password'
            passwordInput.type = type
        }
    }

    renderForm()
}
