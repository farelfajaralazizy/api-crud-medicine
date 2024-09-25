import { Request, Response } from "express";
import { date, number } from "joi";
import { Prisma, PrismaClient } from "@prisma/client";
import path from "path"
import fs from "fs"
import { ROOT_DIRECTORY } from "../config";

// create objek of prisma
const prisma = new PrismaClient({ errorFormat: "minimal" })
type DrugType = "Syrup" | "Tablet" | "Powder"
const createMedicine = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const stock: number = Number(req.body.stock)
        const exp_date: Date = new Date(req.body.exp_date)
        const price: number = Number(req.body.price)
        const type: DrugType = req.body.type
        const photo: string = req.file?.filename || ``

        //save a new medicine to DB

        const newMedicine = await prisma.medicine.create({
            data: {
                name, stock, exp_date, price, type, photo
            }
        })
        return res.status(200)
            .json({
                message: "New Medicine has been created",
                data: newMedicine
            })
    } catch (error) {
        return res.status(500)
            .json(error)
    }

}
const readMedicine = async (
    req: Request, res: Response
) => {
    try {
        const search = req.query.search

        // get all medicine 
        const allMedicine = await prisma.medicine.findMany({
            where: {
                OR: [
                    { name: { contains: search?.toString() || "" } }
                ]
            }
        })
        return res.status(200).json({
            message: "medicine has been retrivied",
            data: allMedicine
        })
    } catch (error) {
        res.status(500).json(error)

    }
}

const updateMedicine = async (req: Request, res: Response) => {

    try {
        //read id of medicine that send at params URL
        const id = req.params.id

        //check existing medicine baseed on id
        const findMedicine = await prisma.medicine.findFirst({
            where: { id: Number(id) }
        })
        if (!findMedicine) {
            return res.status(200)
                .json({
                    message: "medicine gaonok"
                })
        }
        /** check change file or not */
        if (req.file) {
            /** assume that user want to replace photo */
            /** define the old of file name */
            let oldFilename = findMedicine.photo
            /** define path/ location of old file */
            let pathFile = `${ROOT_DIRECTORY}/public/medicine-photo/${oldFilename}`
            /** check  is file exists */
            let existsfile = fs.existsSync(pathFile)

            if(existsfile && oldFilename !== ``){
                fs.unlinkSync(pathFile)
            }
        }

        const { name, stock, price, type, exp_date } = req.body

        //updated medicine 
        const savedMedicine = await prisma.medicine.
            update({
                where: { id: Number(id) },
                data: {
                    name: name ?? findMedicine.name,
                    stock: stock ? Number(stock) : findMedicine.stock,
                    price: price ? Number(price) : findMedicine.price,
                    type: type ? type : findMedicine.type,
                    exp_date: exp_date ? new Date(exp_date) : findMedicine.exp_date,
                    photo: req.file ? req.file.filename : findMedicine.photo
                }
            })
        return res.status(200)
            .json({
                message: "medicine saved",
                data: savedMedicine
            })
    } catch (error) {
        console.log(error);

        return res.status(500)
            .json(error)

    }
}

const deleteMedicine = async (req: Request, res: Response) => {
    try {
        // read id form rquest paramas
        const id = req.params.id
        //check existing medicine
        const findMedicine = await prisma.medicine.findFirst({
            where: { id: Number(id) }
        })

        if (!findMedicine) {
            return res.status(200)
                .json({ message: "medicine ra enek" })
        }
/** delete the file */
let oldFilename = findMedicine.photo
let pathFile = `${ROOT_DIRECTORY}/public/medicine-photo`
let existsfile = fs.existsSync(pathFile)
fs.unlinkSync(pathFile)

        //delete medicine
        const saveMedicine = await prisma.medicine.delete({
            where: { id: Number(id) }
        })
        return res.status(200)
            .json({
                message: "medicine has been removed",
                data: saveMedicine
            })
    } catch (error) {
        return res.status(500)
            .json(error)

    }
}


export { createMedicine, readMedicine, updateMedicine, deleteMedicine }