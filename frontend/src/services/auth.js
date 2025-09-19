export function saveToken(t){ localStorage.setItem('token', t) }
export function getToken(){ return localStorage.getItem('token') }
export function saveUserId(id){ localStorage.setItem('tmpUserId', id) }
export function getUserId(){ return localStorage.getItem('tmpUserId') }
export function clearUserId(){ localStorage.removeItem('tmpUserId') }
export function logout(){ localStorage.removeItem('token'); localStorage.removeItem('tmpUserId') }
