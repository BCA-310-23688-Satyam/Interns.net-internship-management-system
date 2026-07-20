const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "internship-management-server"
  });
};

module.exports = {
  getHealthStatus
};
