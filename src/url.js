// let url = 'http://localhost:8080/pdos/api';
let origin = window.location.origin + window.location.pathname;
let pathname = origin.replace("index.html","");

let url = pathname +'api';
export default url; 