import {renderHeaderComponent} from './header-component'
import {renderUploadImageComponent} from './upload-image-component'

export function renderAddPostPageComponent({appEl, onAddPostClick}) {
    let imageUrl = ''

    const render = () => {
        const appHtml = `
            <div class="page-container">
            <div class="header-container"></div>
            <div class="form">
                    <h3 class="form-title">Добавить пост</h3>
                    <div class="form-inputs">
                        <div class="upload-image-container">
                            <div class="upload-image">
                                ${imageUrl ? `
                                    <div class="file-upload-image-container">
                                    <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
                                    <button class="file-upload-remove-button button">Заменить фото</button>
                                    </div>
                                    ` : `
                                    <label class="file-upload-label secondary-button">
                                    <input
                                        type="file"
                                        class="file-upload-input"
                                        style="display:none"
                                    />
                                    Выберите фото
                                    </label>
                                `}
                            </div>    
                            <label>
                            Опишите фотографию:
                            <textarea class="input textarea" rows="4" id="description-input"></textarea>
                            </label>
                            <button class="button" id="add-button">Добавить</button>
                        </div>
                    </div>
            </div>
            </div>
        `

        appEl.innerHTML = appHtml

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        const addingImage = document.querySelector('.upload-image')
        if (addingImage) {
            renderUploadImageComponent({
                element: addingImage, onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl
                },
            })
        }

        document.getElementById('add-button').addEventListener('click', () => {
            const imageDescription = document.getElementById('description-input').value // Получаем описание
            const imageUploadUrl = imageUrl

            if (!imageDescription && !imageUploadUrl) {
                alert('Загрузите фото и добавьте к нему описание')
                return
            }

            if (!imageDescription) {
                alert('Добавьте описание к посту')
                return
            }

            if (!imageUploadUrl) {
                alert('Загрузите фото')
                return
            }

            onAddPostClick({
                description: imageDescription, imageUrl: imageUploadUrl,
            })
        })
    }

    render()
}
