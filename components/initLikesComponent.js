import {addLikePost, removeLikePost} from '../api.js'
import {delay} from '../helpers.js'
import {goToPage} from '../index.js'
import {AUTH_PAGE} from '../routes.js'

export const initLikeComponent = (renderPostsPageComponent, appEl, token, posts,) => {
    const likesButtons = appEl.querySelectorAll('.like-button')

    likesButtons.forEach((likeButton) => {
        likeButton.addEventListener('click', async (event) => {
            event.stopPropagation()

            const postId = likeButton.dataset.postId
            const isLiked = likeButton
                .querySelector('img')
                .src.includes('like-active.svg')

            if (!token) {
                alert('Необходимо авторизоваться')
                goToPage(AUTH_PAGE)
                return
            }

            likeButton.classList.add('-loading-like')

            await delay(2000)

            try {
                const updatePost = isLiked ? await removeLikePost({token, postId}) : await addLikePost({token, postId})

                updatePostInPosts(updatePost.post, posts)
                renderPostsPageComponent({appEl, posts})
                renderModalLikesList(posts)
            } catch (error) {
                handleError(error)
            } finally {
                likeButton.classList.remove('-loading-like')
            }
        })
    })
}

const updatePostInPosts = (updatedPost, posts) => {
    const postIndex = posts.findIndex((post) => post.id === updatedPost.id)
    if (postIndex !== -1) {
        posts[postIndex] = updatedPost
    }
}

const handleError = (error) => {
    console.error(error)
    if (error.response && error.response.status === 401) {
        alert('Сессия истекла. Пожалуйста, авторизуйтесь')
        goToPage(AUTH_PAGE)
    } else {
        alert('Произошла ошибка. Пожалуйста, попробуйте снова.')
    }
}

const renderLikesList = (likesList, container, posts) => {
    container.innerHTML = '';

    const userItems = likesList
        .map((like) => {
            const userId = like._id || like.id;
            const userName = like.name;
            const userImageUrl = like.imageUrl || null;

            const userPost = posts.find((post) => post.user.id === userId);

            console.log(`Processing user: ${userName}, ID: ${userId}, User Post:`, userPost);

            if (!userName && !userPost && !userImageUrl) return null;

            const userItem = document.createElement('div');
            userItem.classList.add('user-item');

            const userImage = document.createElement('img');
            userImage.src = userImageUrl || (userPost ? userPost.user.imageUrl : '');
            userImage.classList.add('post-header__user-image');

            const userNameEl = document.createElement('p');
            userNameEl.textContent = userName;

            userItem.appendChild(userImage);
            userItem.appendChild(userNameEl);

            return userItem;
        })
        .filter((item) => item !== null);

    container.append(...userItems);
}


export const renderModalLikesList = (posts, isUserLikes = false) => {
    const likeCountsElements = document.querySelectorAll('.post-likes-count')
    const closeModalButtons = document.querySelectorAll('.button-close-modal')

    likeCountsElements.forEach((likeCountElement) => {
        likeCountElement.addEventListener('click', (event) => {
            event.stopPropagation()

            const postId = likeCountElement.dataset.postId
            const post = posts.find((post) => post.id === postId)
            if (!post) return

            const likesList = post.likes

            const postElement = likeCountElement.closest('.post')
            const modalContainer = postElement.querySelector('.post-modal-container',)
            const likesListElement = modalContainer.querySelector('.post-modal-list')

            renderLikesList(likesList, likesListElement, posts, isUserLikes)

            modalContainer.style.display = 'flex'
        })
    })

    closeModalButtons.forEach((closeModalButton) => {
        closeModalButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const postElement = closeModalButton.closest('.post')
            if (!postElement) return
            const modalContainer = postElement.querySelector('.post-modal-container',)
            modalContainer.style.display = 'none'
        })
    })
}



