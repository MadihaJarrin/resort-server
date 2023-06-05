const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

// Create an instance of Express
const app = express();
app.use(express.json());

// Connect to MySQL using Sequelize
const sequelize = new Sequelize("resort-manage", "root", "987654321",
    {
        host: "localhost",
        dialect: "mysql",

    }
);

// Define a model for your table
const Resort = sequelize.define("resort", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    road: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Create the table if it doesn't exist
sequelize.sync();

// Define routes
app.get("/resorts", async (req, res) => {
    try {
        const Resorts = await Resort.findAll();
        res.json(Resorts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/resorts", async (req, res) => {
    try {
        const { name, city, place, road, price, description, imageUrl } = req.body;
        const Resort = await Resort.create({
            name,
            city,
            place,
            road,
            price,
            description,
            imageUrl,
        });
        res.status(201).json(Resort);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});