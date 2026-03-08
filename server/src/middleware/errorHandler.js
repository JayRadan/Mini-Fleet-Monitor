
const errorHandler = (err, _req, res, _next) => {
    console.error("Global error handler:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
}
export default errorHandler;