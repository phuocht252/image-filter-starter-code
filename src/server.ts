import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    app.get("/filteredimage", async (req, res) => {
        const image_url = req.query.image_url as string;
        if (!image_url) {
            return res.status(400).send({message: 'image_url is required'});
        }
        console.log("image_url: " + image_url);
        try {
            var filteredPath = await filterImageFromURL(image_url);
            res.status(200).sendFile(filteredPath);
            res.on("finish", async () => {
                await deleteLocalFiles([filteredPath]);
            });
        } catch (e) {
            res.status(500).send({message: e.toString()});
        }
    });

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();