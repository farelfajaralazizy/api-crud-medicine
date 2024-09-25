import  Jwt  from "jsonwebtoken";
import {NextFunction, Request,Response} from "express"

const verifyToken = async (req:Request, res:Response, next:NextFunction) => {
    try {
        //read token
        const header = req.headers.authorization
        const [type,token] = header ? header.split(""):[]

        //verify token
        const signature = process.env.SECRET || ""
        const isVerivied = Jwt.verify(token,signature)
        if(!isVerivied){
            return res.status(401).json({message:"Unathorized"})
        }
        next()
    } catch (error) {
        return res.status(401)
        .json({
            message: "error"
        })
    }
}

export { verifyToken }