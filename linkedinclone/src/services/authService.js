import customaxios from "../axios";

async function registerOrLogin({ token }) {
    let res = await customaxios.post('auth', { googleid: token })
    return res.data;
}


export {registerOrLogin}