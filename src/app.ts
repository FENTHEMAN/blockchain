import { createServer, request } from "http";
import { createBlockchain } from "./blockchain/blockchain.js";

const ports = [3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010];

ports.forEach(localPort => {
    const blockchain = createBlockchain();

    const httpServer = createServer(async (req, res) => {
        console.log(req.url);

        if (req.url === "/get") {
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(blockchain.chain));
        }

        if (req.url === "/add") {
            let body = "";

            req.on("data", data => {
                body += data;
            });

            req.on("end", async () => {
                try {
                    const newBlockData = JSON.parse(body);
                    blockchain.addBlock(newBlockData);

                    const syncPromises = ports
                        .filter(port => port !== localPort)
                        .map(port => {
                            return new Promise((resolve, reject) => {
                                const reqToOtherServer = request(
                                    {
                                        hostname: "localhost",
                                        port: port,
                                        path: "/sync",
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Content-Length":
                                                Buffer.byteLength(body),
                                        },
                                    },
                                    response => {
                                        response.on("data", () => {});
                                        response.on("end", resolve);
                                    }
                                );

                                reqToOtherServer.on("error", reject);
                                reqToOtherServer.write(body);
                                reqToOtherServer.end();
                            });
                        });

                    await Promise.all(syncPromises);

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ blockchain }));
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                }
            });

            return;
        }

        if (req.url === "/sync") {
            let body = "";

            req.on("data", data => {
                body += data;
            });

            req.on("end", () => {
                try {
                    const newBlockData = JSON.parse(body);
                    blockchain.addBlock(newBlockData);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ blockchain }));
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Invalid JSON" }));
                }
            });

            return;
        }

        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not Found");
    });

    httpServer.listen(localPort, () => {
        console.log(`Listening on http://localhost:${localPort}`);
    });
});
