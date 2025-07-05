const verifyDocument = (documentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses = ['verified', 'pending', 'rejected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      resolve(randomStatus);
    }, 1000);
  });
};

module.exports = {
  verifyDocument,
};