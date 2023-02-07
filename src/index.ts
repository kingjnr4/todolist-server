import { AuthRoute } from './routes/auth/auth.routes';
import App from "./app"


/* Creating a new instance of the App class and passing in an array of routes. */
const bootstrap = () =>{
    try{
    const app = new App([
        new AuthRoute()
    ])
    app.listen()
}catch{
    bootstrap()
}
}

bootstrap()