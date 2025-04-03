import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin,callback){
        const whitelist = [process.env.FRONTEND_URL]

        if (process.argv[2]==='--api') {//ya que thunderclient y postman no tienen un origen como tal (el navegador si lo tiene) enonces para desarrollar se agrega undefined para q permita trabajar en front y back
            whitelist.push(undefined)
        }
        
        if (!origin || whitelist.includes(origin)) {
            callback(null,true)
        } else {
            callback(new Error('CORS Errors'))
        }
    }
}