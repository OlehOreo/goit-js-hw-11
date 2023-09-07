// Дефолтні значення для нових фото
const defaults = {
  likes: '0',
  views: '0',
  comments: '0',
  downloads: '0',
};

export default function createMarkup(arrImg) {
  return arrImg
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" width="450px" height="350px" alt="${tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b class="activity">Likes</b>
            <span class="user-activity">${likes || defaults.likes}</span>
          </p>
          <p class="info-item">
            <b class="activity">Views</b>
            <span class="user-activity">${views || defaults.views}</span>
          </p>
          <p class="info-item">
            <b class="activity">Comments</b>
            <span class="user-activity">${comments || defaults.comments}</span>
          </p>
          <p class="info-item">
            <b class="activity">Downloads</b>
            <span class="user-activity">${
              downloads || defaults.downloads
            }</span>
          </p>
        </div>
      </div>`;
      }
    )
    .join('');
}
