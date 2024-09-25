import Express from 'express'
import MedicineRoute from "./router/medicineRouter"
import AdminRoute from "./router/adminRoute"

const app = Express()

// allow to read a body request with json format
app.use(Express.json())

// prefix for medicine route
app.use(`/medicine`, MedicineRoute)

app.use(`/admin`, AdminRoute)

const PORT = 1992

app.listen(PORT, () => {
    console.log(`Server DrugStore is running on port ${PORT}`)
})