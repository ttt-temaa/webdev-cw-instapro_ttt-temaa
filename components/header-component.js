import {goToPage, logout, user} from '../index.js'
import {ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE} from '../routes.js'

/**
 * Компонент заголовка страницы.
 * Этот компонент отображает шапку страницы с логотипом, кнопкой добавления постов/входа и кнопкой выхода (если пользователь авторизован).
 *
 * @param {HTMLElement} params.element - HTML-элемент, в который будет рендериться заголовок.
 * @returns {HTMLElement} Возвращает элемент заголовка после рендеринга.
 */
export function renderHeaderComponent({element}) {
    /**
     * Рендерит содержимое заголовка.
     */
    element.innerHTML = `
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${user ? `<div title="Добавить пост" class="add-post-sign"></div>` : 'Войти'}
      </button>
      ${user ? `
          <div class="user-menu">
            <button title="${user.name}" class="header-button user-button">${user.name} ▼</button>
            <div class="dropdown-menu" style="display: none;">
              <button class="logout-button">Выйти</button>
            </div>
          </div>` : ''}  
  </div>
  `

    /**
     * Обработчик клика по кнопке "Добавить пост"/"Войти".
     * Если пользователь авторизован, перенаправляет на страницу добавления постов.
     * Если пользователь не авторизован, перенаправляет на страницу авторизации.
     */
    element
        .querySelector('.add-or-login-button')
        .addEventListener('click', () => {
            if (user) {
                goToPage(ADD_POSTS_PAGE)
            } else {
                goToPage(AUTH_PAGE)
            }
        })

    /**
     * Обработчик клика по логотипу.
     * Перенаправляет на страницу с постами.
     */
    element.querySelector('.logo').addEventListener('click', () => {
        goToPage(POSTS_PAGE)
    })

    /**
     * Обработчик клика по кнопке пользователя.
     * Показывает или скрывает выпадающее меню.
     */
    const userButton = element.querySelector('.user-button')
    const dropdownMenu = element.querySelector('.dropdown-menu')

    if (userButton) {
        userButton.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '' ? 'block' : 'none'
        })
    }

    /**
     * Обработчик клика по кнопке "Выйти".
     * Если кнопка существует (т.е. пользователь авторизован), вызывает функцию `logout` после подтверждения.
     */
    const logoutButton = element.querySelector('.logout-button')
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите выйти?')) {
                logout()
            }
        })
    }

    return element
}
