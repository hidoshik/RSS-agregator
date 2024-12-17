import photo from './assets/photo.png';
import func from './app.js';
import './styles/main.scss';

console.log('Running');

const photoPng = document.getElementById('photo');

photoPng.src = photo;
console.log(func());