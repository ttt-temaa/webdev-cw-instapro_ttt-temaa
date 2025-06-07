import {POSTS_PAGE, USER_POSTS_PAGE} from '../routes.js'
import {renderHeaderComponent} from './header-component.js'
import {posts, goToPage, getToken} from '../index.js'
import {formatDistanceToNow} from 'date-fns'
import {ru} from 'date-fns/locale'
import {clearingHtml} from '../helpers.js'
import {
    initLikeComponent, renderModalLikesList,
} from './initLikesComponent.js'
import {deletePostComponent} from './deletePostComponent.js'

export function renderPostsPageComponent({appEl}) {
    const postsHtml = posts
        .map((post, index) => {
            const createdPostDate = post.createdAt

            const result = formatDistanceToNow(createdPostDate, {
                addSuffix: true, locale: ru,
            })

            let likeButtonImg = post.isLiked ? '<img src="./assets/images/like-active.svg"></img>' : '<img src="./assets/images/like-not-active.svg"></img>'

            let likeCountText

            if (post.likes.length === 0) {
                likeCountText = '0'
            } else if (post.likes.length === 1) {
                likeCountText = `${clearingHtml(post.likes[0].name)}`
            } else if (post.likes.length === 2) {
                likeCountText = `${clearingHtml(post.likes[0].name)}, ${clearingHtml(post.likes[1].name)}`
            } else {
                likeCountText = `${post.likes.length} пользователям`
            }

            return `<li class="post" data-post-index="${index}"> 
                <div class="post-header" data-user-id="${post.user.id}">
                    <div class="post-header__user-data">
                        <img src="${post.user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${clearingHtml(post.user.name)}</p>
                    </div>
                </div>
                <div class="post-image-container">
                    <img class="post-image zoomable-image" src="${post.imageUrl}">
                </div>
                <div class="post-modal-container" style="display: none">
                    <div class="post-modal-content">
                        <p class="post-modal-header">Пользователи, которым понравился пост</p>
                        <span class="button-close-modal">&times;</span>
                    </div>
                    <div class="post-modal-list"></div>
                </div>
                <div class="post-likes">
                    <button data-post-id="${post.id}" class="like-button">
                        ${likeButtonImg}
                    </button>
                    <p class="post-likes-text">
                        Нравится: <strong class="post-likes-count" data-post-id="${post.id}">${likeCountText}</strong> 
                    </p>
                </div>
                <p class="post-text">
                    <span class="user-name">${clearingHtml(post.user.name)}</span>
                    ${clearingHtml(post.description)}
                </p>
                <div class="footerPost">
                    <p class="post-date">${result}</p>
                    <button data-post-id="${post.id}" class="delete-button delete-post-button">Удалить пост ⬆</button>
                </div>
                </li>`
        })
        .join('')

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`

    appEl.innerHTML = appHtml

    initLikeComponent(renderPostsPageComponent, appEl, getToken(), posts)
    deletePostComponent(getToken(), POSTS_PAGE)
    renderModalLikesList(posts)

    const images = document.querySelectorAll('.zoomable-image')
    images.forEach((image) => {
        image.addEventListener('click', () => {
            image.classList.toggle('zoomed')
        })
    })

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', (event) => {
            event.stopPropagation()
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }
}
