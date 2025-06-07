import {deletePost} from '../api.js'
import {goToPage, user} from '../index.js'
import {AUTH_PAGE, POSTS_PAGE} from '../routes.js'

export const deletePostComponent = (token) => {
    const deletePostButtons = document.querySelectorAll('.delete-post-button')

    deletePostButtons.forEach((deletePostButton) => {
        deletePostButton.addEventListener('click', async (event) => {
            event.stopPropagation()

            console.log('user:', user)

            if (!token) {
                alert('Необходимо авторизоваться')
                goToPage(AUTH_PAGE)
                return
            }

            let userId = user._id
            const postId = deletePostButton.dataset.postId

            const postElement = deletePostButton.closest('.post')
            const authorId = postElement.querySelector('.post-header').dataset.userId

            console.log('authorId:', authorId)
            console.log('user.id:', userId)

            if (authorId !== userId) {
                alert('Нельзя удалить чужой пост')
                return
            }

            try {
                const messageForDeletePost = confirm('Вы уверены, что хотите удалить пост? ',)

                if (messageForDeletePost) {
                    await deletePost({token, postId})
                    console.log('Пост успешно удален')
                    return goToPage(POSTS_PAGE)
                } else {
                    console.log('Удаление поста отменено')
                    return
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Сессия истекла. Пожалуйста, авторизуйтесь')
                } else {
                    alert('В процессе удаления поста произошла ошибка')
                }
            }
        })
    })
}