const express = require('express');
const path = require('path');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

dbPath = path.join(__dirname, 'mydatabase.db');
let db = null;

// Initialize the db

const initializeDB = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        app.listen(5000, (err) => {
            if (err) {
                console.error(`Error starting the server: ${err.message}`);
            } else {
                console.log(`Server is running http://localhost:5000/`);
                fetchAndInsertIntoDb();
            }
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Inserting data

const fetchAndInsertIntoDb = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        const checkQuery = `SELECT COUNT(*) AS count FROM product;`;
        const result = await db.get(checkQuery);

        if (result.count === 0) {
            const insertQuery = `
                INSERT INTO product (id, title, price, description, category, image, sold, dateOfSale)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;

            for (const item of data) {
                await db.run(insertQuery, [
                    item.id,
                    item.title,
                    item.price,
                    item.description,
                    item.category,
                    item.image,
                    item.sold,
                    item.dateOfSale
                ], function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log(`Row inserted with ID: ${this.lastID}`);
                    }
                });
            }
        } else {
            console.log('Data already exists. Skipping insertion.');
        }
    } catch (err) {
        console.error(err);
    }
};

//Insert data based on month

const fetchSortAndInsert = async (queryMonth) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        const insertQuery = `
            INSERT INTO product (id, title, price, description, category, image, sold, dateOfSale)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        for (const item of data) {

            const saleDate = new Date(item.dateOfSale);
            const month = saleDate.getMonth() + 1;

            if(month === parseInt(queryMonth, 10)) {
                db.run(insertQuery, [
                    item.id,
                    item.title,
                    item.price,
                    item.description,
                    item.category,
                    item.image,
                    item.sold,
                    item.dateOfSale,
                ]);
                console.log(`Row inserted with id ${item.id}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

// Ftech data monthwise

const fetchDataMonthWise = async (queryMonth) => {
    try {
        const selectQuery = `
            SELECT
                *
            FROM
                product
            WHERE strftime("%m", dateOfSale) = ?;
        `
        const theValues = await db.all(selectQuery, [queryMonth.toString()]);

        return theValues;
    } catch (err) {
        console.error(err);
    }
};

// Fetch data by query parameter

const fetchTransaction = async (search, page=1, pageLimit=10) => {
    try {
        const offSet = (page - 1) * pageLimit;
        const limit = pageLimit

        let query = `SELECT * FROM product`;

        if (search) {
            const priceCondition = !isNaN(search)
                ? `price = ${parseFloat(search)}`
                : `price LIKE '%${search}%'`;
            query += ` WHERE title LIKE '%${search}%' OR description LIKE '%${search}%' OR ${priceCondition}`
        }

        query += ` LIMIT ${limit} OFFSET ${offSet}`;

        const transaction = await db.all(query);

        return transaction;
    } catch (err) {
        console.error(err);
    }
};

// fetch data by statistically 

const getStatistcs = async (queryMonth) => {
    try {
        const statQuery = `
        SELECT 
            SUM(price) AS totalSaleAmount,
            COUNT(CASE WHEN sold = 1 THEN 1 END) AS totalSoldItems,
            COUNT(CASE WHEN sold = 0 THEN 1 END) AS totalUnsoldItems
        FROM
            product
        WHERE strftime('%m', dateOfSale) = ?;
        `;

        const stat = await db.all(statQuery, [queryMonth.toString()]);

        return stat;
    } catch (err) {
        console.error(err);
    }
};

//fetch data for bar-statistic

const fetchDataForBarStatistic = async (queryMonth) => {
    try {
        const statQuery = `
            SELECT
                CASE
                    WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
                    WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
                    WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
                    WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
                    WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
                    WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
                    WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
                    WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
                    WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
                    WHEN price >= 901 THEN '901 - ABOVE'
                END AS price_range,
                COUNT(*) AS item_count
            FROM 
                product
            WHERE strftime('%m', dateOfSale) = ?
            GROUP BY price_range
            ORDER BY price_range;
        `;

        const theValues = await db.all(statQuery, [queryMonth.toString()]);

        return theValues;
    } catch (err) {
        console.error(err);
    }
};

// fetch data for pie-chart

const fetchDataForPieChart = async (queryMonth) => {
    try {
        const queryForPieChart = `
            SELECT
                category,
                COUNT(*) AS item_count
            FROM 
                product
            WHERE strftime('%m', dateOfSale) = ?
            GROUP BY category;
        `;
        const theValues = await db.all(queryForPieChart, [queryMonth.toString()]);

        return theValues;
    } catch (err) {
        console.error(err);
    }
};

//fetch combined data 

const fetchCombinedData = async (queryMonth) => {
    try {
        const statisticData = await axios.get(`http://localhost:3002/statistics/${queryMonth}`);
        const barChartData = await axios.get(`http://localhost:3002/bar-chart/${queryMonth}`);
        const pieChartData = await axios.get(`http://localhost:3002/pie-chart/${queryMonth}`);

        const theCombinedValue = {
            statistic: statisticData.data,
            barChart: barChartData.data,
            pieChart: pieChartData.data,
        };

        return theCombinedValue;
    } catch (err) {
        console.error(err);
    }
};

initializeDB();

//Insert data based on month

app.get('/product/:month', async (req, res) => {
    try {
        const {month} = req.params;
        await fetchSortAndInsert(month);

        const getQuery = `SELECT * FROM product;`
        const data = await db.all(getQuery);
        
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send('Interval Error');
    }
});

//Fetch data based on month

app.get('/products/:month', async (req, res) => {
    try {
        const {month} = req.params;
        const fetchedDataMonthly = await fetchDataMonthWise(month);

        res.json(fetchedDataMonthly);
    } catch (err) {
        console.error(err);
        res.status(500).send("Interval Error");
    }
});

// Fetch data by query parameter

app.get('/transactions/', async (req, res) => {
    try {
        const {search, page, pageLimit} = req.query;
        const transaction = await fetchTransaction(search, page || 1, pageLimit || 10);
        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).send('Interval Error')
    }
});

// fetch data by statistically 

app.get('/statistics/:month', async (req, res) => {
    try {
        const { month } = req.params;
        const statistic = await getStatistcs(month);

        res.json(statistic);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
});

// for bar chart

app.get('/bar-chart/:month', async (req, res) => {
    try{
        const {month} = req.params;
        const barStatistic = await fetchDataForBarStatistic(month);

        res.json(barStatistic);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//fetch data for pie-chart

app.get('/pie-chart/:month', async (req, res) => {
    try {
        const {month} = req.params;
        const pieChart = await fetchDataForPieChart(month);

        res.json(pieChart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//fetch the combined data 

app.get('/combined-data/:month', async (req, res) => {
    try {
        const {month} = req.params;
        const theCombinedData = await fetchCombinedData(month);

        res.json(theCombinedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});