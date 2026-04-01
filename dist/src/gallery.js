const carousel = document.querySelector('.carousel');
let cells = document.querySelectorAll('.carousel__cell');

function getRadius() {
    // 6개일 때는 모바일에서 조금 더 멀리 떨어뜨리는 것이 예쁩니다 (220 -> 250)
    return window.innerWidth < 600 ? 250 : 850;
}

let radius = getRadius();
// 카드가 추가되었으므로 자동으로 각도를 계산합니다 (360 / 6 = 60)
let cellCount = cells.length;
let theta = 360 / cellCount;

let selectedIndex = 0;
let isDragging = false;
let startX = 0;
let currentRotation = 0;
let rotationOnMouseDown = 0;
let isMove = false;

function initLayout() {
    radius = getRadius();
    cells = document.querySelectorAll('.carousel__cell');
    cellCount = cells.length;
    theta = 360 / cellCount;

    cells.forEach((cell, i) => {
        const cellAngle = theta * i;
        cell.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;

        // 클릭(상세보기) 이벤트
        cell.onclick = () => {
            if (!isMove) {
                const img = cell.style.backgroundImage;
                const title = cell.getAttribute('data-title');
                const desc = cell.getAttribute('data-desc');
                openDetail(img, title, desc);
            }
        };
    });
}

function rotateCarousel() {
    const moveZ = window.innerWidth < 600 ? -radius * 2.5 : -radius;
    carousel.style.transform = `translateZ(${moveZ}px) rotateY(${currentRotation}deg)`;
}

/* --- 마우스 이벤트 --- */
window.addEventListener('mousedown', (e) => {
    isDragging = true; isMove = false;
    startX = e.clientX;
    rotationOnMouseDown = currentRotation;
    carousel.style.transition = 'none';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    isMove = true;
    const mouseDeltaX = e.clientX - startX;
    currentRotation = rotationOnMouseDown + (mouseDeltaX * 0.2);
    rotateCarousel();
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1)';
    selectedIndex = Math.round(currentRotation / theta);
    currentRotation = selectedIndex * theta;
    rotateCarousel();
});

/* --- 터치 이벤트 --- */
window.addEventListener('touchstart', (e) => {
    isDragging = true; isMove = false;
    startX = e.touches[0].clientX;
    rotationOnMouseDown = currentRotation;
    carousel.style.transition = 'none';
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    isMove = true;
    const touchDeltaX = e.touches[0].clientX - startX;
    currentRotation = rotationOnMouseDown + (touchDeltaX * 0.3);
    rotateCarousel();
}, { passive: true });

window.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1)';
    selectedIndex = Math.round(currentRotation / theta);
    currentRotation = selectedIndex * theta;
    rotateCarousel();
});

window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) selectedIndex--; else selectedIndex++;
    currentRotation = selectedIndex * theta;
    rotateCarousel();
});

window.addEventListener('resize', () => {
    initLayout();
    rotateCarousel();
});

function openDetail(img, title, desc) {
    document.getElementById('detail-img').style.backgroundImage = img;
    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-description').innerText = desc;
    document.getElementById('detail-view').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('detail-view').style.display = 'none';
}

initLayout();
rotateCarousel();